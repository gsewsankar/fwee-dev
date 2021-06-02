import React from 'react';
import './Dashboard.css';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';

//import {Canvas} from 'react-three-fiber';
import { DateTime, Interval } from "luxon";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';

function Dashboard(){

    const[user, loading] = useAuthState(firebase.auth());
    const db = firebase.firestore();
    let docRef = db.collection('users').doc(user.uid);
    const [docData, docloading] = useDocumentData(docRef); 

    if(loading)
    {
      return(<div>Loading user data...</div>);
    }

    if(docloading)
    {
      return(<div>Loading user data...</div>);
    }

    function calculateBalance(){
        let created = docData.createdAt.toDate();
        let now = DateTime.now();
        let i = Interval.fromDateTimes(created, now);
        let score = i.length('minutes');
        score = (score*0.01).toFixed(2);
        docRef.update({balance: score});
        console.log("doc updated");
    }

    if(user){
      return(
        <div className="dash-container">
          <h1>Dashboard</h1>
          
          <h3>Account Balance: {docData && docData.balance} credits <button onClick={calculateBalance}><FontAwesomeIcon icon={faSyncAlt}/></button></h3>
          <div>Your Coin</div>
          <p>Established {docData && docData.createdAt.toDate().toString()} </p>
          <div>Central Clock</div>
          <div>Economy Size</div>  
          
          <div>Notifications</div>
          
        </div>
      )
    }
  }

export default Dashboard;