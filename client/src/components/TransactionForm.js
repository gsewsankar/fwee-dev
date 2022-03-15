import { collection, getDocs } from '@firebase/firestore';
import { Autocomplete, Button, Card, CardActions, CardHeader, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { db } from '../firebaseInitialize';

export default function TransactionForm(props) {
  const {
    onSetTransaction: dispatchSetTransaction,
    prefill,
  } = props;

  const [target, setTarget] = useState(prefill?.target || null);
  const [amount, setAmount] = useState(prefill?.amount || 0);

  const [userSelections, setUserSelections] = useState([])
  useEffect(()=>{
    // Fetch **all** users from DB and 
    // add to state for Autocomplete selections.
    // TODO: Abstract out the DB logic into its own API
    const collectionRef = collection(db, 'users');
    getDocs(collectionRef).then((querySnapshot) => {
      querySnapshot.forEach(snapshot => {
        const snapshotData = snapshot.data();
        const selectionObject = {
          label: snapshotData.displayName,
          id: snapshot.id,
        }
        setUserSelections(prevSelections => prevSelections.concat(selectionObject));
      })
    });
  },[])

  function handleTargetChange(event, newValue) {
    setTarget(newValue);
  }

  function handleAmountChange(event) {
    setAmount(event.target.value);
  }

  function handleAcceptClick() {
    const transaction = {
      target,
      amount,
    }
    dispatchSetTransaction(transaction);
  }

  function handleClearClick() {
    dispatchSetTransaction(null);
  }

  return (
  <Card>
    <CardHeader title="Transaction"/>
    <Autocomplete 
      value={target}
      onChange={handleTargetChange}
      options={userSelections}
      renderInput={(params) => <TextField {...params} label="User" />}
    />
    <TextField label="Amount"
      value={amount}
      onChange={handleAmountChange}
      type="number"
      inputProps={{
        min: 0,
        step: 0.01,
      }}
    />
    <CardActions>
      <Button onClick={handleAcceptClick}>
        Accept
      </Button>
      <Button onClick={handleClearClick}>
        Clear
      </Button>
    </CardActions>
  </Card>
  );
}
