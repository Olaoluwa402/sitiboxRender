import React from "react";
import styled from "./Modal.module.css";

const Modal = (props) => (
    <div className={styled.modal}>
		<header className={styled.modalHeader}>
			<h1>{props.title}</h1>
		</header>
		<section className={styled.modalContent}>{props.children}</section>
	</div>
);

export default Modal;