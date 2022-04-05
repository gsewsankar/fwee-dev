import { faCopy, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, DialogTitle, ListItemText, ListSubheader, Stack, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import UserCard from './UserCard';

export default function ChatSettingsForm(props) {
  const {conversationRef: currentConversationRef} = props;

  const [conversationData, setConversationData] = useState(null)
  useEffect(() => {
    setConversationData(currentConversationRef.data());
  }, [currentConversationRef])

  function refreshConversationData() {
    setConversationData(currentConversationRef.data());
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
                placeholder={conversationData?.name}/>
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
                  variant='standard'/>
      <Button><FontAwesomeIcon icon={faPlus}/></Button>
    </Stack>
  </>)
}
