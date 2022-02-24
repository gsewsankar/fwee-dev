import { doc, getDoc } from '@firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../firebaseInitialize';
import { asMessage } from '../firestoreData';

async function fetchDisplayName(uid) {
    const userRef = await getDoc(doc(db, "users", uid));
    return userRef.data().displayName;
}

export default function ChatBubble(props)  {
    const message = asMessage(props.message);
    const time = message.timestamp.toDate().toLocaleString();

    const [displayName, setDisplayName] = useState(message.from);
    useEffect(()=>{
        fetchDisplayName(message.from).then(displayName => {
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
