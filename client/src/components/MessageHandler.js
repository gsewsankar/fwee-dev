import {useEffect,useReducer, useRef} from 'react'
import Gun from 'gun/gun'
import 'gun/sea'
import 'gun/axe'

 var gunPeer = Gun(

        ['https://fwee-gun-relay-node.herokuapp.com/gun']
    
    
 );


 const messages = {messageArray: []}

 function reducer(curr, receivedMessage)
 {
    return {
            messageArray: [receivedMessage, ...curr.messageArray]
    }
 }

 export  const MessageHandler = (props) =>{
    const [messageState, setMessageState] = useReducer(reducer, messages)
    const isMounted = useRef(true);


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
                
                
               
            
                
            return () => {gunPeer.off(); isMounted.current = false}

    
        

    }, [])
    return(
        <div>
        {props.display ?
            messageState.messageArray.map(message => (
                <div key={message.key}>
                <h1>From: {message.from}</h1>


                <h3>Amount: {message.amount}</h3>
                <h3>To: {message.to}</h3>
                <h3>Date: {message.time}</h3>

                <hr></hr>
                </div>
            ))
            : null
    
    
    }</div>)

 }

