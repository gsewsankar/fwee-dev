import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Dialog } from '@mui/material';
import React from 'react';
import ChatSettingsForm from './ChatSettingsForm';

export default function ChatSettingsButton(props) {
  return (<>
    <Button>
      <FontAwesomeIcon icon={faEllipsisV}/>
    </Button>
    <Dialog>
      <ChatSettingsForm/>
    </Dialog>
  </>)
}
