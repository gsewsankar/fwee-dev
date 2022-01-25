import Gun from 'gun';
import React, { useEffect, useReducer, useState } from 'react';
import { MessageSender } from '../components/MessageSender';

// initialize gun locally
const gun = Gun({
  peers: [
    'http://localhost:3030/gun'
  ]
})

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

  // initialize the reducer & state for holding the messages array
  const [state, dispatch] = useReducer(reducer, initialState)

  // when the app loads, fetch the current messages and load them into the state
  // this also subscribes to new data as it changes and updates the local state
  useEffect(() => {
    const accounts = gun.get('accounts')
    accounts.map().once(u => {
      dispatch({
        username: u.username,
        password: u.password,
        createdAt: u.createdAt,
        history: u.history,
        total_in: u.total_in,
        total_out: u.total_out,
        balance: u.balance
      })
    })
  }, [])

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
    <div style={{ padding: 30 }}>
      <input
        onChange={onChange}
        placeholder="From"
        name="from"
        value={formState.from}
      />
      <input
        onChange={onChange}
        placeholder="To"
        name="to"
        value={formState.to}
      />
      <input
        onChange={onChange}
        placeholder="Amount"
        name="amount"
        value={formState.amount}
      />
      <button onClick={sendCredits}>Send</button>
      {
        state.accounts.map(u => (
          <div key={u.username}>
            <p>username: {u.username}</p>
            <p>createdAt: {u.createdAt}</p>
            <p>history: {u.history}</p>
            <p>total_in: {u.total_in}</p>
            <p>total_out: {u.total_out}</p>
            <p>balance: {u.balance}</p>
          </div>
        ))
      }
    </div>
  )
}

export default DirectMessages;