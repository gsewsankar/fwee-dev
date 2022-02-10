import React, { useState } from 'react';
import ChatAttachment from './ChatAttachment';
import { auth, db } from '../firebaseInitialize';
import { collection, doc, setDoc } from '@firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function ChatInput(props)  {
    const [textState, setText] = useState("");
    const[user] = useAuthState(auth); // TODO: Probably move up and use as prop.

    function sendMessage(e) {
        if (e.key === 'Enter') {
            let message = {
                timestamp: Date.now(),
                from: user.uid,
                text: textState,
                transaction: "", // TODO: Replace with transaction id
            }

            // Send message to DB
            let subCollectionRef = collection(db, 'conversations', props.conversation.id, 'messages')
            let docRef = doc(subCollectionRef, message.timestamp + message.from); // TODO: Replace with a proper id in the second arg
            setDoc(docRef, message);

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
