// upload messages to gun.js database
import {useEffect,useReducer} from 'react'
import Gun from 'gun/gun'
import 'gun/sea'
import 'gun/axe'

var gunPeer = Gun()


export const MessageSender = (props) =>
{
    let user = gunPeer.user()

    user.auth('fweeMessageChain',process.env.REACT_APP_TRANSACTION_SYSTEM_API_KEY)
  
    gunPeer.on('auth', event => {
         user.get('transactions').set({
            to: props.to,
            from: props.from,
            amount: props.amount,
            time: props.time
        })
    })
        

}

