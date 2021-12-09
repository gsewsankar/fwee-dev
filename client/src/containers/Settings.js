//UPDATED to v9 on 12-8-21

import React, { useState } from 'react';
import Loading from '../components/Loading';
import SignOut from '../components/SignOut';
import './Settings.css';

import {db, auth} from '../firebaseInitialize';
import { doc, getDoc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';

function Settings(){

    const[user,loading] = useAuthState(auth);
    const userRef = doc(db,'users',user.uid);
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
        getDoc(doc(db,'usernames',input)).then(doc=>{
          if(!doc.exists()){
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
          setDoc(doc(db,'usernames',input), {uid:user.uid});
          deleteDoc(doc(db,'usernames',userData.username));
          updateDoc(userRef,{username: input});
          setValid("Name Updated!");
        }
        else{
          alert("Username taken")
        }
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