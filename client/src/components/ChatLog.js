import React from 'react';
import ChatBubble from './ChatBubble';

export default function ChatLog(props)  {

    return (
        <div>
            {props.conversation.messages.map((message, index) =>
                <ChatBubble key={index} text={message}/>
            )}
        </div>
    )
}
