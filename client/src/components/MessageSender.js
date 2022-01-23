// upload messages to gun.js database
import {useEffect,useReducer} from 'react'
import Gun from 'gun'
var gunPeer = Gun({
    peers: [
    'http://localhost:3030/gun'
    ]

 })
export const MessageSender = (props) =>
{
 const currMessages  = gunPeer.get('transactions')
 currMessages.set({
            to: props.to,
            from: props.from,
            amount: props.amount,
            time: props.time
        })
  
    

}

