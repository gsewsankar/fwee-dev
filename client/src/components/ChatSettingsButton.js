import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@mui/material';
import React from 'react';

export default function ChatSettingsButton(props) {
  return (<Button>
    <FontAwesomeIcon icon={faEllipsisV}/>
  </Button>)
}
