import React from "react";
import style from "./Banner.module.css";

const Banner = ({ children, title, subtitle }) => {
    return (
        <div className={`${style.banner} unique`}>
			<h1>{title}</h1>
			<p>{subtitle}</p>
			{children}
		</div>
    );
};

export default Banner;