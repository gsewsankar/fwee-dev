//UPDATED to v9 on 12-8-2021

import React,{useState} from 'react';
import './ItemPage.css';
import Loading from '../components/Loading';
import LockedItem from '../components/LockedItem';

import {db, auth} from '../firebaseInitialize';
import { doc, getDoc } from "firebase/firestore";

import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

import { useParams } from 'react-router-dom';

function ItemPage(){

  const { itemid } = useParams();  
  const[user, authLoading] = useAuthState(auth);
  const[itemData, itemLoading] = useDocumentData(doc(db,'items',itemid));
  const[ownerData, ownerLoading] = useDocumentData(itemData&&doc(db,'users',itemData.owner));
  const[locked, setLocked] = useState(true);

  //const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  if(itemLoading || authLoading || ownerLoading){
    return(<Loading/>);
  }

  if(!user){
    return(<div>Sign in to Buy Item</div>);
  }

  //check if item exists in purchases
  const query = getDoc(doc(db,'users',user.uid));

  query.then((docSnapshot) => {
        docSnapshot.data().purchases.forEach((id)=>{
          if(id === itemid){
            setLocked(false);
          }
      });
  });

  //signed in and item is owned
  return(locked ?<LockedItem itemID={itemid}/> :
    <div className="item-page">
        <h1>{itemData&&itemData.title}</h1>
        {(itemData.category === 'art' || itemData.category === 'image') &&<img src={itemData.location} alt={"broken"}></img>}
        {(itemData.category === 'video') && <video src={itemData&&itemData.location} controls></video>}
        <h1>{ownerData.displayName}</h1>
        <h2>Comments</h2>
        <h2>Item Recommendations</h2>
    </div>
  )
}

export default ItemPage;