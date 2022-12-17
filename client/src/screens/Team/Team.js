import React from "react";
import { Link } from "react-router-dom";
import teamImage1 from '../../img/tunde.png';
import teamImage2 from '../../img/eunice.png';
import teamImage3 from '../../img/daniel.png';
import Layout from "../../components/Layout/Layout";

import styles from './Team.module.css';


const Team = () =>{ 
	
	return (
		<Layout>
			<div className={styles.wrapper}>
            <h1>Our Team</h1>
                <div className={styles.team}>
                    <div className={styles.teamMember}>
                        <div className={styles.teamImg}>
                            <img src={teamImage1} alt="Team_image"  className={styles.img}/>
                        </div>
                        <h3><a href="https://www.linkedin.com/in/babatunde-olanipekun-2362731a4" target="_blanck">Dr Babatunde <br/>OLANIPEKUN</a></h3>
                        <p className={styles.role}>CEO/Medical Doctor</p>
                        <p>A Nigerian medical doctor, Resident Physician and digital healthcare entrepreneur. Over the years, he has worked as a clinician and manager in several hospitals, cutting across all levels of care.</p>
                    </div>

                    <div className={styles.teamMember}>
                        <div className={styles.teamImg}>
                            <img src={teamImage2} alt="Team_image" width={100} height={100} className={styles.img}/>
                        </div> 
                        <h3><a href="https://www.linkedin.com/in/eunice-obebe-27a27593" target="_blanck">Eunice Oluwafolaranmi<br/>OBEBE</a></h3>
                        <p className={styles.role}>Developer/social Media Manager</p>
                        <p>Eunice Obebe is a multitalented graduate of Computer Science. A Front-end developer that is passionate about providing solutions to things of interest through technology.</p>
                    </div> 

                    <div className={styles.teamMember}>
                        <div className={styles.teamImg}>
                            <img src={teamImage3} alt="Team_image" width={100} height={100} className={styles.img}/>
                        </div>
                        <h3><a href="https://www.linkedin.com/in/ibukun402" target="_blanck">Olaoluwa Daniel <br/>IBUKUN</a></h3>
                        <p className={styles.role}>Lead Software Developer</p>
                        <p>A software Developer and Pharmaceutical Analyst, passionate about solving problems and meeting business needs using web technologies. Leveraging the power of technology, we can innovate, build, and bring ideas to reality.</p>
                    </div>
                    
                    
                </div>
			</div>
		</Layout>

 )
}


export default Team;