import React,{useState} from 'react';
import './LockedItem.css';
import BuyButton from './BuyButton';

import {auth, db} from '../firebaseInitialize';
import { doc, getDoc } from "firebase/firestore";

import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faCamera, faCube, faGamepad, faLink, faPalette, faVideo, faTags, faHeadphonesAlt, faLightbulb, faPoll } from '@fortawesome/free-solid-svg-icons';

import { Link } from "react-router-dom";
import ItemCard from './ItemCard';


function LockedItem(props){

  const[user, authLoading] = useAuthState(auth);
  const[locked, setLocked] = useState(true);
  const[itemData, itemLoading] = useDocumentData(doc(db,'items',props.itemID));
  const[ownerData, ownerLoading] = useDocumentData(itemData && doc(db,'users',itemData.owner));
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let category;
  let cat_name;

  if(authLoading || ownerLoading || itemLoading){
    return(<div className='locked-card'></div>);
  }

  if(itemData&&itemData.category === 'art'){
    category = faPalette;
    cat_name = 'art';
  }

  if(itemData&&itemData.category === 'audio'){
    category = faHeadphonesAlt;
    cat_name = 'audio';
  }

  if(itemData&&itemData.category === 'image'){
    category = faCamera;
    cat_name = 'image';
  }

  if(itemData&&itemData.category === 'link'){
    category = faLink;
    cat_name = 'link';
  }

  if(itemData&&itemData.category === 'thought'){
    category = faLightbulb;
    cat_name = 'thought';
  }

  if(itemData&&itemData.category === 'video'){
    category = faVideo;
    cat_name = 'video';
  }


  
  if(itemData&&itemData.category === 'document'){
    category = faBook;
    cat_name = 'document';
  }

  if(itemData&&itemData.category === 'game'){
    category = faGamepad;
    cat_name = 'game';
  }

  if(itemData&&itemData.category === 'model'){
    category = faCube;
    cat_name = 'model';
  }

  if(itemData&&itemData.category === 'poll'){
    category = faPoll;
    cat_name = 'poll';
  }

  //check if item exists in purchases
  if(user){
    const query = getDoc(doc(db,'users',user.uid));

    query.then((docSnapshot) => {
          docSnapshot.data().purchases.forEach((id)=>{
            if(id === props.itemID){
              setLocked(false);
            }
        });
    });
  }

  return((ownerData&&locked) ?
    <div className="locked-card">
        <FontAwesomeIcon className={cat_name} icon={category}/>
        <Link to={'/'+ownerData.username}>
        <div className="top-row">
        <img className="pp" src={ownerData && ownerData.photoURL} alt="broken"/>
        <p>{ownerData&&ownerData.username}</p>
        </div>
        </Link>
        <h3>{itemData && itemData.title}</h3>
        <p><FontAwesomeIcon icon={faTags}/> {itemData&&itemData.buyers.length}</p>
        <p>{itemData && itemData.description + " " + months[itemData.createdAt.toDate().getMonth()] + " " + itemData.createdAt.toDate().getDate().toString() + ", " + itemData.createdAt.toDate().getFullYear().toString()}</p>
        {user ? <BuyButton itemID={props.itemID}/> : <Link to="/join"><button>Sign in to Buy</button></Link>}
    </div>
    : <ItemCard itemID={props.itemID}/>);
}
  

export default LockedItem;