import {useEffect,useReducer} from 'react'
import {gunJs} from 'gun'


var gunPeer = gunJs({
    peers: [
    'http://localhost:1900/gun'
    ]

 })
 const messages = {messageArray: []}

 function reducer(curr, receivedMessage)
 {
    return{
            messageArray: [messageArray, ...curr.messageArray]
    }
 }

 function MessageHandler(){
    const [messageState, setMessageState] = useReducer(reducer, messages)
    useEffect(() =>{
        const currData = gunPeer.get('data')
        // update messages array with whatever is in the database using reducer
        // reducer is different from useState as it optimizes performance for deep updates
        // and is more predictable and easier for our use case


    }, [])

 }

 export default MessageHandler;