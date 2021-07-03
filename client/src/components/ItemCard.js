import React,{useState} from 'react';
import './ItemCard.css';
import Loading from '../components/Loading';
import LockedItem from './LockedItem';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

import { Link } from "react-router-dom";

import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faCamera, faComment, faCube, faEye, faGamepad, faHeart, faLink, faMusic, faPalette, faVideo } from '@fortawesome/free-solid-svg-icons';

function ItemCard(props){

    //console.log("item card loaded");

    const db = firebase.firestore();
    const[user, authLoading] = useAuthState(firebase.auth());
    const[locked, setLocked] = useState(true);
    const [itemData, itemLoading] = useDocumentData(db.collection('items').doc(props.itemID));
    const[ownerData, ownerLoading] = useDocumentData(db.collection('users').doc(itemData&&itemData.owner));
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let category = faEye;
    let cat_name = "";

    //check if item exists in purchases
    const query = db.collection('users').doc(user.uid);

    query.get().then((docSnapshot) => {
      docSnapshot.data().purchases.forEach((id)=>{
        if(id === props.itemID){
          setLocked(false);
        }
      });
    });

    if(!user || locked){
      return(<LockedItem itemID={props.itemID}/>);
    }

    if(authLoading || itemLoading || ownerLoading){
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

    return(
     <div className="card">
        <FontAwesomeIcon className={cat_name} icon={category}/>
        <div className="top-row">
          <img className="pp" src={ownerData && ownerData.photoURL} alt="broken"/>
          <p>{ownerData&&ownerData.username}</p>
        </div>
        <Link to={'/item/'+itemData.id}><h3>{itemData && itemData.title}</h3>
          {(itemData.category === 'art' || itemData.category === 'image') &&<img width="300px" height="auto" src={itemData&&itemData.location} alt={"broken"}></img>}
          </Link>
          <p><FontAwesomeIcon icon={faEye}/> {itemData&&itemData.buyers.length}</p>
          <p>{itemData && itemData.description + " " + months[itemData.createdAt.toDate().getMonth()] + " " + itemData.createdAt.toDate().getDate().toString() + ", " + itemData.createdAt.toDate().getFullYear().toString()}</p>
          <button><FontAwesomeIcon className="comment" icon={faComment}/> {itemData&&itemData.comments.length}</button>
          <button><FontAwesomeIcon className="heart" icon={faHeart}/> {itemData&&itemData.likes.length}</button>
      </div>
    )
  }

export default ItemCard;