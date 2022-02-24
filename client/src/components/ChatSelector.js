import React, { useState } from 'react';

export default function ChatSelector(props)  {
    const [newConversationId, setNewConversationId] = useState("");

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
        <input placeholder={props.conversation.name || props.conversation.id} 
            value={newConversationId} 
            onChange={handleChange} 
            onKeyDown={handleKeyDown}/>
    )
}
