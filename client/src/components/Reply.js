//updated to v9 on 12-8-2021

import React from 'react';
import './Reply.css';
import {db} from '../firebaseInitialize';
import { doc } from "firebase/firestore";
import { useDocumentData } from 'react-firebase-hooks/firestore';
import ReplyLike from './ReplyLike'
const Reply = (props)=>{
    const[writer, writerLoading] = useDocumentData(doc(db,'users',props.info.uid));

    if(writerLoading){
        return(<div></div>);
    }
 
    return(
        <div className='reply'>
            <img src={writer && writer.photoURL} alt="brkn"></img>
            <p>{props.info.body}</p>
            <ReplyLike itemID ={props.itemID} commentID = {props.commentID} replyID = {props.replyID} />
        </div>
    )
}

export default Reply;
