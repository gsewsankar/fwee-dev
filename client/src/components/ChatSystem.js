import { useEffect, useState } from "react";
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
  },
  {
    id: "c",
    created: Date.now(),
    name: "Dongers",
    users: [],
    messages: [
      "Aloha!",
      "Ciao!"
    ]
  },
]
// END MOCK DATA

export function ChatSystem() {
  const [currentConversation, setConversation] = useState(null);
  useEffect(() => {
    setConversation(conversations[0]); // TODO: Fetch from DB
  }, [])

  function conversationChangeHandler(newConversationId) {
      setConversation(conversations.find(convo => convo.id === newConversationId)) // TODO: Fetch from DB
    }

  if (!currentConversation) return(
    <p>Loading</p>
  )

  return (
    <div>
      <ChatSelector onChange={conversationChangeHandler} conversation={currentConversation}/>
      <ChatLog conversation={currentConversation}/>
      <ChatInput conversation={currentConversation}/>
    </div>
  )
}