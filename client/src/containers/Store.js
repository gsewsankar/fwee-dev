import React, { useEffect, useState } from 'react';
import './Store.css';
import SignOut from '../components/SignOut';
import Loading from '../components/Loading';
import ItemCard from '../components/ItemCard';
import NotFound from '../containers/NotFound';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

import { useParams } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit } from '@fortawesome/free-solid-svg-icons';

import {Link} from 'react-router-dom';

function Store(){

    const db = firebase.firestore();
    const { username } = useParams();    

    const[user, isLoading] = useAuthState(firebase.auth());
    const [storeid, setStoreid] = useState("default");
    const [storeData, storeLoading] = useDocumentData(db.collection('stores').doc(storeid));
    const[notFound, setNotFound] = useState(false);
    const[supporting, setSupporting] = useState(false);

    useEffect(() => {
      async function fetchData(){
        const ref1 = (await db.collection("usernames").doc(username).get()).data().uid;
        const ref2 = await db.collection("stores").where("owner", "==", ref1).get();
        setStoreid(ref2.docs[0].id);
      }

      db.collection('usernames').doc(username).get().then((docSnapshot) => {
        if(docSnapshot.exists){
          fetchData();
        }
        else{
          setNotFound(true);
        }
      });

      if(user){
        if(storeData && storeData.visitors.find(person=>person === user.uid) === undefined){
          db.collection('stores').doc(storeid).update({
            visitors:firebase.firestore.FieldValue.arrayUnion(user.uid)
          });
        }

        if(storeData && storeData.supporters.find(person=>person === user.uid) !== undefined){
          setSupporting(true);
        }
      }
      
    },[db,user,username,storeData,storeid])


    function supportButton(){
      if(user){
        if(storeData && storeData.supporters.find(person=>person === user.uid) === undefined){
          db.collection('stores').doc(storeid).update({
            supporters:firebase.firestore.FieldValue.arrayUnion(user.uid)
          });

          db.collection('users').doc(user.uid).update({
            supporting: firebase.firestore.FieldValue.arrayUnion(storeData.owner)
          });
          setSupporting(true);
        }
        else{
          db.collection('stores').doc(storeid).update({
            supporters:firebase.firestore.FieldValue.arrayRemove(user.uid)
          });
          db.collection('users').doc(user.uid).update({
            supporting: firebase.firestore.FieldValue.arrayRemove(storeData.owner)
          });
          setSupporting(false);
        }
      }
    }

    if(notFound){
      return(<NotFound/>);
    }
    
    if(isLoading || storeLoading){
      return(<Loading/>);
    }
    
    //owner
    if(user && storeData){
      if(user.uid === storeData.owner){
        return(
          <div>
          <div className="store-header">
          <div className="quantics">
            <img className="store-photo" src={user.photoURL} alt={"pp"}/>
            <h2>{storeData && storeData.name}</h2>
            </div>
          <div className="quantics"><button>{storeData && storeData.visitors.length} total visitors</button><button>{storeData && storeData.supporters.length} supporters</button></div>
          <h3>+{storeData&&storeData.amount_sold} sales</h3>
          <button className="edit"><FontAwesomeIcon icon={faEdit} /> Edit Store</button>
          </div>
          <div className="grid-container">
            <Link to="/newItem"><div className="grid-item1"><FontAwesomeIcon icon={faPlus} /> new</div></Link>
            {storeData && storeData.items.map(item=>{return <ItemCard key={item} itemID={item}/>}).reverse()}
          </div>
          <div>
          <SignOut></SignOut>
          </div>
        </div>
        );}}
      

      //unauthorized or not owner
      return(
          <div>
          <div className="store-header">
          <div className="quantics">
            <h2>{storeData && storeData.name}</h2>
          </div>
          <h3>+{storeData&&storeData.amount_sold} sales</h3>
          <div className="quantics"><button>{storeData && storeData.visitors.length} total visitors</button><button>{storeData && storeData.supporters.length} supporters</button></div>
          <button onClick={supportButton}>{supporting ? 'Supporting' : 'Support'}</button>
          </div>
          <div className="grid-container">
          {storeData && storeData.items.map(item=>{return<ItemCard key={item} itemID={item}/>}).reverse()}
          </div>
        </div>
      );
  }

export default Store;