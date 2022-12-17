import React, {useState} from "react";
import Backdrop from "../Backdrop/Backdrop";
import Footer from "../Footer/Footer";
import Header from "../NavigationHeader/NavigationHeader";
import SideBar from "../SideDrawer/SideDrawer";

import styles from "./Layout.module.css";
const Layout = ({children}) => {
  const [SideDrawerOpen, setSideDrawerOpen] = useState(false);

  const drawerToggleClickHandler = () => {
    setSideDrawerOpen((prevState) => !prevState);
  };

  const backdropClickHandler = () => {
    setSideDrawerOpen(false);
  };

  let backdrop;
  if (SideDrawerOpen) {
    backdrop = <Backdrop click={backdropClickHandler} />;
  }

  return (
    <div className='container'>
      <Header 
        drawerClickHandler={drawerToggleClickHandler}
        SideDrawerOpen={SideDrawerOpen}
      />
      <SideBar 
        show={SideDrawerOpen}
      />
      {backdrop} 
      <div className={styles.main}>
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
 