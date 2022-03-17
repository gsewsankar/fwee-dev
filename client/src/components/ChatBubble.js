import './ChatBubble.css';
import { doc, getDoc } from '@firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../firebaseInitialize';
import { Avatar } from '@mui/material';
import { asMessage } from '../firestoreData';

// TODO: Move into a DB controller API.
export async function fetchUsername(uid) {
    const userRef = await getDoc(doc(db, "users", uid));
    return userRef.data().username;
}

export default function ChatBubble(props)  {
    const message = asMessage(props.message);
    const time = message.timestamp.toDate().toLocaleString();

    const [displayName, setDisplayName] = useState(message.from);
    useEffect(()=>{
        fetchUsername(message.from).then(displayName => {
            setDisplayName(displayName)
        });
    }, [message.from]);

    return (
        <div className='message-row' style={{border: "black thin dashed"}}>
            <div className='message-col'>
                <div className='message-line'>
                    <div className='sender'>
                        <Avatar alt={displayName}></Avatar>
                    </div>
                    <div className='message'>{message.text}</div>  
                </div>
                <p className='time'>{time}</p>            
            </div>
        </div>
    )
}
