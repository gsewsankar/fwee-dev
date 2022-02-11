//UPDATED to v9 on 12-2-2021

import React from 'react';
import './SignIn.css';
import {auth, db} from '../firebaseInitialize';
import { collection, doc, getDoc, setDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import G from '../assets/G.svg';

function SignIn(){
    async function signInWithGoogle () {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      const docRef = doc(db,'users',cred.user.uid);
      const docSnap = await getDoc(docRef);

      if(!docSnap.exists()){
        await setDoc(doc(db,'users',cred.user.uid),{
          uid:cred.user.uid,
          displayName: cred.user.displayName,
          photoURL:cred.user.photoURL,
          balance:0,
          amount_bought:0,
          username: "@" + cred.user.uid,
          createdAt: serverTimestamp(),
          purchases:[],
          supporting:[]
        });

        await addDoc(collection(db,"stores"),{
          name: cred.user.displayName +"'s Store",
          owner: cred.user.uid,
          items: [],
          visitors: [],
          amount_sold:0,
          supporters: [],
        });

        await setDoc(doc(db,"usernames",'@' + cred.user.uid), {uid:cred.user.uid});
      }
    }
  
    return(
      <button className='sign-in-btn' onClick={signInWithGoogle}> <img src={G} alt='G'></img> Sign in with Google</button>
    )
}

export default SignIn;