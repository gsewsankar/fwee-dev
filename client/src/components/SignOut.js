import React from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


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