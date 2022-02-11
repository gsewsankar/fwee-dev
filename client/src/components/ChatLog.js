import { collection, onSnapshot, query } from '@firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../firebaseInitialize';
import ChatBubble from './ChatBubble';

export default function ChatLog(props)  {
    const conversationId = props.conversation.id;

    const [messages, setMessages] = useState([]);
    useEffect(() => {
        const q = query(collection(db, 'conversations', conversationId, 'messages'))
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMessages([]);
            snapshot.forEach((message) => {
                setMessages(messages => messages.concat(message.data()));
            });
        })
        return unsubscribe;
    }, []);

    return (
        <div>
            {messages.map((message, index) =>
                <ChatBubble key={index} message={message}/>
            )}
        </div>
    )
}
