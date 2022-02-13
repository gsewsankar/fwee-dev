import {useEffect,useReducer, useRef, useState} from 'react'
import Gun from 'gun/gun'
import 'gun/sea'
import 'gun/axe'
const SHA256 = require('crypto-js/sha256');

 var gunPeer = Gun(

        ['https://fwee-gun-relay-node.herokuapp.com/gun']
    
    
 );


 const messages = {messageArray: []}
 const messages2 = {messageArray: []}

 function reducer(curr, receivedMessage, /*action*/)
 {
    switch (receivedMessage.type)
     {
         case 'replace':
            return{
                messageArray: receivedMessage.replacer
            }     
          default:
            return {
                messageArray: [receivedMessage, ...curr.messageArray]
             }
       }

 }

 export  const MessageHandler = (props) =>{
    const [messageState, setMessageState] = useReducer(reducer, messages)
    const [tempState, setTempState] = useReducer(reducer, messages2)


    const isMounted = useRef(true);
    const calculateHash = (currentBlock) =>{
        return SHA256(currentBlock.key + currentBlock.previousHash + currentBlock.time).toString();
    }

    const createHashChain = () =>{
        if(tempState.messageArray.length > 10){
            var temp = JSON.parse(JSON.stringify(tempState.messageArray))
            for(let i = temp.length-1; i > 0; i--){
                var prevBlock = temp[i];

                var currentBlock=null;
                if(i != 0)
                    currentBlock = temp[i-1];
                else
                    currentBlock = null

                if(i == temp.length-1)

                {
                    
                    prevBlock.previousHash = null
                    prevBlock.hash = calculateHash(prevBlock)

                    
                    currentBlock.previousHash = prevBlock.hash
                    currentBlock.hash = calculateHash(currentBlock)
                }
                else if(i==0)
                {
                            prevBlock.previousHash = temp[1].hash

                            prevBlock.hash = calculateHash(prevBlock)
                }
                else 
                {

                    currentBlock.previousHash = prevBlock.hash
                    currentBlock.hash = calculateHash(currentBlock)

                }
            }
            temp.sort((b, a) => a.time.valueOf() - b.time.valueOf())

            setMessageState({replacer: temp, type: 'replace'})

                for(let i = temp.length-1; i > 0; i--){
                        var prevBlock = temp[i];
                        var currentBlock=null;
                        if(i != 0)
                            currentBlock = temp[i-1];

                        else
                            currentBlock = null
        
                        if(i==0)
                        {

                                if(prevBlock.previousHash !== temp[1].hash)
                                {   

                                            return false;
                                }
                        }
                        if(currentBlock.hash != calculateHash(currentBlock)){
                                return false;
                        }
        
                        if(currentBlock.previousHash != calculateHash(prevBlock)){


                                return false;
                        }
        
                    }
                    return true;
        
                
        }
    }
 
     useEffect(() =>{
        // update messages array with whatever is in the database using reducer
        // reducer is different from useState as it optimizes performance for deep updates
        // and is more predictable and easier for our use case

                let user = gunPeer.user()
                if(!user.is){

                user.auth('fweeMessageChain', process.env.REACT_APP_TRANSACTION_SYSTEM_API_KEY)
                gunPeer.on('auth', event  => {
                     user.get('transactions').map().once((m, index) => {
                           setTempState({
                               to: m.to,
                               from: m.from,
                               amount: m.amount,
                               time: m.time,
                               key: index

                           })
                           

                       })
                       


                   })
            }
            else
            {
                user.get('transactions').map().once( (m, index) => {
                    setTempState({
                        to: m.to,
                        from: m.from,
                        amount: m.amount,
                        time: m.time,
                        key: index

                    })
                    
                    

                })


            }
                
            

               


                
            return () => {
                    gunPeer.off(); 
                    isMounted.current = false
                }

    
        

    }, [])
    useEffect(() =>{
      console.log(createHashChain())
    
        

    }, [tempState.messageArray])
    
    
    
    return(
        <div>

        {props.display ?

            messageState.messageArray.map(message => (
                <div key={message.key}>
                <h1>From: {message.from}</h1>


                <h3>Amount: {message.amount}</h3>
                <h3>To: {message.to}</h3>
                <h3>Date: {message.time}</h3>
                <h3>Hash: {message.hash}</h3>

                <hr></hr>
                
                </div>
            ))
            : null
    
    
    }
    </div>)

 }

