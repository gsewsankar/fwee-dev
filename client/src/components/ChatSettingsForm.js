import { DialogTitle, TextField } from '@mui/material'
import React from 'react'

export default function ChatSettingsForm(props) {
  const {conversationRef: currentConversationRef} = props;

  return(<>
    <DialogTitle>Conversation Settings</DialogTitle>
    <TextField disabled 
               label="Conversation ID" 
               defaultValue={currentConversationRef.id}/>
  </>)
}
