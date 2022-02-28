//updated to v9 on 12-8-2021

import React,{useState,useEffect,useRef} from 'react';
import './BuyButton.css';

import {db,auth} from '../firebaseInitialize';
import { doc, getDoc, getDocs, collection, where, query, updateDoc, increment, arrayUnion, addDoc, serverTimestamp } from "firebase/firestore";

import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { DateTime, Interval } from "luxon";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUnlockAlt } from '@fortawesome/free-solid-svg-icons';

import {MessageSender} from './MessageSender'

function BuyButton(props){

    const[user, authLoading] = useAuthState(auth);
    
    const itemRef = doc(db,'items',props.itemID);
    const[itemData, itemLoading] = useDocumentData(itemRef);
    
    const buyerRef = user && doc(db,'users', user.uid);
    const[buyerData,buyerLoading] = useDocumentData(buyerRef);
    
    const[buyerstoreid, setBuyerStoreid] = useState("default");
    const buyerStoreRef = doc(db,'stores',buyerstoreid);
    const[buyerStoreData, storeLoading] = useDocumentData(buyerStoreRef);

    const sellerRef = itemData && doc(db,'users',itemData.owner);
    
    const[sellerstoreid, setSellerStoreid] = useState("default");
    const[sellerData] = useDocumentData(sellerRef);
    const sellerStoreRef = doc(db,'stores',sellerstoreid);
    
    const isMounted = useRef(true);

    useEffect(() => {
       
        return () => { isMounted.current = false}

    },[]);

    useEffect(() => {
        async function fetchData(){
          const ref1 = await getDoc(itemRef);
          const ref2 = await getDocs(query(collection(db,'stores'),where("owner", "==", ref1.data().owner)));
          if(isMounted.current){
            setSellerStoreid(ref2.docs[0].id);
          }
          const ref3 = await getDocs(query(collection(db,'stores'),where("owner", "==", user.uid)));
          setBuyerStoreid(ref3.docs[0].id);
        }
        fetchData();

    },[itemRef, user.uid]);

    if(itemLoading || buyerLoading || authLoading || storeLoading){
        return(<button/>);
    }

    async function calculateBalance(){
        let created = buyerData.createdAt.toDate();
        let now = DateTime.now();
        let i = Interval.fromDateTimes(created, now);
        let score = i.length('minutes');
        score = ((score*0.01)+(Number(buyerStoreData.amount_sold))-(Number(buyerData.amount_bought))).toFixed(2);
        await updateDoc(buyerRef,{balance: Number(score)});
    }

    async function transaction(){
        await calculateBalance();
        // TODO: add check for current user?
        if(buyerData.balance >= itemData.price){
            await updateDoc(buyerRef,{
                balance: Number(buyerData.balance)-Number(itemData.price),
                amount_bought: increment(Number(itemData.price)),
                purchases: arrayUnion(itemData.id),
            });

            await updateDoc(sellerRef,{
                balance: increment(Number(itemData.price))
            });

            await updateDoc(sellerStoreRef,{
                amount_sold: increment(Number(itemData.price))
            })

            await updateDoc(itemRef,{
                buyers: arrayUnion(user.uid)
            })
        }
        else{
            alert("not enough credits in your account");
        }
    }
    
    async function sendMessage()
    {
        if(buyerData.balance > itemData.price){
            const messageToSend = {
                from: buyerData.username,
                to: sellerData.username,
                amount: Number(itemData.price),
                time:Date.now()
            }
            MessageSender(messageToSend);
            await addDoc(collection(db,'users',itemData.owner,'notifications'),{
                type:"buy",
                who:user.uid,
                price:itemData.price,
                itemID:props.itemID,
                time:serverTimestamp(),
            });
        }
    }

    return(
        <button className="buy" onClick={() => {transaction(); sendMessage();}}><FontAwesomeIcon icon={faUnlockAlt}/> {itemData && itemData.price} credits </button>
    )
  }

export default BuyButton;