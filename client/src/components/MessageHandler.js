import {useEffect,useReducer} from 'react'
import Gun from 'gun'

var gunPeer = Gun({
    peers: [
    'http://localhost:1900/gun'
    ]

 })
 const messages = {messageArray: []}

 function reducer(curr, receivedMessage)
 {
    return {
            messageArray: [receivedMessage, ...curr.messageArray]
    }
 }

 export const MessageHandler = () =>{
    const [messageState, setMessageState] = useReducer(reducer, messages)
        console.log("hiuqedjqw");

    useEffect(() =>{
        const currData = gunPeer.get('data')
        // update messages array with whatever is in the database using reducer
        // reducer is different from useState as it optimizes performance for deep updates
        // and is more predictable and easier for our use case
        currData.map().on(m => {
            setMessageState({
                to: currData.to,
                from: currData.from,
                amount: currData.amount,
                time: currData.date
            })
        })

    }, [])
    return(null)

 }

