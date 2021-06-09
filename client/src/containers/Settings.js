import React from 'react';
import './Settings.css';
import SignOut from '../components/SignOut';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';

function Settings(){

    let available = false;
    const[user,loading]=useAuthState(firebase.auth());
    const db = firebase.firestore();
    const userDocRef = db.collection('users').doc(user.uid);
    const[userData, dataloading] = useDocumentData(userDocRef); 

    if(loading || dataloading){
        return(<div>Loading...</div>);
    }

    let input;
    
    //FIXME
    const checkUsername = (e) => {
      input = e.target.value;
      if(input){
        db.collection('users').doc(input).get().then(doc=>{
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
        userDocRef.update({username: "@"+input});
        console.log("username updated");
      }
    }

    return(
      <div>
          <h1>Settings</h1>
          <input className="setting" placeholder={userData.username} onChange={checkUsername}></input> 
          <button onClick={updateUsername}>update username</button>

         <div>
           <SignOut/>
         </div> 
      </div>
    )
  }

export default Settings;