import React from 'react';
import Loading from '../components/Loading';

import firebase from 'firebase/app';
import 'firebase/firestore';

import { useDocumentData } from 'react-firebase-hooks/firestore';

import { useParams } from 'react-router-dom';

function ItemPage(){

  const { itemid } = useParams();  
  const db = firebase.firestore();
  const [itemData, itemLoading] = useDocumentData(db.collection('items').doc(itemid));
  //const[ownerData, ownerLoading] = useDocumentData(db.collection('users').doc(itemData&&itemData.owner));
  //const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  if(itemLoading){
    return(<Loading/>);
  }

  return(
    <div>
        <h1>{itemData&&itemData.title}</h1>
    </div>
  )
}

export default ItemPage;