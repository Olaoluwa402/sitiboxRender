import React from "react";
import { NavLink } from "react-router-dom";
import { RiServiceLine } from "react-icons/ri";
import {MdSpeakerNotes} from "react-icons/md";
import { FaRegQuestionCircle, FaUsers,FaInfo,FaBlog,FaAddressCard,FaStethoscope } from 'react-icons/fa';

import logo from "../../img/SitiboxLOGO-min.png";

import "./SideDrawer.css"; 

const SideDrawer = (props) => {
    let drawerClasses = "side-drawer";
    if (props.show) {
        drawerClasses = "side-drawer open";
    }


    return (
        <React.Fragment>
			<nav className={drawerClasses}>
				<div className="drawerClasses-logo__wrapper">
				<img src={logo} alt="9jaclinic"  className="side-drawer-logo" />
				</div>
				<ul className="dropdown-user-icon" id="">
				<li className=" dropdown">
						<NavLink to="/consultants">
							<FaStethoscope className="side-drawer__icon" /> Doctors
						</NavLink>
					</li>
					<li className=" dropdown">
						<a href="https://9jaclinic.com/blog">
							<FaBlog className="side-drawer__icon" /> Blog
						</a>
					</li>
					<li className=" dropdown">
						<NavLink to="/services">
							<RiServiceLine className="side-drawer__icon" /> Services
						</NavLink>
					</li>
					<li className="">
						<NavLink to="/about">
							<FaInfo className="side-drawer__icon" /> About
						</NavLink>
					</li>
					<li className="">
						<NavLink to="/contact">
							<FaAddressCard className="side-drawer__icon" />{" "}
							Contact
						</NavLink>
					</li>
					<li className="">
						<NavLink to="/faq">
							<FaRegQuestionCircle className="side-drawer__icon" />{" "}
							FAQ
						</NavLink>
					</li>
					<li className="">
						<NavLink to="/our-team">
							<FaUsers className="side-drawer__icon" />{" "}
							Team
						</NavLink>
					</li>

					<li className="">
						<NavLink to="/appguide">
							<MdSpeakerNotes className="side-drawer__icon" /> SITIBOX GUIDE
						</NavLink>
					</li>
				</ul>
			</nav>
		</React.Fragment>
    );
};

export default SideDrawer;