import { Card, CardHeader, Input } from '@mui/material';
import React from 'react'

export default function TransactionForm(props) {
  return (
  <Card>
    <CardHeader title="Transaction"/>
    <Input
      inputProps={{
        step: 0.01,
        min: 0,
        type: 'number',
      }}
    />
  </Card>
  );
}
