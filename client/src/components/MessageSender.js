// upload messages to gun.js database
import Gun from 'gun/gun'
import 'gun/sea'

var gunPeer = Gun(
    ['https://fwee-gun-relay-node.herokuapp.com/gun']

)


export const MessageSender = (props) =>
{
    let user = gunPeer.user()
    if(!user.is){
    user.auth('fweeMessageChain', process.env.REACT_APP_TRANSACTION_SYSTEM_API_KEY)
  
    gunPeer.on('auth', event => {
         user.get('transactions').set({
            to: props.to,
            from: props.from,
            amount: props.amount,
            time: props.time
        })
    })


}
else{
    gunPeer.off()
    user.get('transactions').set({
        to: props.to,
        from: props.from,
        amount: props.amount,
        time: props.time
    })
}
        

}

