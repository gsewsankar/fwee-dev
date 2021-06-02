import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';


function SignOut(){
    const auth = firebase.auth();
    
    return auth.currentUser && (
      <button style={{color:"red"}} onClick={()=>
        {
          auth.signOut();
        }
      }>Sign Out</button>
    )
  }

export default SignOut