import React from "react";
import {Link} from "react-router-dom";


import styled from "./Footer.module.css";

const Footer = () =>{
	return (
		<>
			<div className={styled.footer}>
				<ul>
					<li><Link to="/privacy">Privacy</Link></li>
					<li><Link to="/terms">Terms of Service</Link></li>
					<li><Link to="/feedback">Feedbacks</Link></li>
					<li><Link to="/faq">FAQ</Link></li>
				</ul>
			</div>
		</>

 )
}

export default Footer;