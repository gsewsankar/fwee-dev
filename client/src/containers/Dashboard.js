//updated to v9 on 12-8-2021

import React,{useState,useEffect}  from 'react';
import './Dashboard.css';
import Loading from '../components/Loading';

import {auth, db} from '../firebaseInitialize';
import { doc, getDocs, query, where, updateDoc, collection,orderBy } from "firebase/firestore";

import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentData, useCollectionData } from 'react-firebase-hooks/firestore';

import { DateTime, Interval } from "luxon";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import Notification from '../components/Notification';

function Dashboard(){
    const[user, loading] = useAuthState(auth);
    let userRef = doc(db,'users',user.uid);
    const [userData, userloading] = useDocumentData(userRef);
    const[storeid, setStoreid] = useState("default");
    const[storeData, storeLoading] = useDocumentData(doc(db,'stores',storeid));
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const [notifications, notificationsLoading] = useCollectionData(query(collection(db,'users',user.uid,'notifications'),orderBy('time', 'desc')));


  //   const notificationsSample = [
  //   {
  //     type:'like',
  //     liker:"@garrick",
  //     itemID:"Hourglass",
  //     time:'12m',
  //   },
  //   {
  //     type:"buy",
  //     buyer:"@garrick",
  //     price:2.99,
  //     itemID:"Hourglass",
  //     time:"13m",
  //   },
  //   {
  //     type:"comment",
  //     commenter:"@garrick",
  //     body:"whats good in the hood",
  //     itemID:"hourglass",
  //     time:"10m",
  //   },
  //   {
  //     type:"mention",
  //     mentioner:"@garrick",
  //     body:"whats good in the hood",
  //     itemID:"hourglass",
  //     time:"10m",
  //   },
  //   {
  //     type:"dm",
  //     from:"@garrick",
  //     body:"whats good in the hood",
  //     time:"10m",
  //   },
  //   {
  //     type:"transfer",
  //     from:"@garrick",
  //     amount:0.99,
  //     time:"10m",
  //   },
  //   {
  //     type:"support",
  //     supporter:"@garrick",
  //     storeID:"qwedsf",
  //     time:"10m",
  //   },
  // ]
    
    
    
    useEffect(() => {
        async function fetchData(){
          const ref2 = await getDocs(query(collection(db,'stores'),where("owner", "==", user.uid)));
          setStoreid(ref2.docs[0].id);
        }
        fetchData();
    },[user.uid]);

    if(loading || userloading || storeLoading || notificationsLoading)
    {
      return(<Loading/>);
    }

    const calculateBalance = () => {
        let created = userData.createdAt.toDate();
        let now = DateTime.now();
        let i = Interval.fromDateTimes(created, now);
        let score = i.length('minutes');
        score = ((score*0.01)+(parseFloat(storeData.amount_sold))-(parseFloat(userData.amount_bought))).toFixed(2);
        updateDoc(userRef, {balance: parseFloat(score)});
    }

    if(user){
      return(
        <div className="dash-container">
          <h1>Dashboard</h1>
          <h3>Account Balance: {userData && userData.balance.toFixed(2)} credits <button onClick={calculateBalance}><FontAwesomeIcon icon={faSyncAlt}/></button></h3>
          <br/>
          <div>Notifications</div>
          {notifications.map(notif=>{return <Notification info={notif}/>})}
          <br/>
          {/* <div>Your Coin and Achievements</div> */}
          {/* <canvas id="bg" width='500px' height='500px'></canvas> */}
          <p>Account Established {months[userData.createdAt.toDate().getMonth()] + " " + userData.createdAt.toDate().getDate().toString() + ", " + userData.createdAt.toDate().getFullYear().toString()}</p>
          {/* <div>Central Clock</div>
          <div>Economy Size</div>   */}
        </div>
        
      )
    }
  }

export default Dashboard;