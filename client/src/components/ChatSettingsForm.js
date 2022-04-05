import { arrayUnion, getDoc, updateDoc } from '@firebase/firestore';
import { faCopy, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, DialogTitle, ListItemText, ListSubheader, Stack, TextField } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import UserCard from './UserCard';

export default function ChatSettingsForm(props) {
  const {conversationRef: currentConversationRef} = props;

  const [conversationData, setConversationData] = useState(null)
  useEffect(() => {
    setConversationData(currentConversationRef.data());
  }, [currentConversationRef])

  const newMemberField = useRef(null);

  function refreshConversationData() {
    // TODO: Eliminate the need for this by subscribing to conversation
    // in ChatSystem.js via onSnapshot().
    getDoc(currentConversationRef.ref).then((conversationSnapshot) => {
      setConversationData(conversationSnapshot.data());
    })
  }

  function handleAddMemberClick() {
    const newMemberId = newMemberField.current.value;
    if (!newMemberId) return;
    
    updateDoc(currentConversationRef.ref, {
      members: arrayUnion(newMemberId),
    }).then(() => {refreshConversationData()})
  }

  return(<>
    <DialogTitle>Conversation Settings</DialogTitle>
    <Stack direction='row'>
      <TextField  disabled 
                  label='Conversation ID' 
                  defaultValue={currentConversationRef.id}/>
      <Button><FontAwesomeIcon icon={faCopy}/></Button>
    </Stack>
    <TextField  label='Conversation Name'
                placeholder={conversationData?.name || 
                  currentConversationRef.id}/>
    <ListSubheader>Members</ListSubheader>
    {conversationData && 
      conversationData.members.map((memberId) => {
        return  (<ListItemText key={memberId}>
                  <UserCard uid={memberId}/>
                </ListItemText>)
      })
    }
    <Stack direction='row'>
      <TextField  label='Add Member'
                  inputRef={newMemberField}
                  variant='standard'/>
      <Button onClick={handleAddMemberClick}><FontAwesomeIcon icon={faPlus}/></Button>
    </Stack>
  </>)
}
