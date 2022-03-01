import { Card, CardHeader, FormControl, Input, InputLabel } from '@mui/material';
import React from 'react'

export default function TransactionForm(props) {
  return (
  <Card>
    <CardHeader title="Transaction"/>
    <FormControl>
      <InputLabel htmlFor='transaction-amount-input'>Amount $</InputLabel>
      <Input id='transaction-amount-input'
        inputProps={{ // TODO: Replace FormControl with TextField
          step: 0.01,
          min: 0,
          type: 'number',
          placeholder: '0.00',
        }}
      />
    </FormControl>
  </Card>
  );
}
