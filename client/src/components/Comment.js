import React from 'react';
import './Comment.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import {useDocumentData} from 'react-firebase-hooks/firestore';

function Comment(props){
    const db = firebase.firestore();
    const[writer, writerLoading] = useDocumentData(db.collection('users').doc(props.info.uid));

    // function timeSince(date) {
    //     var seconds = Math.floor((new Date() - date) / 1000);
    //     var interval = seconds / 31536000;
    //     if (interval > 1) {
    //       return Math.floor(interval) + " years ago";
    //     }
    //     interval = seconds / 2592000;
    //     if (interval > 1) {
    //       return Math.floor(interval) + " months ago";
    //     }
    //     interval = seconds / 86400;
    //     if (interval > 1) {
    //       return Math.floor(interval) + " days ago";
    //     }
    //     interval = seconds / 3600;
    //     if (interval > 1) {
    //       return Math.floor(interval) + " hrs ago";
    //     }
    //     interval = seconds / 60;
    //     if (interval > 1) {
    //       return Math.floor(interval) + " mins ago";
    //     }
    //     return Math.floor(seconds) + " secs ago";
    // }

    if(writerLoading){
        return(<div></div>);
    }
    
    return(
        <div className="comment">
            <img src={writer && writer.photoURL} alt="brkn"></img>
            <p>{props.info.body}</p>
        </div>
    )
  }

export default Comment;