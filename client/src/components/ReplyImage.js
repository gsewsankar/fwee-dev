//updated to v9 on 12-8-2021

import React, { useState } from 'react';
import './ItemCard.css';
import Loading from '../components/Loading';
import LikeButton from './LikeButton';
import VideoCard from './all_cards/VideoCard';
import Comment from './Comment.js';
import {auth, db, firebaseApp} from '../firebaseInitialize';
import { doc, collection, orderBy, query, addDoc, serverTimestamp, updateDoc } from "firebase/firestore";

import { Link } from "react-router-dom";
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faBook, faCamera, faComments, faCube, faEye, faGamepad, faLink, faMusic, faPalette, faVideo } from '@fortawesome/free-solid-svg-icons';



export  const ReplyImage = (props)=>{
    try{
    const[writer, writerLoading] = useDocumentData(doc(db,'users',props.id));

    if(writerLoading){
        return(<div></div>);
    }
 

    return(
        <div>
        <img src={writer && writer.photoURL} alt="brkn"></img>

        </div>
    )
    }
    catch{
        return <div></div>
    }
  }

