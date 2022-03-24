import './ChatLog.css'
import { collection, onSnapshot, query } from '@firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../firebaseInitialize';
import ChatBubble from './ChatBubble';

export default function ChatLog({conversationRef})  {
    const [messages, setMessages] = useState([]);

    // Subscribe to this conversation's messages.
    useEffect(() => {
        const q = query(collection(db, 'conversations', conversationRef.id, 'messages'))
        const unsubscribe = onSnapshot(q, (snapshot) => {
            // TODO: Modify so only new messages are rendered.
            setMessages([]);
            snapshot.forEach((message) => {
                setMessages(prevMessages => prevMessages.concat(message.data()));
            });
        })
        return unsubscribe;
    }, [conversationRef]);

    return (
        <div className='log'>
            {messages.map((message, index) =>
                <ChatBubble key={index} message={message}/>
            )}
        </div>
    )
}
