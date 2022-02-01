// upload messages to gun.js database
import Gun from 'gun'
var gunPeer = Gun();

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

