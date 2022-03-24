import './ChatBubble.css';
import { doc, getDoc } from '@firebase/firestore';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebaseInitialize';
import { Avatar } from '@mui/material';
import { asMessage } from '../firestoreData';
import { useAuthState } from 'react-firebase-hooks/auth';

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
    // Props
    const message = asMessage(props.message);

    // Hooks
    const [user] = useAuthState(auth);

    // Fields
    const time = message.timestamp.toDate().toLocaleString();
    const alignment = message.from === user.uid? 'sent' : 'received';

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
        <div className={`message-row ${alignment}`}>
            <Avatar alt={displayName}
                    src={imgSrc}
                    className='avatar'>
                {displayName}
            </Avatar>
            <div className='message-col'>
                <div className='message-line'>
                    <div className='message'>{message.text}</div>  
                </div>
                <p className='time'>{time}</p>            
            </div>
        </div>
    )
}
