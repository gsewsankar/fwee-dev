import React,{useState,useEffect} from 'react';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as openHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

function LikeButton(props){
    const[user] = useAuthState(firebase.auth());
    const db = firebase.firestore();
    const[liked,setLiked] = useState(false);
    const[likeNum,setLikeNum] = useState(0);
    

    useEffect(()=>{
        async function fetchData(){
          (await db.collection('likes').where('itemid', '==', props.itemID).get()).docs.forEach(doc=>{
            if(doc.data().uid === user.uid){
              setLiked(true);
            }
          });
          setLikeNum((await db.collection('items').doc(props.itemID).get()).data().likes.length);
        }
        user && fetchData();
        
    },[db, props.itemID, user]);

    async function likeButton(){
        if(liked){
          //delete like
          let idToDelete;
          const q1 = (await db.collection('likes').where('itemid', '==', props.itemID).get()).docs
          q1.forEach(doc=>{
            if(doc.data().uid === user.uid){
              idToDelete = doc.id;
            }
          });
          db.collection('likes').doc(idToDelete).delete();
          db.collection('items').doc(props.itemID).update({
            likes: firebase.firestore.FieldValue.arrayRemove(idToDelete)
          }); 
        }
        else{
          //add like
          const ref = db.collection('likes').add({
            uid:user.uid,
            createdAt:firebase.firestore.FieldValue.serverTimestamp(),
            itemid:props.itemID
          });
          db.collection('items').doc(props.itemID).update({
            likes: firebase.firestore.FieldValue.arrayUnion((await ref).id)
          }); 
        }
        setLiked(!liked);
        setLikeNum((await db.collection('items').doc(props.itemID).get()).data().likes.length);
      }

    return(
        <button onClick={likeButton}><FontAwesomeIcon className={liked ? "heart" : "notLiked"} icon={liked ? faHeart : openHeart}/> {likeNum}</button>
    )
  }

export default LikeButton;