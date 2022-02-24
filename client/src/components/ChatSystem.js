import { collection, doc, getDoc, getDocs, limit, query } from "@firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebaseInitialize";
import ChatInput from "./ChatInput";
import ChatLog from "./ChatLog";
import ChatSelector from "./ChatSelector";

export function ChatSystem() {
  const [currentConversation, setConversation] = useState(null);
  // Fetch the initial conversation.
  useEffect(() => {
    const q = query(collection(db, "conversations"), limit(1));
    getDocs(q).then(querySnapshot => {
      // Since query should be limited to 1 result, forEach is just used to access the single result.
      querySnapshot.forEach(doc => setConversation(doc)); // TODO: Consolodate data and Id
    })
  }, [])

  function handleConversationChange(newConversationId) {
    getDoc(doc(db, "conversations", newConversationId)).then(docSnap => {
      if (docSnap.exists()) {
        setConversation(docSnap); // TODO: Consolodate data and Id
      } else {
        console.log("No such doc found: ", newConversationId); // TODO: Replace with conversation creation.
      }
    })
  }

  if (!currentConversation) return(
    <p>Loading</p>
  )

  return (
    <div>
      <ChatSelector onChange={handleConversationChange} conversation={currentConversation}/>
      <ChatLog conversation={currentConversation}/>
      <ChatInput conversation={currentConversation}/>
    </div>
  )
}