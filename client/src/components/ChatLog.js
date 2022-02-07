import React from 'react';
import ChatBubble from './ChatBubble';

export default function ChatLog(props)  {
    let chatId = 0;

    return (
        <div>
            ChatLog
            {props.conversation.messages.map(e =>
                <ChatBubble key={chatId++} text={e}/>
            )}
        </div>
    )
}
