import './ChatBubble.css';
import { doc, getDoc } from '@firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../firebaseInitialize';
import { Avatar } from '@mui/material';
import { asMessage } from '../firestoreData';

// TODO: Move into a DB controller API.
export async function fetchUserData(uid) {
    const userRef = await getDoc(doc(db, "users", uid));
    return userRef.data();
}

export async function fetchUsername(uid) {
    const userData = await fetchUserData(uid);
    return userData.username;
}

export default function ChatBubble(props)  {
    const message = asMessage(props.message);
    const time = message.timestamp.toDate().toLocaleString();

    // State
    const [displayName, setDisplayName] = useState(message.from);
    const [imgSrc, setImgSrc] = useState('');
    useEffect(()=>{
        fetchUserData(message.from).then(data => {
            setDisplayName(data.username);
            setImgSrc(data.photoURL)
        });
    }, [message.from]);

    return (
        <div className='message-row' style={{border: "black thin dashed"}}>
            <div className='message-col'>
                <div className='message-line'>
                    <div className='sender'>
                        <Avatar 
                            alt={displayName}
                            src={imgSrc}
                        >
                            {displayName}
                        </Avatar>
                    </div>
                    <div className='message'>{message.text}</div>  
                </div>
                <p className='time'>{time}</p>            
            </div>
        </div>
    )
}
