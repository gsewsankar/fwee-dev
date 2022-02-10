import React, { useState } from 'react';
import ChatAttachment from './ChatAttachment';
import * as fs from 'firebase/firestore';
import { db } from '../firebaseInitialize';

export default function ChatInput(props)  {
    const [textState, setText] = useState("");
    let id = 0;

    function sendMessage(e) {
        if (e.key === 'Enter') {
            let newComment = {
                timestamp: fs.serverTimestamp(),
                text:textState,
            }

            // Send to DB
            let subCollectionRef = fs.collection(db, 'conversations', props.conversation.id, 'messages')
            let docRef = fs.doc(subCollectionRef, newComment.timestamp.toString()); // TODO: Replace with a proper id in the second arg
            fs.setDoc(docRef, newComment);

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
