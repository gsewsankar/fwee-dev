//updated to v9 on 12-8-2021

import React,{useState,useEffect,useRef} from 'react';
import Loading from '../components/Loading';
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

    const sellerRef = itemData && doc(db,'users',itemData.owner);
    const[storeid, setStoreid] = useState("default");
    const[sellerData] = useDocumentData(sellerRef);

    const storeRef = doc(db,'stores',storeid);
    const[storeData, storeLoading] = useDocumentData(storeRef);
    const isMounted = useRef(true);

    useEffect(() => {
       
        return () => { isMounted.current = false}

    },[]);
    useEffect(() => {
        async function fetchData(){
          const ref1 = await getDoc(itemRef);
          const ref2 = await getDocs(query(collection(db,'stores'),where("owner", "==", ref1.data().owner)));
          if(isMounted.current)
            setStoreid(ref2.docs[0].id);
        }
        fetchData();

    },[itemRef]);

    if(itemLoading || buyerLoading || authLoading || storeLoading){
        return(<Loading/>);
    }

    /*const getBalance = (username)=>{
        const user = accounts.find(account => account.username == username);
        return user.balance;
    }*/

    async function calculateBalance(){
        let created = buyerData.createdAt.toDate();
        let now = DateTime.now();
        let i = Interval.fromDateTimes(created, now);
        let score = i.length('minutes');
        score = ((score*0.01)+(parseFloat(storeData.amount_sold))-(parseFloat(buyerData.amount_bought))).toFixed(2);
        await updateDoc(buyerRef,{balance: score});
    }

    async function transaction(){
        await calculateBalance();
        // TODO: add check for current user?
        if(buyerData.balance > itemData.price){
            await updateDoc(buyerRef,{
                balance: parseFloat(buyerData.balance)-parseFloat(itemData.price),
                amount_bought: increment(parseFloat(itemData.price)),
                purchases: arrayUnion(itemData.id),
            });

            await updateDoc(sellerRef,{
                balance: increment(parseFloat(itemData.price))
            });

            await updateDoc(storeRef,{
                amount_sold: increment(parseFloat(itemData.price))
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
                amount: parseFloat(itemData.price),
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
        <button className="buy" onClick={(e) => {e.preventDefault(); transaction(); sendMessage()}}><FontAwesomeIcon icon={faUnlockAlt}/> {itemData && itemData.price} credits </button>
    )
  }

export default BuyButton;