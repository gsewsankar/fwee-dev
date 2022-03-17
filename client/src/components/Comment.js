//updated to v9 on 12-8-2021

import React, {useState} from 'react';
import './Comment.css';
import RepliesSection from './RepliesSection.js';

import {db} from '../firebaseInitialize';
import { doc } from "firebase/firestore";
import {useDocumentData} from 'react-firebase-hooks/firestore';
function Comment(props){
    const[writer, writerLoading] = useDocumentData(doc(db,'users',props.info.uid));
    const [showReplies, setShowReplies] = useState(false);
    
    if(writerLoading){
        return(<div></div>);
    }
    
    return(
        <>
        <div className="comment">
            

            <img src={writer && writer.photoURL} alt="brkn"></img>
            <p>{props.info.body}</p>
        </div>
        {showReplies ? <RepliesSection itemID={props.itemID} commentID={props.info.id} /> : <button onClick={()=>setShowReplies(!showReplies)}>reply</button>}
        {showReplies&&<button onClick={()=>setShowReplies(!showReplies)}>hide replies</button>}
        </>
    )
  }

export default Comment;