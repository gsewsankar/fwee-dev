import React from 'react';
import Loading from '../components/Loading';

import firebase from 'firebase/app';
import 'firebase/firestore';
// import 'firebase/auth';
// import 'firebase/storage';

import { useDocumentData } from 'react-firebase-hooks/firestore';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { DateTime, Interval } from "luxon";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUnlockAlt } from '@fortawesome/free-solid-svg-icons';

function BuyButton(props){

    const db = firebase.firestore();
    // const[user, authLoading] = useAuthState(firebase.auth());
    const[itemData, itemLoading] = useDocumentData(db.collection('items').doc(props.itemID));
    // const[ownerData, ownerLoading] = useDocumentData(db.collection('users').doc(itemData&&itemData.owner));

    if(itemLoading){// || ownerLoading || authLoading
        return(<Loading/>);
    }

    // if(!user){
    //     return(<button>Sign in to Buy</button>);
    // }

    // const calculateBalance = () => {
    //     let created = userData.createdAt.toDate();
    //     let now = DateTime.now();
    //     let i = Interval.fromDateTimes(created, now);
    //     let score = i.length('minutes');
    //     score = (score*0.01).toFixed(2);
    //     userRef.update({balance: score});
    // }
    
    // function transaction(){
    //     const buyer = db.collection('users').doc(user.uid);
    //     const seller = db.collection('users').doc(itemData&&itemData.owner);

    //     calculateBalance();

    //     buyer.update({balance: balance - itemData.price});
    
    // }

    return(
        <button><FontAwesomeIcon icon={faUnlockAlt}/> {itemData && itemData.price} credits </button>
    )
  }

export default BuyButton;