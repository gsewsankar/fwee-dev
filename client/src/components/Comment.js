//updated to v9 on 12-8-2021

import React, {useEffect, useReducer, useState} from 'react';
import './Comment.css';
import RepliesSection from './RepliesSection.js';

import {db} from '../firebaseInitialize';
import { collection, doc, getDocs, query } from "firebase/firestore";
import {useDocumentData} from 'react-firebase-hooks/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import CommentLike from './CommentLike'
function Comment(props){
    const[writer, writerLoading] = useDocumentData(doc(db,'users',props.info.uid));
    const [showReplies, setShowReplies] = useState(false);
    const[replyNum, setReplyNum] = useState(0);

    useEffect(()=>{
        async function fetchData(){
            let colSnap = (await getDocs(query(collection(db,'items',props.itemID,'comments',props.info.id,'replies')))).size;
            setReplyNum(colSnap); 
        }
        fetchData();
    },[props.itemID,props.info.id]);

    if(writerLoading){
        return(<div></div>);
    }
    
    return(
        <>
        <div className="comment">
            <img src={writer && writer.photoURL} alt="brkn"></img>
            <p>{props.info.body}</p>
            <CommentLike itemID={props.itemID} commentID={props.info.id} />

        </div>
        {showReplies ? <RepliesSection itemID={props.itemID} commentID={props.info.id} /> : 
        <button className='reply-button' onClick={()=>setShowReplies(!showReplies)}><FontAwesomeIcon icon={faReply}/> reply ({replyNum})</button>}
        {showReplies&&<button className='hide-replies-btn' onClick={()=>setShowReplies(!showReplies)}><FontAwesomeIcon icon={faAngleUp}/> hide replies</button>}
        </>
    )
  }

export default Comment;