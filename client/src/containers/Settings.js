import React, { useState } from 'react';
import SignOut from '../components/SignOut';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

function Settings(){

    const[available,setAvailable]=useState(false);
    const[user,loading]=useAuthState(firebase.auth());
    const db = firebase.firestore();

    const checkUsername = (e) => {

        
    }

    if(loading){
        return(<div>Loading...</div>);
    }

    return(
      <div>
          <h1>Settings</h1>
          <input placeholder={"@"} onChange={checkUsername}></input> <button>update username</button>

         <div><SignOut/></div> 
      </div>
    )
  }

export default Settings;