import React from 'react'
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";


import styles from './Back.module.css'


const Back = (url) => {
  return (
    <div className="backContainer">
        <Link to={url} className={styles.back}>
            <FaArrowLeft className={styles.arrowLeft} /> <span>Back</span>
        </Link>
    </div>
  )
}

export default Back
