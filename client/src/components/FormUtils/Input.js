import React from "react";

const Input = (props) => {
    return (
        <div className={styled.formGroup}>
			<label htmlFor={props.name} className={styled.formLabel}>
				{props.title}
			</label>
			<input
				className={styled.formInput}
				id={props.name}
				name={props.name}
				type={props.type}
				value={props.value}
				onChange={props.handleChange}
				placeholder={props.placeholder}
			/>
		</div>
    );
};

export default Input;