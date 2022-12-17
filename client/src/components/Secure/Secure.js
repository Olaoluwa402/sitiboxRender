import React from 'react';
import {GiPadlock} from "react-icons/gi";
import { Link } from "react-router-dom";

import styles from './Secure.module.css'

const SecureScreen = ({textColor}) => {
    const style = {
        color:`${textColor}`
    }
    return(
        <>
            {/* extra in */}
            <div className={styles.secure}>
                <div> 
                    <GiPadlock className={styles.lock}/>
                    <p>Your Information is safe and secure. </p>
                </div>
                <Link to="/contact" style={style}>Contact Support</Link>
            </div>
        </>
    ) 
} 

export default SecureScreen;