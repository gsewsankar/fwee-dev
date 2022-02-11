import {useEffect,useReducer, useRef, useState} from 'react'
import Gun from 'gun/gun'
import 'gun/sea'
import 'gun/axe'
const SHA256 = require('crypto-js/sha256');

 var gunPeer = Gun(

        ['https://fwee-gun-relay-node.herokuapp.com/gun']
    
    
 );


 const messages = {messageArray: []}

 function reducer(curr, receivedMessage, /*action*/)
 {
    /* switch (action.type)
     {*/
         /*case "addHash":
            return curr.map(f => f.index === action.obj.index ? ({ 
                ...f,
                hash: action.obj.hash,
              }) : f)     
        case "addPrev":
            return curr.map(f => f.index === action.obj.index ? ({ 
                ...f,
                prevHash: action.obj.prevHash,
              }) : f)                
          default:*/
            return {
                messageArray: [receivedMessage, ...curr.messageArray]
             }
       // }
   
 }

 export  const MessageHandler = (props) =>{
    const [messageState, setMessageState] = useReducer(reducer, messages)
    const [tempState, setTempState] = useState([])

    const isMounted = useRef(true);
    const calculateHash = (currentBlock) =>{
        return SHA256(currentBlock.key + currentBlock.previousHash + currentBlock.time).toString();
    }
    const createHashChain = () =>{
        if(messageState.messageArray.length > 10){
            for(let i = messageState.messageArray.length-1; i >= 0; i--){
                var prevBlock = messageState.messageArray[i];

                var currentBlock=null;
                if(i != 0)
                    currentBlock = messageState.messageArray[i-1];
                else
                    currentBlock = null

                if(i == messages.messageArray.length-1)
                {
                    
                    prevBlock.previousHash = null
                    prevBlock.hash = calculateHash(prevBlock)

                    
                    currentBlock.previousHash = calculateHash(prevBlock)
                    currentBlock.hash = calculateHash(currentBlock)
                }
                else if(i==0)
                {
                            prevBlock.previousHash = messageState.messageArray[1].hash
                            prevBlock.hash = calculateHash(prevBlock)
                }
                else 
                {

                    currentBlock.previousHash = prevBlock.hash
                    currentBlock.hash = calculateHash(currentBlock)

                }
            }
                for(let i = messageState.messageArray.length-1; i >= 0; i--){
                        var prevBlock = messageState.messageArray[i];
                        
                        var currentBlock=null;
                        if(i != 0)
                            currentBlock = messageState.messageArray[i-1];
                        else
                            currentBlock = null
        
                        if(i==0)
                        {
                                if(prevBlock.hash != calculateHash(messageState.messageArray[1]))
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
                gunPeer.on('auth',event  => {
                    user.get('transactions').map().once((m, index) => {
                           setMessageState({
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
                user.get('transactions').map().once((m, index) => {
                    setMessageState({
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
    
    return(
        <div>
            {console.log(createHashChain())}

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

