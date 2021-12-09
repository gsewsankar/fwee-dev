//updated to v9 on 12-8-2021

import React from 'react';
import Loading from '../../components/Loading';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import {db} from '../../firebaseInitialize.js';
import {doc} from 'firebase/firestore';

function VideoCard(props){
    const[itemData, itemLoading] = useDocumentData(doc(db,'items',props.itemID));
    if(itemLoading){
        return(<Loading/>);
    }
    return(
        <video src={itemData&&itemData.location} width="300px" height="auto" controls></video>
    )
  }

export default VideoCard;