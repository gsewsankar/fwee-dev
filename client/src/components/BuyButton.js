import React,{useState,useEffect} from 'react';
import Loading from '../components/Loading';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { DateTime, Interval } from "luxon";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUnlockAlt } from '@fortawesome/free-solid-svg-icons';

function BuyButton(props){

    const db = firebase.firestore();
    const[user, authLoading] = useAuthState(firebase.auth());
    const[itemData, itemLoading] = useDocumentData(db.collection('items').doc(props.itemID));
    const itemRef = db.collection('items').doc(props.itemID);
    const[buyerData,buyerLoading] = useDocumentData(db.collection('users').doc(user && user.uid));
    const buyerRef = db.collection('users').doc(user && user.uid);
    const sellerRef = db.collection('users').doc(itemData&&itemData.owner);
    const[storeid, setStoreid] = useState("default");
    const[storeData, storeLoading] = useDocumentData(db.collection('stores').doc(storeid));
    const storeRef = db.collection('stores').doc(storeid);

    useEffect(() => {
        async function fetchData(){
          const ref1 = await db.collection("items").doc(props.itemID).get();
          const ref2 = await db.collection("stores").where("owner", "==", ref1.data().owner).get();
          setStoreid(ref2.docs[0].id);
        }
        fetchData();
    },[db, props.itemID]);

    if(itemLoading || buyerLoading || authLoading || storeLoading){
        return(<Loading/>);
    }

    const calculateBalance = () => {
        let created = buyerData.createdAt.toDate();
        let now = DateTime.now();
        let i = Interval.fromDateTimes(created, now);
        let score = i.length('minutes');
        score = ((score*0.01)+(parseFloat(storeData.amount_sold))-(parseFloat(buyerData.amount_bought))).toFixed(2);
        buyerRef.update({balance: score});
    }
    
    function transaction(){
        calculateBalance();
        if(buyerData.balance > itemData.price){
            buyerRef.update({
                balance: parseFloat(buyerData.balance)-parseFloat(itemData.price),
                amount_bought: firebase.firestore.FieldValue.increment(parseFloat(itemData.price)),
                purchases: firebase.firestore.FieldValue.arrayUnion(itemData.id),
            });

            sellerRef.update({
                balance: firebase.firestore.FieldValue.increment(parseFloat(itemData.price))
            });

            storeRef.update({
                amount_sold: firebase.firestore.FieldValue.increment(parseFloat(itemData.price))
            })

            itemRef.update({
                buyers: firebase.firestore.FieldValue.arrayUnion(user.uid)
            })
        }
        else{
            alert("not enough credits in your account");
        }
    }

    return(
        <button onClick={transaction}><FontAwesomeIcon icon={faUnlockAlt}/> {itemData && itemData.price} credits </button>
    )
  }

export default BuyButton;