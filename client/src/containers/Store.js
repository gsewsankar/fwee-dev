import React, { useEffect, useState } from 'react';
import './Store.css';
import SignOut from '../components/SignOut';
import Loading from '../components/Loading';
import ItemCard from '../components/ItemCard';

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

// import {
//   useQuery,
//   gql
// } from "@apollo/client";

function Store(){

    const db = firebase.firestore();
    const { username } = useParams();    

    const[user, isLoading] = useAuthState(firebase.auth());
    const [storeid, setStoreid] = useState("default");
    const [storeData, storeLoading] = useDocumentData(db.collection('stores').doc(storeid));

    useEffect(() => {
      async function fetchData(){
      const ref1 = (await db.collection("usernames").doc(username).get()).data().uid;
      const ref2 = await db.collection("stores").where("owner", "==", ref1).get();
      setStoreid(ref2.docs[0].id);
      }
      user && fetchData();
    },[db,user,username])

    if(isLoading || storeLoading){
      return(<Loading/>);
    }
    
    //owner
    if(user && storeData){
      if(user.uid === storeData.owner){
        return(
          <div>
          <div>
          <button className="edit"><FontAwesomeIcon icon={faEdit} /> Edit Store</button>
          <h2>{storeData && storeData.name}</h2>
          <p>2 total visitors</p>
          <p>0 supporters</p>
          </div>
          <div className="grid-container">
            <Link to="/newItem"><div className="grid-item1"><FontAwesomeIcon icon={faPlus} /> new</div></Link>
            {storeData && storeData.items.map(item=>{return <ItemCard itemID={item}/>}).reverse()}
          </div>
          <div>
          <SignOut></SignOut>
          </div>
        </div>
        );}}
      

      //unauthorized or not owner
      return(
        <div>
          <div>
          <h2>{storeData && storeData.name}</h2>
          <button>Support</button>
          <p>2 total visitors</p>
          <p>0 supporters</p>
          </div>
          <div className="grid-container">
          {storeData && storeData.items.map(item=>{return<ItemCard itemID={item}/>}).reverse()}
          </div>
        </div>
      );
  }

export default Store;