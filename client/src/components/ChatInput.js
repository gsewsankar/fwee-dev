import React, { useState } from 'react';
import ChatAttachmentPopper from './ChatAttachmentPopper';
import { auth, db, gun } from '../firebaseInitialize';
import { collection, doc, setDoc } from '@firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { newMessage } from '../firestoreData';
import { MessageSender } from './MessageSender';
import { fetchUsername } from './ChatBubble';

export default function ChatInput({conversationRef})  {
    const [textState, setText] = useState("");
    const [transaction, setTransaction] = useState(null);
    const[user] = useAuthState(auth); // TODO: Probably move up and use as prop.

    function handleChange(e) {
        const newText = e.target.value;
        setText(newText);
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter') { // Send the message to the DB
            submitMessage();
        }
    }

    async function handleSetTransaction(transaction) {
        if (!transaction) return clearInput();

        transaction.from = user.uid;
        setTransaction(transaction);
        const transactionText = `` +
            `Hi, ${await fetchUsername(transaction.to)}. ` +
            `I'm sending you ${transaction.amount} fwee coins!\n\n`;
        setText(transactionText);
    }

    function submitMessage() {
        // Validate
        if (!textState) return;

        let message = newMessage();
        message.from = user.uid;
        message.text = textState;
        message.transactionId = ""; // TODO: Replace with transaction id, if any

        // Send message to DB
        let subCollectionRef = collection(db, 'conversations', conversationRef.id, 'messages')
        let docRef = doc(subCollectionRef, message.timestamp + message.from);
        setDoc(docRef, message);

        // Send transaction to Gun
        sendCredits(transaction)

        clearInput();
    }
    
    // set a new message in gun, update the local state to reset the form field
    function sendCredits(transaction) {
        const accounts = gun.get('accounts');

        MessageSender(transaction)
        accounts.set(transaction)
    }

    function clearInput() {
        setTransaction(null);
        setText("");
    }

    return (
        <div>
            <textarea value={textState} onChange={handleChange} onKeyDown={handleKeyDown}/>
            <ChatAttachmentPopper transaction={transaction} onSetTransaction={handleSetTransaction}/>
        </div>
    )
}
