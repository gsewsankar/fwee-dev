import { collection, getDocs } from '@firebase/firestore';
import { Autocomplete, Card, CardHeader, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { db } from '../firebaseInitialize';

export default function TransactionForm(props) {
  const [target, setTarget] = useState(null)
  const [amount, setAmount] = useState(0);

  const [userSelections, setUserSelections] = useState([])
  useEffect(()=>{
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
  </Card>
  );
}
