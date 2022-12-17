import React from "react";
import "./DrawerToggleButton.css";


const drawerToggleButton = ({ click, SideDrawerOpen }) => {
    let classOpen = 'close';
    if (SideDrawerOpen) {
        classOpen = 'open';
    } 

    return (
        <React.Fragment>
         <div className={`${classOpen} menuToggler mobile`} onClick={click}>
            <div className="bar half start"></div>
            <div className="bar"></div>
            <div className="bar half end"></div>
        </div>
		
	</React.Fragment>
    )
}; 

export default drawerToggleButton;