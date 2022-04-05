import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Dialog } from '@mui/material';
import React, { useState } from 'react';
import ChatSettingsForm from './ChatSettingsForm';

export default function ChatSettingsButton(props) {
  const [open, setOpen] = useState(false);

  function handleClick() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  return (<>
    <Button onClick={handleClick}>
      <FontAwesomeIcon icon={faEllipsisV}/>
    </Button>
    <Dialog open={open} onClose={handleClose}>
      <ChatSettingsForm/>
    </Dialog>
  </>)
}
