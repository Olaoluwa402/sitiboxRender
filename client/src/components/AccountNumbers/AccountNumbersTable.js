import React from 'react';


import styles from './AccountNumbersTable.module.css';

const AccountNumbersTable = ({accts}) => {
    return (
        <React.Fragment>
            <div className={styles.tableWrapper}>
                    <h4>Account Details</h4>
					<table className="table-sm">
						<thead>
							<tr>
								<th>Account Name</th>
								<th>Account Number</th>
								<th>Bank Name</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{accts.map((acct) => (
								<tr key={acct._id}>
									<td>{acct.name}</td>
									<td>{acct.acctNumber}</td>
									<td>{acct.bankName}</td>
								</tr>
							))}
						</tbody>
					</table> 
				</div>
        </React.Fragment>
    )
}

export default AccountNumbersTable;