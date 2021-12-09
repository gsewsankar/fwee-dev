//updated to v9 on 12-8-21

import React, { useEffect, useState } from 'react';
import './Store.css';
import SignOut from '../components/SignOut';
import Loading from '../components/Loading';
import SupportButton from '../components/SupportButton';
import NotFound from '../containers/NotFound';
import LockedItem from '../components/LockedItem';

import {db, auth} from '../firebaseInitialize';
import { doc, getDoc, getDocs, arrayUnion, updateDoc, query, collection, where } from 'firebase/firestore';

import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

import { useParams } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit } from '@fortawesome/free-solid-svg-icons';

import {Link} from 'react-router-dom';


function Store(){

    const { username } = useParams();    

    const[user, isLoading] = useAuthState(auth);
    const [storeid, setStoreid] = useState("default");
    const [storeData, storeLoading] = useDocumentData(doc(db,'stores',storeid));
    const[notFound, setNotFound] = useState(false);
    

    useEffect(() => {
      async function fetchData(){
        const ref1 = (await getDoc(doc(db,'usernames',username))).data().uid;
        const ref2 = await getDocs(query(collection(db,'stores'),where("owner", "==", ref1)));
        setStoreid(ref2.docs[0].id);
      }

      getDoc(doc(db,'usernames',username)).then((docSnapshot) => {
        if(docSnapshot.exists()){
          fetchData();
        }
        else{
          setNotFound(true);
        }
      });

      if(user){
        if(storeData && storeData.visitors.find(person=>person === user.uid) === undefined){
          updateDoc(doc(db,'stores',storeid), {
            visitors:arrayUnion(user.uid)
          });
        }
      }
      
    },[user,username,storeData,storeid]);

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
          <div className="store-container">
          <div className="store-header">
          <div className="quantics">
            <img className="store-photo" src={user.photoURL} alt={"pp"}/>
            <h2>{storeData && storeData.name}</h2>
            </div>
          <div className="quantics"><button>{storeData && storeData.visitors.length} total visitors</button><button>{storeData && storeData.supporters.length} supporters</button></div>
          <h3>+{storeData&&parseFloat(storeData.amount_sold).toFixed(2)} sales</h3>
          <button className="edit"><FontAwesomeIcon icon={faEdit} /> Edit Store</button>
          </div>
          <div className="grid-container">
            <Link to="/newItem"><div className="grid-item1"><FontAwesomeIcon icon={faPlus} /> new</div></Link>
            {storeData && storeData.items.map(item=>{return(<LockedItem key={item} itemID={item}/>)}).reverse()}
          </div>
          <div>
          <SignOut></SignOut>
          </div>
        </div>
        );
      }
    }
      
    //not store owner
    return(
        <div className="store-container">
        <div className="store-header">
        <div className="quantics">
          <h2>{storeData && storeData.name}</h2>
        </div>
        <h3>+{storeData&&parseFloat(storeData.amount_sold).toFixed(2)} sales</h3>
        <div className="quantics"><button>{storeData && storeData.visitors.length} total visitors</button><button>{storeData && storeData.supporters.length} supporters</button></div>
        {user&&<SupportButton storeid={storeid}/>}
        </div>
        <div className="grid-container">
        {storeData && storeData.items.map(item=>{return<LockedItem key={item} itemID={item}/>}).reverse()}
        </div>
      </div>
    );
  }

export default Store;