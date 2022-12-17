import React from 'react'
import styles from './Transaction.module.css'

const Transaction = ({transaction}) => {
  return (
    <tr>
        <td>{transaction.transactionId}</td>
        <td>{transaction.name}</td>
        <td>{transaction.amount}</td>
        <td>{transaction.createdAt.substring(0,10)}</td>
        <td>{transaction.paymentGateway}</td>
        <td>{transaction.paymentStatus}</td>
        <td>{transaction.transactionType}</td>
    </tr>
  ) 
}

export default Transaction