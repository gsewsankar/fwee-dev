import React, { useState } from 'react';
import ChatAttachment from './ChatAttachment';
import { auth, db } from '../firebaseInitialize';
import { collection, doc, setDoc } from '@firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { newMessage } from '../firestoreData';

export default function ChatInput(props)  {
    const [textState, setText] = useState("");
    const[user] = useAuthState(auth); // TODO: Probably move up and use as prop.

    function sendMessage(e) {
        if (e.key === 'Enter') {
            let message = newMessage();
            message.from = user.uid;
            message.text = textState;
            message.transactionId = ""; // TODO: Replace with transaction id, if any

            // Send message to DB
            let subCollectionRef = collection(db, 'conversations', props.conversation.id, 'messages')
            let docRef = doc(subCollectionRef, message.timestamp + message.from);
            setDoc(docRef, message);

            setText("");
        }
    }

    return (
        <div>
            <input onKeyDown={sendMessage} onChange={(e) => setText(e.target.value)} value={textState}/>
            <ChatAttachment/>
        </div>
    )
}
