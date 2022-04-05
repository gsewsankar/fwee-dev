import React from 'react'
import { useAsyncState } from '../util/CustomReactHooks';
import { fetchUsername } from './ChatBubble';

export default function UserCard(props) {
  const {uid} = props;
  
  const [username] = useAsyncState(fetchUsername(uid));

  return (<>
    {username}
  </>)
}
