import React from 'react';

export default function ChatSelector(props)  {
    function changeConversation() {
        let nextConvo = props.conversation.id == "a" ? "b" : "a";
        props.onSelect(nextConvo);
    }

    return (
        <h2 onClick={changeConversation}>{props.conversation.id}</h2>
    )
}
