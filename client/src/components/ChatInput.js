import React, { useState } from 'react';
import ChatAttachment from './ChatAttachment';
import { db } from '../firebaseInitialize';
import { collection, doc, serverTimestamp, setDoc } from '@firebase/firestore';

export default function ChatInput(props)  {
    const [textState, setText] = useState("");
    let id = 0;

    function sendMessage(e) {
        if (e.key === 'Enter') {
            let newComment = {
                timestamp: serverTimestamp(),
                text:textState,
            }

            // Send to DB
            let subCollectionRef = collection(db, 'conversations', props.conversation.id, 'messages')
            let docRef = doc(subCollectionRef, newComment.timestamp.toString()); // TODO: Replace with a proper id in the second arg
            setDoc(docRef, newComment);

            setText("");
        }
    }

    return (
        <div>
            <input onKeyDown={sendMessage} onChange={(e) => setText(e.target.value)} text={textState}/>
            <ChatAttachment/>
        </div>
    )
}
