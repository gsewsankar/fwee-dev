import { doc, getDoc } from '@firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../firebaseInitialize';
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
        <div style={{border: "black thin dashed"}}>
            <p>{displayName} at {time}</p>
            <big>{message.text}</big>  
        </div>
    )
}
