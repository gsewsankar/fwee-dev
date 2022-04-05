import { collection, doc, getDoc, getDocs, limit, query, setDoc } from "@firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../firebaseInitialize";
import { newConversation } from "../firestoreData";
import ChatInput from "./ChatInput";
import ChatLog from "./ChatLog";
import ChatSettingsButton from "./ChatSettingsButton";
import ChatSelector from "./ChatSelector";
import { useAuthState } from "react-firebase-hooks/auth";

export function ChatSystem() {
  const[user] = useAuthState(auth);

  const [currentConversationRef, setConversationRef] = useState(null);
  // Fetch the initial conversation.
  useEffect(() => {
    const q = query(collection(db, "conversations"), limit(1));
    getDocs(q).then(querySnapshot => {
      // Since query should be limited to 1 result, forEach is just used to access the single result.
      querySnapshot.forEach(doc => setConversationRef(doc));
    })
  }, [])

  function handleConversationChange(newConversationId) {
    setConversationRef(null); // Force loading
    getDoc(doc(db, "conversations", newConversationId)).then(docSnap => {
      if (docSnap.exists()) {
        setConversationRef(docSnap);
      } else { // Add the conversation to the DB
        const newDocRef = doc(db, "conversations", newConversationId);
        const newConversationData = newConversation();
        newConversationData.members.push(user.uid)
        setDoc(newDocRef, newConversationData);
        setConversationRef(newDocRef);
      }
    })
  }

  if (!currentConversationRef) return(
    <p>Loading</p>
  )

  return (
    <div>
      <ChatSelector onChange={handleConversationChange} conversationRef={currentConversationRef}/>
      <ChatSettingsButton conversationRef={currentConversationRef}/>
      <ChatLog conversationRef={currentConversationRef}/>
      <ChatInput conversationRef={currentConversationRef}/>
    </div>
  )
}