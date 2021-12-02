//UPDATED to v9 on 12-2-2021

import React from 'react';
import {auth, db} from '../firebaseInitialize';
import { collection, doc, getDoc, setDoc, addDoc } from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';

function SignIn(){

    const signInWithGoogle = () => {
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider).then(cred => {
         getDoc(doc(db,'users',cred.user.uid))
        .then((docSnapshot) => {
          if(!docSnapshot.exists){
             setDoc(doc(db,'users',cred.user.uid),{
              uid:cred.user.uid,
              displayName: cred.user.displayName,
              photoURL:cred.user.photoURL,
              balance:0,
              amount_bought:0,
              username: "@" + cred.user.uid,
              createdAt: db.FieldValue.serverTimestamp(),
              purchases:[],
              supporting:[]
            });

            addDoc(collection(db,"stores"),{
              name: cred.user.displayName +"'s Store",
              owner: cred.user.uid,
              items: [],
              visitors: [],
              amount_sold:0,
              supporters: [],
            });

            setDoc(doc(db,"usernames",'@' + cred.user.uid), {uid:cred.user.uid});
          }
        })
      });
    }
  
    return(
      <button onClick={signInWithGoogle}> <FontAwesomeIcon icon={faSignInAlt}/> Sign In with Google</button>
    )
}

export default SignIn;