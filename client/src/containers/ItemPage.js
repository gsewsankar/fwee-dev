import React,{useState} from 'react';
import Loading from '../components/Loading';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

import { useParams } from 'react-router-dom';
import LockedItem from '../components/LockedItem';

function ItemPage(){

  const { itemid } = useParams();  
  const db = firebase.firestore();
  const[user, authLoading] = useAuthState(firebase.auth());
  const[locked, setLocked] = useState(true);
  const[itemData, itemLoading] = useDocumentData(db.collection('items').doc(itemid));
  const[ownerData, ownerLoading] = useDocumentData(db.collection('users').doc(itemData&&itemData.owner));

  //const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  if(itemLoading || authLoading || ownerLoading){
    return(<Loading/>);
  }

  if(!user){
    return(<div>Sign in to Buy Item</div>);
  }

  //check if item exists in purchases
  const query = db.collection('users').doc(user.uid);

  query.get().then((docSnapshot) => {
    docSnapshot.data().purchases.forEach((id)=>{
      if(id === itemid){
        setLocked(false);
      }
    });
  });

  //signed in but item is locked
  if(locked){
    return(<LockedItem itemID={itemid}/>);
  }

  //signed in and item is owned
  return(
    <div>
        <h1>{itemData&&itemData.title}</h1>
        <img src={itemData&&itemData.location} alt="brkn"/>
        <h1>{ownerData.displayName}</h1>
    </div>
  )
}

export default ItemPage;