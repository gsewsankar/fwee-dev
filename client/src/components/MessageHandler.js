import {useEffect,useReducer, useRef, useState} from 'react'
import Gun from 'gun/gun'
import 'gun/sea'
import 'gun/axe'
import ReactLoading from 'react-loading';

const SHA256 = require('crypto-js/sha256');


 var gunPeer = Gun(

        ['https://fwee-gun-relay-node.herokuapp.com/gun']
    
    
 );



 export  const MessageHandler = (props) =>{
    const messages = {messageArray: []}
    const messages2 = {messageArray: []}
   
    function reducer(curr, receivedMessage)
    {
       switch (receivedMessage.type)
        {
            case 'replace':
               receivedMessage.replacer.sort((b, a) => a.time.valueOf() - b.time.valueOf())
   
               return{
   
                   messageArray: receivedMessage.replacer
               }     
             default:
               return {
                   messageArray: [receivedMessage, ...curr.messageArray]
                }
          }
   
    }
    const [messageState, setMessageState] = useReducer(reducer, messages)
    const [tempState, setTempState] = useReducer(reducer, messages2)
    const [loading, setLoading] = useState(true)

    const calculateHash = (blk) =>{
        return SHA256(blk.previousHash + blk.data).toString();
    }

    const createHashChain = () =>{
        if(tempState.messageArray.length > 2){
        

            var temp = JSON.parse(JSON.stringify(tempState.messageArray))
            for(let i = temp.length-1; i > 0; i--){
               
                var prevBlock = temp[i];

                var currentBlock=null;
                if(i != 0)
                    currentBlock = temp[i-1];
                else
                    currentBlock = null
                
             
                
                if(i === temp.length-1)

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
                        if(currentBlock.hash !== calculateHash(currentBlock)){
                                return false;
                        }
        
                        if(currentBlock.previousHash !== calculateHash(prevBlock)){


                                return false;
                        }
        
                    }
                    setMessageState({replacer: temp, type: 'replace'})

                    return true;
        
                
        }
    }
 const [firstTime, setFirstTime] = useState(false)

     useEffect(() =>{
        // update messages array with whatever is in the database using reducer
        // reducer is different from useState as it optimizes performance for deep updates
        // and is more predictable and easier for our use case
            console.log("mount")
                let user = gunPeer.user()

                if(!user.is){
                    setFirstTime(true)
                    user.auth('fweeMessageChainSecond', process.env.REACT_APP_TRANSACTION_SYSTEM_API_KEY)

                    gunPeer.on('auth', async(event)  => {
                      user.get('transactions').map().once( (m, index) => {
                        setTempState({
                            to: m.to,
                            from: m.from,
                            amount: m.amount,
                            time: m.time,
                            key: index,
                            hash: null,
                            previousHash: null
    
                        }, {wait: 1})
                    })


                   })
                    
                
            }
            else{
                    setLoading(false)                
                user.get('transactions').map().once( (m, index) => {

                    setTempState({

                        to: m.to,
                        from: m.from,
                        amount: m.amount,
                        time: m.time,
                        key: index,
                        hash: null,
                        previousHash: null

                    })
                    

                })
            }
 
                
               
            
                
            return () => {
                    gunPeer.off(); 
                    
                }


    
        

    }, [])
    useEffect(() =>{
        createHashChain()
        const delayDebounceFn = setTimeout(() => {
            if(firstTime)
            props.handler()

          }, 500)
      
          return () => clearTimeout(delayDebounceFn)
      
     
        

    }, [tempState.messageArray])

  
    
    
    
    return(
        <div>
     {  loading?
         <ReactLoading type={'spin'} color={'black'} height={667} width={375} />
         : null
     }


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
    
    
    }</div>)

 }

