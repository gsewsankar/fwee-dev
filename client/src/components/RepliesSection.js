import React, { useState } from 'react';
import './RepliesSection.css';
import Loading from './Loading';
import Reply from './Reply.js';

import {auth, db} from '../firebaseInitialize';
import { collection, orderBy, query, addDoc, serverTimestamp, updateDoc, doc } from "firebase/firestore";

import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';

const RepliesSection = (props) => {
    const[user, authLoading] = useAuthState(auth);
    const[repliesData, repliesLoading] = useCollectionData(query(collection(db,'items',props.itemID,'comments', props.commentID, 'replies'),orderBy("createdAt", "asc")));
    const [replyText, setReplyText] = useState("");
    
    if(authLoading || repliesLoading){
        return(<Loading/>)
    }
    
    async function sendReply(e){
        if(replyText.trim() !== ""){
            const replyID =( await addDoc(collection(db,'items',props.itemID,'comments',props.commentID, 'replies'),{
                createdAt: serverTimestamp(),
                body: replyText,
                uid: user.uid,
                like: false
            })).id;
            await updateDoc(doc(db,'items',props.itemID,'comments',props.commentID, 'replies', replyID),{id:replyID});

        }
        else{
            console.log('reply is empty');
        }
        document.getElementById('reply-text').value="";
    };

    const handleKeyDown = (e) =>{
        if(e.key === 'Enter'){
          sendReply();
        }
      }

    return( 
        
        <div className='replies-section'>   
            {repliesData && repliesData.map(reply=>{
                return (<Reply info={reply} itemID ={props.itemID} commentID = {props.commentID} replyID = {reply.id}  />);
            })}    

            <div className='reply-input-box'>
            <input id="reply-text" type="text" onChange={ e => setReplyText(e.target.value)} onKeyDown={handleKeyDown}/>
            <button className='send-comment-button' onClick={(e) => sendReply(e)}><FontAwesomeIcon icon={faAngleDoubleRight}/></button>
 
            </div>          
        </div>
        
        
    )
  }

export default RepliesSection;

