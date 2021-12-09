//Updated to v9 12-2-2021

import React from 'react';
import {auth} from '../firebaseInitialize';

function SignOut(){
    return auth.currentUser && (
      <button style={{color:"red"}} onClick={()=>
        {
          auth.signOut();
        }
      }>Sign Out</button>
    )
  }

export default SignOut