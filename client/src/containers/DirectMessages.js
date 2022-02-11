import Gun from 'gun';
import React, { useReducer, useState } from 'react';
import ChatInput from '../components/ChatInput';
import ChatLog from '../components/ChatLog';
import ChatSelector from '../components/ChatSelector';
import { MessageSender } from '../components/MessageSender';

// MOCK DATA
var conversations = [
  {
    id: "a",
    messages: [
      "Hello!",
      "Goodbye!"
    ]
  },
  {
    id: "b",
    messages: [
      "Hola!",
      "Adios!"
    ]
  }
]
// END MOCK DATA

// initialize gun locally
const gun = Gun();

// create the initial state to hold the messages
const initialState = {
  accounts: []
}

// Create a reducer that will update the messages array
function reducer(state, user) {
  return {
    accounts: [user, ...state.accounts]
  }
}

function DirectMessages() {
  // the form state manages the form input for sending credits
  const [formState, setForm] = useState({
    from: '',
    to: '',
    amount: 0.00,
    time: Date.now()
  })

  const [currentConversation, setConversation] = useState(conversations[0]);

  // initialize the reducer & state for holding the messages array
  const [state/*, dispatch*/] = useReducer(reducer, initialState)

  // when the app loads, fetch the current messages and load them into the state
  // this also subscribes to new data as it changes and updates the local state
  // TODO: Fix with actual gun document (It's not 'accounts') and uncomment.
  // useEffect(() => {
  //   const accounts = gun.get('accounts')
  //   accounts.map().once(u => {
  //     dispatch({
  //       username: u.username,
  //       password: u.password,
  //       createdAt: u.createdAt,
  //       history: u.history,
  //       total_in: u.total_in,
  //       total_out: u.total_out,
  //       balance: u.balance
  //     })
  //   })
  // }, [])

  function conversationChangeHandler(newConversationId) {
    setConversation(conversations.find(e => e.id == newConversationId))
  }

  // set a new message in gun, update the local state to reset the form field
  function sendCredits() {
    const accounts = gun.get('accounts');
    const transaction = {
      from: formState.from,
      to: formState.to,
      amount: formState.amount,
      time: Date.now()
    }

    MessageSender(transaction)
    accounts.set(transaction)
    setForm({
      from: '',
      to: '',
      amount: 0.00,
      time: Date.now()
    })
  }

  // update the form state as the user types
  function onChange(e) {
    setForm({ ...formState, [e.target.name]: e.target.value  })
  }

  return (
    <div>
      <ChatSelector onSelect={conversationChangeHandler} conversation={currentConversation}/>
      <ChatLog conversation={currentConversation}/>
      <ChatInput conversation={currentConversation}/>
    </div>
  )
  
  // return (
  //   <div className='form-section' style={{ padding: 30 }}>
  //     <input
  //       onChange={onChange}
  //       placeholder="From"
  //       name="from"
  //       value={formState.from}
  //     />
  //     <input
  //       onChange={onChange}
  //       placeholder="To"
  //       name="to"
  //       value={formState.to}
  //     />
  //     <input
  //       onChange={onChange}
  //       placeholder="Amount"
  //       name="amount"
  //       value={formState.amount}
  //     />
  //     <button onClick={sendCredits}>Send</button>
  //     {
  //       state.accounts.map(u => (
  //         <div key={u.username}>
  //           <p>username: {u.username}</p>
  //           <p>createdAt: {u.createdAt}</p>
  //           <p>history: {u.history}</p>
  //           <p>total_in: {u.total_in}</p>
  //           <p>total_out: {u.total_out}</p>
  //           <p>balance: {u.balance}</p>
  //         </div>
  //       ))
  //     }
  //   </div>
  // )
}

export default DirectMessages;