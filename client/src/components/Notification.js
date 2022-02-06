import React, { useEffect, useState } from 'react';
import './Notification.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart,faHeart,faHeartBroken,faStore,faStoreSlash } from '@fortawesome/free-solid-svg-icons';
import { useAuthState } from 'react-firebase-hooks/auth';
import {auth, db} from '../firebaseInitialize';
import { doc, getDoc } from "firebase/firestore";
import { useDocumentData } from 'react-firebase-hooks/firestore';

import { DateTime, Interval } from "luxon";

function Notification(props){

    const[user, loading] = useAuthState(auth);
    let notifRef = doc(db,'users',user.uid,'notifications',props.notifDocID);
    const [notifData, notifloading] = useDocumentData(notifRef);
    const [who, setWho] = useState("");
    const [itemTitle, setItemTitle] = useState("");
    const [when, setWhen] = useState("");
    const [storeName, setStoreName] = useState("");


    useEffect(()=>{
        async function fetchData(){
            if(notifData){
                let whoRef = (await getDoc(doc(db,'users',notifData.who))).data().username;
                setWho(whoRef);
            
                if(notifData.itemID){
                    let itemRef = (await getDoc(doc(db,'items',notifData.itemID))).data().title;
                    setItemTitle(itemRef);
                }

                if(notifData.storeID){
                    let storeRef = (await getDoc(doc(db,'stores',notifData.storeID))).data().name;
                    setStoreName(storeRef);
                }
                
                let whenRef = notifData&&notifData.time.toDate();
                let now = DateTime.now();
                let i = Interval.fromDateTimes(whenRef, now);
                let mins = i.length('minutes');
                let hrs = i.length('hours');
                let days = i.length('days');
                let months = i.length('months');
                let years = i.length('years');

                if(mins < 60){
                    setWhen(mins.toFixed(0).toString() + "m");
                }
                else if(hrs < 24){
                    setWhen(hrs.toFixed(0).toString() + "hrs");
                }
                else if(days < 31){
                    setWhen(days.toFixed(0).toString() + "days")
                }
                else if(months < 12){
                    setWhen(months.toFixed(0).toString() + "months ago")
                }
                else{
                    setWhen(years.toFixed(0).toString() + "years ago")
                }
            }
        }
        fetchData();
    },[notifData]);

    if(loading || notifloading){
        return(<div></div>)
    }
    
    if(notifData&&notifData.type==='buy'){
        return(
        <div className="notification-frame-green">
            <p><b>{who}</b> bought <b>{itemTitle}</b></p>
            <div className='icon-area'><FontAwesomeIcon icon={faShoppingCart}/> +{notifData&&notifData.price}</div>
            <div className='time-area'> {when} </div>
        </div>
        )
    }

    if(notifData&&notifData.type==='like'){
        return(
        <div className="notification-frame-pink">
            <p><b>{who}</b> liked <b>{itemTitle}</b></p>
            <div className='icon-area'> <FontAwesomeIcon icon={faHeart}/></div>
            <div className='time-area'> {when} </div>
        </div>
        )
    }

    if(notifData&&notifData.type==='unlike'){
        return(
        <div className="notification-frame-grey">
            <p><b>{who}</b> unliked <b>{itemTitle}</b></p>
            <div className='icon-area'> <FontAwesomeIcon icon={faHeartBroken}/></div>
            <div className='time-area'> {when} </div>
        </div>
        )
    }

    if(notifData&&notifData.type==='support'){
        return(
        <div className="notification-frame-purple">
            <p><b>{who}</b> is now supporting <b>{storeName}</b></p>
            <div className='icon-area'> <FontAwesomeIcon icon={faStore}/></div>
            <div className='time-area'> {when} </div>
        </div>
        )
    }

    if(notifData&&notifData.type==='unsupport'){
        return(
        <div className="notification-frame-grey">
            <p><b>{who}</b> stopped supporting <b>{storeName}</b></p>
            <div className='icon-area'> <FontAwesomeIcon icon={faStoreSlash}/></div>
            <div className='time-area'> {when} </div>
        </div>
        )
    }

    return(<div className='notification-frame-grey'></div>)
  }

export default Notification;