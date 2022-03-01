import { Card, CardHeader, TextField } from '@mui/material';
import React, { useState } from 'react'

export default function TransactionForm(props) {
  const [target, setTarget] = useState(null)
  const [amount, setAmount] = useState(0);

  function handleAmountChange(event) {
    setAmount(event.target.value);
  }

  return (
  <Card>
    <CardHeader title="Transaction"/>
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
