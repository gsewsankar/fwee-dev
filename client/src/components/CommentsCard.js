import React,{useState} from "react";
import ItemCard from "./ItemCard";
import Loading from "./Loading";
import Comment from "./Comment";

import {auth, db} from '../firebaseInitialize';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { collection, orderBy, query, addDoc, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleRight, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

function CommentsCard(props){
    const[user, authLoading] = useAuthState(auth);
    const[commentData, commentsLoading] = useCollectionData(query(collection(db,'items',props.itemID,'comments'),orderBy("createdAt", "asc")));
    const[showComments, setShowComments]= useState(true);
    
    if(authLoading||commentsLoading){
        return(<div className='card'><Loading/></div>);
    }
    
    let comment_body;

    async function sendComment()
    {
      if(comment_body !== ""){
        const commentID = (await addDoc(collection(db,'items',props.itemID,'comments'),{
          uid:user&&user.uid,
          createdAt: serverTimestamp(),
          body: comment_body
        })).id;
        await updateDoc(doc(db,'items',props.itemID, 'comments', commentID),{id:commentID});
      }
      else{
        alert('Comment is empty');
      }
      document.getElementById('comment-text').value="";
    };

    const handleKeyDown = (e) =>{
      if(e.key === 'Enter'){
        sendComment();
      }
    }

    if(showComments){
      return(
            <div className="card">
            <button className='close-cmt-btn' onClick={()=>setShowComments(false)}><FontAwesomeIcon icon={faTimesCircle}/> close</button>
            <div className="comments-container">
            {commentData && commentData.map(comment=>{
                return (<Comment key={comment.createdAt} info={comment} itemID={props.itemID}/>)
            })}
            </div>
            <input id="comment-text" type="text" onKeyDown={handleKeyDown} onChange={(e)=>{comment_body=e.target.value}}></input>
            <button className='send-comment-button' onClick={sendComment}><FontAwesomeIcon icon={faAngleDoubleRight}/></button>
            </div>
        );
    }
    else{
        return(<ItemCard itemID={props.itemID}/>);
    }
}

export default CommentsCard;