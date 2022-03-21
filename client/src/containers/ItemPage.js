//UPDATED to v9 on 12-8-2021

import React,{useEffect, useState} from 'react';
import './ItemPage.css';
import Loading from '../components/Loading';
import LockedItem from '../components/LockedItem';

import {db, auth} from '../firebaseInitialize';
import { collection, doc, getDoc, limit, orderBy, query, where, getDocs } from "firebase/firestore";

import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

import { useParams } from 'react-router-dom';
import Comment from '../components/Comment';
import ShareButton from '../components/ShareButton';

function ItemPage(){

  const { itemid } = useParams();  
  const[user, authLoading] = useAuthState(auth);
  const[itemData, itemLoading] = useDocumentData(doc(db,'items',itemid));
  const[ownerData, ownerLoading] = useDocumentData(itemData&&doc(db,'users',itemData.owner));
  const[commentsData, commentsLoading] = useCollectionData(query(collection(db,'items',itemid,'comments')));
  const[locked, setLocked] = useState(true);
  const[likesNum, setLikesNum] = useState(0);
  const[recs, setRecs] = useState([]);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  useEffect(()=>{
    async function fetchData(){
      let itemsRef = collection(db,'items');
      if(itemData){
        let q1 = (await getDocs(query(itemsRef, where("category", "==", itemData.category),orderBy("createdAt", "desc"),limit(5)))).docs;
        setRecs(q1);
        let q2 = (await getDocs(query(collection(db,'items',itemid,'likes')))).size;
        setLikesNum(q2);
      }
    }

    user && fetchData();
  },[user,itemData,itemid]);
  
  if(itemLoading || authLoading || ownerLoading || commentsLoading){
    return(<Loading/>);
  }

  if(!user){
    return(<div>Sign in to Buy Item</div>);
  }

  //check if item exists in purchases
  const q = getDoc(doc(db,'users',user.uid));

  q.then((docSnapshot) => {
        docSnapshot.data().purchases.forEach((id)=>{
          if(id === itemid){
            setLocked(false);
          }
      });
  });

  function renderAudio(){
    return(
      <>
      {itemData.albumArt&&<img width="300px" height="auto" src={itemData.albumArt} alt="aa"></img>}
      <br/>
      <audio controls src={itemData.location}/>
      </>
    );
  }

  //signed in and item is owned
  return(locked ? <LockedItem itemID={itemid}/> :
    <>
    <div className="item-page">
        {(itemData.category === 'art' || itemData.category === 'image') &&<img src={itemData.location} alt={"broken"}></img>}
        {(itemData.category === 'audio') && renderAudio()} 
        {(itemData.category === 'link') && <a href={itemData.url} target="_blank" rel="noopener noreferrer"><p>{itemData.url}</p></a>}
        {(itemData.category === 'thought') && <p>{itemData.thought}</p>}
        {(itemData.category === 'video') && <video src={itemData&&itemData.location} controls></video>}
        <h1>{itemData&&itemData.title} by {ownerData&&ownerData.displayName}</h1>
        <p><b>Description:</b> {itemData&&itemData.description + " " + months[itemData.createdAt.toDate().getMonth()] + " " + itemData.createdAt.toDate().getDate().toString() + ", " + itemData.createdAt.toDate().getFullYear().toString()}</p>
        <p><b>Worth-Value:</b> {itemData&&(itemData.buyers.length * itemData.price).toFixed(2)} credits</p>
        <p><b>Smile Rating:</b> {itemData&&((likesNum/itemData.buyers.length)*(100)).toFixed(2)}%</p>
        
    </div>
      <ShareButton url={"https://fwee.io/item/"+itemid}/>
      <h2>Comments</h2>
      {commentsData.map(cmnt => {return(<Comment info={cmnt} itemID={itemid}/>)})}
      <h2>Item Recommendations</h2>
      {recs.map(item=>{return(<LockedItem itemID={item.id}/>)})}
    </>
  )
}

export default ItemPage;