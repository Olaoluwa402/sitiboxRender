import React from 'react'
import styles from './CustomModal.module.css'

const CustomModal = (props) => {
  return (
    <div className={styles.modal}>
        <div className={styles.content}>
            <header className={styles.modalHeader}>
                <h1>{props.title}</h1>
            </header>
            <section className={styles.modalContent}>{props.children}</section>
        </div>
	</div>
  ) 
}
 
export default CustomModal
