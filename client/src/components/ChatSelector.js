import React, { useState } from 'react';

export default function ChatSelector({conversationRef, ...props})  {
    const [newConversationId, setNewConversationId] = useState("");
    const currentConversationLabel = conversationRef.data().name || conversationRef.id;

    function handleChange(e) {
        const newText = e.target.value;
        setNewConversationId(newText);
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter') { // Change the active conversation
            props.onChange(newConversationId);
            setNewConversationId("");
        }
    }

    return (
        <input placeholder={currentConversationLabel} 
            value={newConversationId} 
            onChange={handleChange} 
            onKeyDown={handleKeyDown}/>
    )
}
