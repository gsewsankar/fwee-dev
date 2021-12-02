import React, { useState } from 'react';
import './ItemCard.css';
import Loading from '../components/Loading';
import LikeButton from './LikeButton';
import VideoCard from './all_cards/VideoCard';
import Comment from './Comment.js';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage';

import { Link } from "react-router-dom";

import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faBook, faCamera, faComments, faCube, faEye, faGamepad, faLink, faMusic, faPalette, faVideo } from '@fortawesome/free-solid-svg-icons';


function ItemCard(props){
    const db = firebase.firestore();
    const[user] = useAuthState(firebase.auth());
    const[itemData, itemLoading] = useDocumentData(db.collection('items').doc(props.itemID));
    const[ownerData, ownerLoading] = useDocumentData(db.collection('users').doc(itemData && itemData.owner));
    const[commentData, commentsLoading] = useCollectionData(db.collection('items').doc(props.itemID).collection("comments").orderBy("createdAt", "asc"));
    const[showComments, setShowComments]= useState(false);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let category = faEye;
    let cat_name = "";

    if(ownerLoading || itemLoading || commentsLoading){
      return(<Loading/>);
    }

    if(itemData.category === 'image'){
      category = faCamera;
      cat_name = 'image';
    }

    if(itemData.category === 'video'){
      category = faVideo;
      cat_name = 'video';
    }

    if(itemData.category === 'music'){
      category = faMusic;
      cat_name = 'music';
    }

    if(itemData.category === 'art'){
      category = faPalette;
      cat_name = 'art';
    }

    if(itemData.category === 'story'){
      category = faBook;
      cat_name = 'story';
    }

    if(itemData.category === 'model'){
      category = faCube;
      cat_name = 'model';
    }

    if(itemData.category === 'game'){
      category = faGamepad;
      cat_name = 'game';
    }

    if(itemData.category === 'link'){
      category = faLink;
      cat_name = 'link';
    }

    let comment_body;

    const sendComment = () =>{
      if(comment_body !== ""){
        db.collection('items').doc(props.itemID).collection("comments").add({
          uid:user&&user.uid,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          body: comment_body
        });
      }
      document.getElementById('comment-text').value="";
    };

    const handleKeyDown = (e) =>{
      if(e.key === 'Enter'){
        sendComment();
      }
    }

    if(showComments){
      return((ownerData&&itemData) ?
      <div className="card">
        <button onClick={()=>setShowComments(false)}>close</button>
        <div className="comments-container">
        {commentData && commentData.map(comment=>{
          return(<Comment info={comment}/>)})}
        </div>
        <input id="comment-text" type="text" onKeyDown={handleKeyDown} onChange={(e)=>{comment_body=e.target.value}}></input><button onClick={sendComment}>send</button>
      </div>:<Loading/>);
    }

    return((ownerData&&itemData)?
     <div className="card">
        <FontAwesomeIcon className={cat_name} icon={category}/>
        <Link to={'/'+ ownerData.username}>
        <div className="top-row">
          <img className="pp" src={ownerData.photoURL} alt="broken"/>
          <p>{ownerData.username}</p>
        </div>
        </Link>
        <Link to={'/item/'+itemData.id}><h3>{itemData.title}</h3>
          {(itemData.category === 'art' || itemData.category === 'image') &&<img width="300px" height="auto" src={itemData.location} alt={"broken"}></img>}
          {(itemData.category === 'video') && <VideoCard itemID={props.itemID}/>}
        </Link>
          <p><FontAwesomeIcon icon={faEye}/> {itemData&&itemData.buyers.length}</p>
          <p>{itemData.description + " " + months[itemData.createdAt.toDate().getMonth()] + " " + itemData.createdAt.toDate().getDate().toString() + ", " + itemData.createdAt.toDate().getFullYear().toString()}</p>
          <button onClick={()=>setShowComments(true)}><FontAwesomeIcon className="commentbtn" icon={faComments}/> {commentData.length}</button>
          <LikeButton itemID={props.itemID}/>
      </div>:<Loading/>
    );
  }

export default ItemCard;