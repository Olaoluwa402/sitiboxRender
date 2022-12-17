import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getTransactionsAction } from "../../../actions/walletActions";
import Spinner from "../../Spinner/Spinner";
import Message from "../../Message/Message";
import styles from "./Transactions.module.css";
import Title from "../../Title";
// import Transaction from '../Transaction/Transaction'

const Transactions = () => {
  const dispatch = useDispatch();

  const walletTransactions = useSelector((state) => state.walletTransactions);
  const { loading, error, transactions } = walletTransactions;

  useEffect(() => {
    dispatch(getTransactionsAction());
  }, []);

  return (
    <React.Fragment>
      <div className={styles.container}>
        <Title title="Transactions" align="start" />
        {loading ? (
          <Spinner />
        ) : error ? (
          <Message message="dangerMessage">{error}</Message>
        ) : transactions && transactions.length > 0 ? (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>TransactionId</th>
                  <th>Name</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td>{transaction.transactionId}</td>
                    <td>{transaction.name}</td>
                    <td>{transaction.amount}</td>
                    <td>{transaction.createdAt.substring(0, 10)}</td>
                    <td>{transaction.paymentGateway}</td>
                    <td>{transaction.paymentStatus}</td>
                    <td>{transaction.transactionType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <h2 style={{ textAlign: "center", marginTop: "20px" }}>
            No transaction record yet
          </h2>
        )}
      </div>
    </React.Fragment>
  );
};

export default Transactions;
