//updated to v9 on 12-8-2021

import React from 'react';
import './Reply.css';
import {db} from '../firebaseInitialize';
import { doc } from "firebase/firestore";
import { useDocumentData } from 'react-firebase-hooks/firestore';

const Reply = (props)=>{
    const[writer, writerLoading] = useDocumentData(doc(db,'users',props.info.uid));

    if(writerLoading){
        return(<div></div>);
    }
 
    return(
        <div className='reply'>
            <img src={writer && writer.photoURL} alt="brkn"></img>
            <p>{props.info.body}</p>
        </div>
    )
}

export default Reply;
