import React,{useState} from 'react';
import Loading from '../components/Loading';
import LockedItem from '../components/LockedItem';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

import { useParams } from 'react-router-dom';

function ItemPage(){

  const { itemid } = useParams();  
  const db = firebase.firestore();
  const[user, authLoading] = useAuthState(firebase.auth());
  const[itemData, itemLoading] = useDocumentData(db.collection('items').doc(itemid));
  const[ownerData, ownerLoading] = useDocumentData(db.collection('users').doc(itemData&&itemData.owner));
  const[locked, setLocked] = useState(true);

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

  //signed in and item is owned
  return(locked ?<LockedItem itemID={itemid}/> :
    <div>
        <h1>{itemData&&itemData.title}</h1>
        {(itemData.category === 'art' || itemData.category === 'image') &&<img src={itemData.location} alt={"broken"}></img>}
        {(itemData.category === 'video') && <video src={itemData&&itemData.location} width="600px" height="auto" controls></video>}
        <h1>{ownerData.displayName}</h1>
    </div>
  )
}

export default ItemPage;