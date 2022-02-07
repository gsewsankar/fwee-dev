import React from 'react';

export default function ChatSelector(props)  {
    function changeConversation() {
        let nextConvo = props.conversation.id == "a" ? "b" : "a";
        props.onSelect(nextConvo);
    }

    return (
        <div onClick={changeConversation}>conversation: "{props.conversation.id}"</div>
    )
}
