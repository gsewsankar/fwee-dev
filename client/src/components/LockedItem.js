import React from 'react';
import './LockedItem.css';
import Loading from './Loading';
import BuyButton from './BuyButton';

import firebase from 'firebase/app';
import 'firebase/firestore';

import { useDocumentData } from 'react-firebase-hooks/firestore';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faCamera, faCube, faGamepad, faLink, faMusic, faPalette, faVideo, faTags } from '@fortawesome/free-solid-svg-icons';


function LockedItem(props){

  const db = firebase.firestore();
  const [itemData, itemLoading] = useDocumentData(db.collection('items').doc(props.itemID));
  const[ownerData, ownerLoading] = useDocumentData(db.collection('users').doc(itemData&&itemData.owner));
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let category;
  let cat_name = "";

  if(itemLoading || ownerLoading){
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
          <h3>{itemData && itemData.title}</h3>
          <p><FontAwesomeIcon icon={faTags}/> {itemData&&itemData.buyers.length}</p>
          <p>{itemData && itemData.description + " " + months[itemData.createdAt.toDate().getMonth()] + " " + itemData.createdAt.toDate().getDate().toString() + ", " + itemData.createdAt.toDate().getFullYear().toString()}</p>
          <BuyButton itemID={props.itemID}/>
      </div>
    )
  }

export default LockedItem;