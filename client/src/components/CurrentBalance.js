//updated to v9 on 12-8-2021

import React, { useEffect, useState } from 'react';
import Loading from '../components/Loading';
import "./CurrentBalance.css";

import {auth, db} from '../firebaseInitialize';
import { doc, updateDoc, getDocs, query, collection, where } from "firebase/firestore";

import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';

import { DateTime, Interval } from "luxon";

function CurrentBalance(){
    const[user, loading] = useAuthState(auth);
    let userRef = doc(db,'users',user.uid);
    const [userData, userloading] = useDocumentData(userRef);
    const[storeid, setStoreid] = useState("default");
    const[storeData, storeLoading] = useDocumentData(doc(db,'stores',storeid));

    async function updateBalance(){
      let created = userData.createdAt.toDate();
      let now = DateTime.now();
      let i = Interval.fromDateTimes(created, now);
      let score = i.length('minutes');
      score = ((score*0.01)+(Number(storeData.amount_sold))-(Number(userData.amount_bought))).toFixed(2);
      await updateDoc(userRef, {balance: Number(score)});
    }

    useEffect(() => {
      async function fetchData(){
        const ref2 = await getDocs(query(collection(db,'stores'),where("owner", "==", user.uid)));
        setStoreid(ref2.docs[0].id);
      }
      fetchData();
      let interval = setInterval(function(){
        updateBalance();
      }, 60000);
      return () => clearInterval(interval);
    },[user.uid]);

    if(loading || userloading || storeLoading){
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
      <div className="myBalance" onClick={updateBalance}>
          Your balance: {parseFloat(userData&&userData.balance).toFixed(2)}
      </div>
    )
  }

export default CurrentBalance;