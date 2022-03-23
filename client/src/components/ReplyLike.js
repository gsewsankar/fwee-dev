//updated to v9 on 12/7/2021

import React,{useState,useEffect} from 'react';

import {auth, db} from '../firebaseInitialize';
import { doc, collection, getDocs, addDoc, deleteDoc, serverTimestamp, getDoc } from "firebase/firestore";

import { useAuthState } from 'react-firebase-hooks/auth';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as openHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

function ReplyLike(props){
    const[user] = useAuthState(auth);
    const[liked,setLiked] = useState(false);
    const[likeNum,setLikeNum] = useState(0);

    useEffect(()=>{

        async function fetchData(){
          (await getDocs(collection(db,'items',props.itemID,'comments', props.commentID, 'replies', props.replyID, 'likes'))).forEach(doc=>{
            if(doc.data().uid === user.uid){
              setLiked(true);
            }
          });
          setLikeNum((await getDocs(collection(db,'items',props.itemID,'comments', props.commentID, 'replies', props.replyID, 'likes'))).size);
        }
        user && fetchData();
    },[props.replyID, user]);

    async function likeButton(){
        if(liked){
          //delete like
          let idToDelete;
          const q1 = (await getDocs(collection(db,'items',props.itemID,'comments', props.commentID, 'replies', props.replyID, 'likes')));
          q1.forEach(doc=>{
            if(doc.data().uid === user.uid){
              idToDelete = doc.id;
            }
          });
          await deleteDoc(doc(db,'items',props.itemID,'comments', props.commentID, 'replies', props.replyID, 'likes', idToDelete));

          //send unlike notification
          /*await addDoc(collection(db,'users',(await getDoc(doc(db,'items',props.itemID))).data().owner,'notifications'), {
            type:'unlike',
            who:user.uid,
            itemID:props.itemID,
            time:serverTimestamp(),
          });*/
        }
        else{
          //add like
          await addDoc(collection(db,'items',props.itemID,'comments', props.commentID, 'replies', props.replyID, 'likes'), {
            uid:user.uid,
            createdAt:serverTimestamp(),
            itemid:props.replyID
          });

          //send notification
          /*await addDoc(collection(db,'users',(await getDoc(doc(db,'items',props.itemID))).data().owner,'notifications'), {
            type:'like',
            who:user.uid,
            itemID:props.itemID,
            time:serverTimestamp(),
          });*/
        }
        setLiked(!liked);
        setLikeNum((await getDocs(collection(db,'items',props.itemID,'comments', props.commentID, 'replies', props.replyID, 'likes'))).size);
      }

    return(
        <button onClick={likeButton}><FontAwesomeIcon className={liked ? "heart" : "notLiked"} icon={liked ? faHeart : openHeart}/> {likeNum}</button>
    )
  }

export default ReplyLike;