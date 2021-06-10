import React from 'react';
import Loading from '../components/Loading';
import SignOut from '../components/SignOut';
import './Settings.css';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';

function Settings(){

    const[user,loading] = useAuthState(firebase.auth());
    const db = firebase.firestore();
    const userRef = db.collection('users').doc(user.uid);
    const[userData, dataloading] = useDocumentData(userRef); 

    if(loading || dataloading){
        return(<Loading/>);
    }

    let input;
    let available = false;
    
    const checkUsername = (e) => {
      input = e.target.value;
      if(input){
        db.collection('usernames').doc(input).get().then(doc=>{
          if(!doc.exists){
            available = true;
          }
          else{
            available = false;
          }
        });
      }
    }

    const updateUsername = () => {
      if(available){
        db.collection('usernames').doc(input).set({uid:user.uid});
        userRef.update({username: "@"+input});
        console.log("username updated");
      }
    }

    return(
      <div>
          <h1>Settings</h1>
          <input className="setting" placeholder={userData.username} onChange={checkUsername}></input> 
          <button onClick={updateUsername}>Update Username</button>

         <div>
           <SignOut/>
         </div> 
      </div>
    )
  }

export default Settings;