// upload messages to gun.js database
import {useEffect,useReducer} from 'react'
import Gun from 'gun'
var gunPeer = Gun({
    peers: [
    'http://localhost:1900/gun'
    ]

 })
function MessageSender(props)
{
 const currMessages  = gunPeer.get(props.name)
 currMessages.set({
            to: props.to,
            from: props.from,
            amount: props.amount,
            time: props.date
        })

}