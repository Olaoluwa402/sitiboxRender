import React from "react";

const CheckBox = (props) => {
    return (
        <div>
			<label htmlFor={props.name} className={styled.form - label}>
				{props.title}
			</label>
			<div className={styled.checkboxGroup}>
				{props.options.map((option) => {
					return (
						<label key={option}>
							<input
								className={styled.formCheckbox}
								id={props.name}
								name={props.name}
								onChange={props.handleChange}
								value={option}
								checked={
									props.selectedOptions.indexOf(option) > -1
								}
								type="checkbox"
							/>
							{option}
						</label>
					);
				})}
			</div>
		</div>
    );
};

export default CheckBox;