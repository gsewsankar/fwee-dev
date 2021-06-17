import React from 'react';
import './SignIn.css';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';

//use luxon

function SignIn(){

    const auth = firebase.auth();
    const db = firebase.firestore();

    const signInWithGoogle = () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider).then(cred => {

        const usersRef = db.collection('users').doc(cred.user.uid);

        usersRef.get().then((docSnapshot) => {
          if(!docSnapshot.exists){
            db.collection('users').doc(cred.user.uid).set({
              uid:cred.user.uid,
              displayName: cred.user.displayName,
              photoURL:cred.user.photoURL,
              balance:0,
              amount_bought:0,
              username: "@" + cred.user.uid,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            });

            db.collection('stores').add({
              name: cred.user.displayName +"'s Store",
              owner: cred.user.uid,
              items: [],
              visitors: [],
              amount_sold:0,
              supporters: [],
            });

            db.collection('usernames').doc('@' + cred.user.uid).set({uid:cred.user.uid});
          }
        })
      });
    }
  
    return(
      <button onClick={signInWithGoogle}> <FontAwesomeIcon icon={faSignInAlt}/> Sign In with Google</button>
    )
}

export default SignIn;