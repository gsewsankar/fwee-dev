import React,{ useEffect, useState } from 'react';
import Loading from '../../components/Loading';
import LikeButton from '../LikeButton';
import CommentsCard from '../CommentsCard';

import {db} from '../../firebaseInitialize';
import { doc, getDocs, query, collection } from "firebase/firestore";

import { Link } from "react-router-dom";
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faEye, faCamera } from '@fortawesome/free-solid-svg-icons';
import ShareButton from '../ShareButton';

function ImageCard(props){
    const[itemData, itemLoading] = useDocumentData(doc(db,'items',props.itemID));
    const[ownerData, ownerLoading] = useDocumentData(itemData && doc(db,'users',itemData.owner));
    const[showComments, setShowComments]= useState(false);
    const[commentNum, setCommentNum] = useState(0);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    useEffect(()=>{
        async function fetchData(){
            let colSnap = (await getDocs(query(collection(db,'items',props.itemID,'comments')))).size;
            setCommentNum(colSnap); 
        }
        fetchData();
      },[props.itemID]);
    
    if(ownerLoading || itemLoading){
      return(<div className='card'><Loading/></div>);
    }

    if(showComments){
        return(<CommentsCard itemID={props.itemID}/>);
    }

    return((ownerData&&itemData)?
    <div className="card">
       <FontAwesomeIcon className="image" icon={faCamera}/>
       <Link to={'/'+ ownerData.username}>
       <div className="top-row">
         <img className="pp" src={ownerData.photoURL} alt="broken"/>
         <p>{ownerData.username}</p>
       </div>
       </Link>
       <Link to={'/item/'+itemData.id}>
        <h3>{itemData.title}</h3>
        <img width="300px" height="auto" src={itemData.location} alt={"broken"}></img>
       </Link>
         <p><FontAwesomeIcon icon={faEye}/> {itemData&&itemData.buyers.length}</p>
         <p>{itemData.description + " " + months[itemData.createdAt.toDate().getMonth()] + " " + itemData.createdAt.toDate().getDate().toString() + ", " + itemData.createdAt.toDate().getFullYear().toString()}</p>
         <div className='item-card-buttons'>
           <button onClick={()=>setShowComments(true)}><FontAwesomeIcon className="commentbtn" icon={faComments}/> {commentNum}</button>
           <LikeButton itemID={props.itemID}/>
           <ShareButton url={"https://fwee.io/item/"+itemData.id}/>
         </div>
     </div>
     :
     <div className="card">card deleted</div>
   );

}

export default ImageCard;