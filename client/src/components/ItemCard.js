import React, {useState} from 'react';
import './ItemCard.css';
import Loading from '../components/Loading';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

import { useDocumentData } from 'react-firebase-hooks/firestore';

function ItemCard(props){
    
    const db = firebase.firestore();
    const [itemData, itemLoading] = useDocumentData(db.collection('items').doc(props.itemID));
    const bucket = firebase.storage();
    const[URL, setURL] = useState("");
    bucket.ref(itemData&&itemData.location).getDownloadURL().then(url=>setURL(url));

    if(itemLoading){
      return(<Loading/>);
    }

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return(
      <div className="card">
          <h3>{itemData && itemData.title}</h3>
          <img width="300px" height="auto" src={URL} alt={"broken"}></img>
          <p>{itemData && months[itemData.createdAt.toDate().getMonth()] + " " + itemData.createdAt.toDate().getDate().toString() + ", " + itemData.createdAt.toDate().getFullYear().toString()}</p>
      </div>
    )
  }

export default ItemCard;