import {useEffect,useReducer} from 'react'
import Gun from 'gun'

 var gunPeer = Gun();

 const messages = {messageArray: []}

 function reducer(curr, receivedMessage)
 {
    return {
            messageArray: [receivedMessage, ...curr.messageArray]
    }
 }

 export const MessageHandler = (props) =>{
    const [messageState, setMessageState] = useReducer(reducer, messages)

    useEffect(() =>{
        const currData = gunPeer.get('transactions')
        // update messages array with whatever is in the database using reducer
        // reducer is different from useState as it optimizes performance for deep updates
        // and is more predictable and easier for our use case
        currData.map().once(m => {
            setMessageState({
                to: m.to,
                from: m.from,
                amount: m.amount,
                time: m.time
            })
        })

    }, [])
    //console.log(messageState);
    return(
        <div>
        {props.display ?
            messageState.messageArray.map(message => (
                <div key={message.time}>
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

