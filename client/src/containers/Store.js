import React from 'react';
import './Store.css';
import Loading from '../components/Loading';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

import SignOut from '../components/SignOut';
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
    //const bucket = firebase.storage();

    const { storeid } = useParams();

    const[user, isLoading] = useAuthState(firebase.auth());
    const [userData, dataLoading] = useDocumentData(db.collection('users').doc(storeid));
    //const[URL, setURL] = useState("");

    //bucket.ref(user.uid+"/3.png").getDownloadURL().then(url=>setURL(url));

    if(dataLoading || isLoading){
      return(<Loading/>);
    }
    
    //owner
    if(user){
      if(user.uid === userData.uid){
        return(
          <div>
          <div>
          <button className="edit"><FontAwesomeIcon icon={faEdit} /> Edit Store</button>
            {userData && <h2>{userData.displayName + "'s Store"}</h2>}
          
          <p>2 total visitors</p>
          <p>0 supporters</p>
          </div>
          <div className="grid-container">
            <Link to="/newItem"><div className="grid-item1"><FontAwesomeIcon icon={faPlus} /> new</div></Link>
            <div className="grid-item">milk</div>
            <div className="grid-item">bread</div>
            <div className="grid-item">tea</div>
            <div className="grid-item">juice</div>
            <div className="grid-item">butter</div>
            <div className="grid-item">cheese</div>
            <div className="grid-item">lettuce</div>
            <div className="grid-item">carrots</div>
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
          {userData && <p>{userData.displayName + "'s Store"}</p>}
          <button>Support</button>
          <p>2 total visitors</p>
          <p>0 supporters</p>
          </div>
          <div className="grid-container">
            <div className="grid-item">eggs</div>
            <div className="grid-item">milk</div>
            <div className="grid-item">bread</div>
            <div className="grid-item">tea</div>
            <div className="grid-item">juice</div>
            <div className="grid-item">butter</div>
            <div className="grid-item">cheese</div>
            <div className="grid-item">lettuce</div>
            <div className="grid-item">carrots</div>
          </div>
        </div>
      );
  }

export default Store;