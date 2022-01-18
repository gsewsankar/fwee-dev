// upload messages to gun.js database
import {useEffect,useReducer} from 'react'
import {gunJs} from 'gun'
var gunPeer = gunJs({
    peers: [
    'http://localhost:1900/gun'
    ]

 })
function MessageSender(props)
{
 const currMessages  = gunPeer.get(props.name)
 currMessages.set({})
 

}