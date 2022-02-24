import { collection, doc, getDoc, getDocs, limit, query, setDoc } from "@firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebaseInitialize";
import { newConversation } from "../firestoreData";
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
      } else { // Add the conversation to the DB
        const newConversationData = newConversation();
        const newDocRef = doc(db, "conversations", newConversationId);
        setDoc(newDocRef, newConversationData);
        setConversation(newDocRef);
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