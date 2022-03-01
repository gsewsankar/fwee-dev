import React, { useState } from 'react';
import ChatAttachmentPopper from './ChatAttachmentPopper';
import { auth, db } from '../firebaseInitialize';
import { collection, doc, setDoc } from '@firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { newMessage } from '../firestoreData';

export default function ChatInput({conversationRef})  {
    const [textState, setText] = useState("");
    const[user] = useAuthState(auth); // TODO: Probably move up and use as prop.

    function handleKeyDown(e) {
        if (e.key === 'Enter') { // Send the message to the DB
            let message = newMessage();
            message.from = user.uid;
            message.text = textState;
            message.transactionId = ""; // TODO: Replace with transaction id, if any

            // Send message to DB
            let subCollectionRef = collection(db, 'conversations', conversationRef.id, 'messages')
            let docRef = doc(subCollectionRef, message.timestamp + message.from);
            setDoc(docRef, message);

            setText("");
        }
    }

    function handleChange(e) {
        const newText = e.target.value;
        setText(newText);
    }

    return (
        <div>
            <input value={textState} onChange={handleChange} onKeyDown={handleKeyDown}/>
            <ChatAttachmentPopper/>
        </div>
    )
}
