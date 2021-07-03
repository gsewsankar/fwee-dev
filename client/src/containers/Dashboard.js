import React,{useState,useEffect}  from 'react';
import './Dashboard.css';
import Loading from '../components/Loading';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';

import { DateTime, Interval } from "luxon";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';

function Dashboard(){

    const[user, loading] = useAuthState(firebase.auth());
    const db = firebase.firestore();
    let userRef = db.collection('users').doc(user.uid);
    const [userData, userloading] = useDocumentData(userRef);
    const[storeid, setStoreid] = useState("default");
    const[storeData, storeLoading] = useDocumentData(db.collection('stores').doc(storeid));

    useEffect(() => {
        async function fetchData(){
          const ref2 = await db.collection("stores").where("owner", "==", user.uid).get();
          setStoreid(ref2.docs[0].id);
        }
        fetchData();
    },[db, user.uid]);

    if(loading || userloading || storeLoading)
    {
      return(<Loading/>);
    }

    const calculateBalance = () => {
        let created = userData.createdAt.toDate();
        let now = DateTime.now();
        let i = Interval.fromDateTimes(created, now);
        let score = i.length('minutes');
        score = ((score*0.01)+(parseFloat(storeData.amount_sold))-(parseFloat(userData.amount_bought))).toFixed(2);
        userRef.update({balance: parseFloat(score)});
    }

    if(user){
      return(
        <div className="dash-container">
          <h1>Dashboard</h1>
          <h3>Account Balance: {userData && userData.balance} credits <button onClick={calculateBalance}><FontAwesomeIcon icon={faSyncAlt}/></button></h3>
          <div>Your Coin</div>
          <canvas id="bg" width='500px' height='500px'></canvas>
          <p>Established {userData && userData.createdAt.toDate().toString()}</p>
          <div>Central Clock</div>
          <div>Economy Size</div>  
          <br/>
          <div>Notifications</div>
        </div>
        
      )
    }
  }

export default Dashboard;