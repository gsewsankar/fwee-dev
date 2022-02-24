import { useState } from "react";
import ChatInput from "./ChatInput";
import ChatLog from "./ChatLog";
import ChatSelector from "./ChatSelector";

// MOCK DATA
var conversations = [
  {
    id: "a",
    messages: [
      "Hello!",
      "Goodbye!"
    ]
  },
  {
    id: "b",
    messages: [
      "Hola!",
      "Adios!"
    ]
  }
]
// END MOCK DATA

export function ChatSystem() {
  const [currentConversation, setConversation] = useState(conversations[0]); 

  function conversationChangeHandler(newConversationId) {
      setConversation(conversations.find(e => e.id == newConversationId))
    }

  return (
    <div>
      <ChatSelector onSelect={conversationChangeHandler} conversation={currentConversation}/>
      <ChatLog conversation={currentConversation}/>
      <ChatInput conversation={currentConversation}/>
    </div>
  )
}