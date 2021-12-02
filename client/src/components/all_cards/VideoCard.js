import React from 'react';
import Loading from '../../components/Loading';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';

function DirectMessages(props){
    const db = firebase.firestore();
    const[itemData, itemLoading] = useDocumentData(db.collection('items').doc(props.itemID));
    if(itemLoading){
        return(<Loading/>);
    }
    return(
        <video src={itemData&&itemData.location} width="300px" height="auto" controls></video>
    )
  }

export default DirectMessages;