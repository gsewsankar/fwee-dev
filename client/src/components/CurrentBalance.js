//updated to v9 on 12-8-2021

import React from 'react';
import Loading from '../components/Loading';
import "./CurrentBalance.css";

import {auth, db} from '../firebaseInitialize';
import { doc } from "firebase/firestore";

import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';

function CurrentBalance(){
    const[user, loading] = useAuthState(auth);
    let userRef = doc(db,'users',user.uid);
    const [userData, userloading] = useDocumentData(userRef);

    if(loading || userloading){
        return(<Loading/>);
    }

    if(!user){
      return(
        <div className="myBalance">
          Your balance: 0.00
        </div>
      )
    }

    return(
      <div className="myBalance">
          Your balance: {parseFloat(userData.balance).toFixed(2)}
      </div>
    )
  }

export default CurrentBalance;