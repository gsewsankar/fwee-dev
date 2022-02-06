//updated to v9 12-8-2021

import React,{useState,useEffect} from 'react';

import {auth, db} from '../firebaseInitialize';
import { addDoc, doc, collection, getDocs, getDoc, query, updateDoc, arrayUnion, arrayRemove, where, serverTimestamp } from "firebase/firestore";

import { useParams } from 'react-router-dom';

import { useAuthState } from 'react-firebase-hooks/auth';

function SupportButton(){
    const { username } = useParams();
    const[storeid, setStoreid] = useState("default");
    const[user] = useAuthState(auth);
    const[supporting, setSupporting] = useState(false);

    useEffect(()=>{
        async function fetchData(){
            const ref1 = (await getDoc(doc(db,'usernames',username))).data().uid;
            const ref2 = await getDocs(query(collection(db,'stores'),where("owner", "==", ref1)));
            setStoreid(ref2.docs[0].id);
            if(user && storeid!=="default"){
                if((await getDoc(doc(db,'stores',storeid))).data().supporters.find(person=>person === user.uid) !== undefined){
                  setSupporting(true);
                }
            }
        }
        user && fetchData();
    },[storeid,user,username]);

    async function supportButton(){
        if(user){
          if((await getDoc(doc(db,'stores',storeid))).data().supporters.find(person=>person === user.uid) === undefined){
            await updateDoc(doc(db,'stores',storeid),{
              supporters:arrayUnion(user.uid)
            });
            await updateDoc(doc(db,'users',user.uid),{
              supporting:arrayUnion((await getDoc(doc(db,'stores',storeid))).data().owner)
            });
            setSupporting(true);
            
            //send support notification
            await addDoc(collection(db,'users',(await getDoc(doc(db,'stores',storeid))).data().owner,'notifications'), {
              type:"support",
              who:user.uid,
              storeID:storeid,
              time:serverTimestamp(),
            });
          }
          else{
            await updateDoc(doc(db,'stores',storeid),{
              supporters:arrayRemove(user.uid)
            });
            await updateDoc(doc(db,'users',user.uid),{
              supporting:arrayRemove((await getDoc(doc(db,'stores',storeid))).data().owner)
            });
            setSupporting(false);

            //send unsupport notification
            await addDoc(collection(db,'users',(await getDoc(doc(db,'stores',storeid))).data().owner,'notifications'), {
              type:"unsupport",
              who:user.uid,
              storeID:storeid,
              time:serverTimestamp(),
            });
          }
        }
      }


    return(
        <button onClick={supportButton}>{supporting ? 'Supporting' : 'Support'}</button>
    )
  }

export default SupportButton;