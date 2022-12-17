import React from 'react'
import WalletBalance from '../../components/wallet/WalletBalance/WalletBalance'
import Transactions from '../../components/wallet/Transactions/Transactions'

import styles from './WalletScreen.module.css'
const WalletScreen = () => {
  return (
    <div className={styles.container}>
        <WalletBalance /> 
        <Transactions />
    </div>
  )
} 

export default WalletScreen