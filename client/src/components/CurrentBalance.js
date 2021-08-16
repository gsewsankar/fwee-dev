import React from 'react';
import Loading from '../components/Loading';
import "./CurrentBalance.css";

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';

function CurrentBalance(){
    const[user, loading] = useAuthState(firebase.auth());
    const db = firebase.firestore();
    let userRef = db.collection('users').doc(user.uid);
    const [userData, userloading] = useDocumentData(userRef);

    if(loading || userloading){
        return(<Loading/>);
    }

    return(
      <div className="myBalance">
          Your balance: {userData.balance}
      </div>
    )
  }

export default CurrentBalance;