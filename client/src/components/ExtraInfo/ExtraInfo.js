import React from 'react';
import { Link } from "react-router-dom";
import {FaCheckDouble} from "react-icons/fa";

import styles from './ExtraInfo.module.css'

const ExtraInfoScreen = () => {
    return(
        <>
            {/* extra info */}
            <div className={styles.info}>
                <h4>Free 24/7 Access and Benefits: </h4>
                <ul>
                <li>
                    <div>
                        <FaCheckDouble className={styles.icons}/>
                        <p>Consultation at a very low cost from expert doctors</p>
                    </div>
                    <div>
                        <FaCheckDouble className={styles.icons}/>
                        <p>Direct access to doctors with little or no waiting time</p>
                    </div>
                    </li>
                    <li> 
                        <div>
                            <FaCheckDouble className={styles.icons}/>
                            <p>Direct medical e-prescriptions available from your doctor for free download</p>
                        </div>
                    </li>
                    <li>
                        <div>
                            <FaCheckDouble className={styles.icons}/>
                            <p>Free online medical case file system for easy reference</p>
                        </div>
                    </li>
                    <li>
                        <div>
                            <FaCheckDouble className={styles.icons}/>
                            <p>Prompt response with live chat and sms notification from doctors at no cost</p>
                        </div>
                    </li>
                    <li>
                        <div>
                            <FaCheckDouble className={styles.icons}/>
                            <p>Easy to use and interractive interface</p>
                        </div>
                    </li>
                    <li>
                        <div>
                            <FaCheckDouble className={styles.icons}/>
                            <p>Latest medical news and expert perspectives from 9jaclinic blog</p>
                        </div>
                    </li>
                    <li>
                        <div>
                            <FaCheckDouble className={styles.icons}/>
                            <p>Your information is kept highly confidencial, safe and secured</p>
                        </div>
                    </li>
                </ul>
            </div>
        </>
    )
}

export default ExtraInfoScreen;