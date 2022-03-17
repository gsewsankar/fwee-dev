import {useState} from 'react';
import './Dashboard.css';
import {MessageHandler} from '../components/MessageHandler'



function MessageChain(){
  const [id, setId] = useState("123");
const handler = () => {        
    setId(Math.random().toString())

  }

    return(
      <>

        <MessageHandler key ={id} handler = {handler}  display={true}/>
        </>
    )
  }

export default MessageChain;