import React, { useState } from 'react';
import Loading from '../components/Loading';
import SignOut from '../components/SignOut';
import './Settings.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';

function Settings(){

    const[user,loading] = useAuthState(firebase.auth());
    const db = firebase.firestore();
    const userRef = db.collection('users').doc(user.uid);
    const[userData, dataloading] = useDocumentData(userRef); 
    const[valid, setValid] = useState("Update Username");

    if(loading || dataloading){
        return(<Loading/>);
    }

    let input;
    let available;
    
    const checkUsername = (e) => {
      input = e.target.value;

      if(input[0] !== '@'){
        alert("Username must start with @");
      }

      if(input){
        db.collection('usernames').doc(input).get().then(doc=>{
          if(!doc.exists){
            available = true;
            setValid("Update Username");
          }
          else{
            available = false;
            setValid("Name Taken");
          }
        });
      }
    }

    const updateUsername = () => {
        if(input){
        if(available){
          db.collection('usernames').doc(input).set({uid:user.uid});
          db.collection('usernames').doc(userData.username).delete();
          userRef.update({username: input});
          setValid("Name Updated!");
        }
        else{alert("Username taken")}
      }
    }

    return(
      <div>
          <h1>Settings</h1>
          <div>
          <input className="setting" placeholder={userData.username} onChange={checkUsername}></input> 
          <button onClick={updateUsername}>{valid}</button>
          </div>
          <div><br/><SignOut/></div>
         
      </div>
    )
  }

export default Settings;