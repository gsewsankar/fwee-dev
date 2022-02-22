import React from 'react';
import { asMessage } from '../firestoreData';

export default function ChatBubble(props)  {
    const message = asMessage(props.message);
    const time = message.timestamp.toDate().toLocaleString();

    return (
        <div style={{border: "black thin dashed"}}>
            <p>{message.from} at {time}</p>
            <big>{message.text}</big>  
        </div>
    )
}
