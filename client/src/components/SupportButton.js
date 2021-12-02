import React,{useState,useEffect} from 'react';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import { useParams } from 'react-router-dom';

import { useAuthState } from 'react-firebase-hooks/auth';

function SupportButton(){
    const { username } = useParams();
    const [storeid, setStoreid] = useState("default");
    const[user] = useAuthState(firebase.auth());
    const db = firebase.firestore();
    const[supporting, setSupporting] = useState(false);

    useEffect(()=>{
        async function fetchData(){
            const ref1 = (await db.collection("usernames").doc(username).get()).data().uid;
            const ref2 = await db.collection("stores").where("owner", "==", ref1).get();
            setStoreid(ref2.docs[0].id);
            if(user && storeid!=="default"){
                if((await db.collection("stores").doc(storeid).get()).data().supporters.find(person=>person === user.uid) !== undefined){
                  setSupporting(true);
                }
            }
        }
        user && fetchData();
    },[db,storeid,user,username]);

    async function supportButton(){
        if(user){
          if((await db.collection("stores").doc(storeid).get()).data().supporters.find(person=>person === user.uid) === undefined){
            db.collection('stores').doc(storeid).update({
              supporters:firebase.firestore.FieldValue.arrayUnion(user.uid)
            });
  
            db.collection('users').doc(user.uid).update({
              supporting: firebase.firestore.FieldValue.arrayUnion((await db.collection("stores").doc(storeid).get()).data().owner)
            });
            setSupporting(true);
          }
          else{
            db.collection('stores').doc(storeid).update({
              supporters:firebase.firestore.FieldValue.arrayRemove(user.uid)
            });
            db.collection('users').doc(user.uid).update({
              supporting: firebase.firestore.FieldValue.arrayRemove((await db.collection("stores").doc(storeid).get()).data().owner)
            });
            setSupporting(false);
          }
        }
      }


    return(
        <button onClick={supportButton}>{supporting ? 'Supporting' : 'Support'}</button>
    )
  }

export default SupportButton;