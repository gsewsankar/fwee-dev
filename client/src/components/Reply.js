//updated to v9 on 12-8-2021

import React, { useState } from 'react';
import './ItemCard.css';
import Loading from '../components/Loading';
import LikeButton from './LikeButton';
import VideoCard from './all_cards/VideoCard';
import Comment from './Comment.js';
import {auth, db, firebaseApp} from '../firebaseInitialize';
import { doc, collection, orderBy, query, addDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { ReplyImage } from './ReplyImage'
import { Link } from "react-router-dom";
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faBook, faCamera, faComments, faCube, faEye, faGamepad, faLink, faMusic, faPalette, faVideo } from '@fortawesome/free-solid-svg-icons';



export  const Reply = (props)=>{
    const[replyData, replyLoading] = useCollectionData(query(collection(db,'items',props.itemID,'comments', props.commentID, 'replies'),orderBy("createdAt", "asc")));

    const [showText, setShowText] = useState(false)
    const [replyText, setReplyText] = useState("")

    const inputBox = (e) =>{
        e.preventDefault();
        setShowText(true)
        sendComment()

    }

    const sendComment = (e) =>{
        try{
            e.preventDefault()
            addDoc(collection(db,'items',props.itemID,'comments',props.commentID, 'replies'),{
                createdAt: serverTimestamp(),
                body: replyText,
                uid: props.commenter
              })
              setShowText(false)

        }
        catch{
          console.log('Comment is empty');
        }
      };
    


    return(
        <div>
            {
            showText ?   
                <div>   
                    {replyData && replyData.map(reply=>{
                        return (
                        <div>
                            <ReplyImage id={reply.uid} />
                            {reply.body}
                        </div>
                    )
                    })}      
                    <input type="text" onChange={ e => setReplyText(e.target.value)}/>
                    <button onClick={(e) => sendComment(e)}>send</button>
                </div>
                    :
                    ( 
                <div>
                    {replyData && replyData.map(reply=>{
                        return (
                                <div>
                                    <ReplyImage id={reply.uid} />
                                    {reply.body}
                                </div>
                            )
                    })}    
                    <button onClick={(e) => inputBox(e)}>Reply</button>
                </div>
               )
            }
        </div>
    )
  }
