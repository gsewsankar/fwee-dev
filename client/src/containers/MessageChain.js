//updated to v9 on 12-8-2021

import React,{useState,useEffect}  from 'react';
import './Dashboard.css';
import {MessageHandler} from '../components/MessageHandler'



function MessageChain(){
    return(
        <MessageHandler display={true}/>

    )
  }

export default MessageChain;