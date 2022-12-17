import React from 'react';

const TextArea = (props) => {
    return (
        <div className={styled.formGroup}>
    	<label htmlFor={props.name} className={styled.formLabel}>
				{props.title}
		</label>
		<textarea
				className={styled.formInput}
				id={props.name}
				name={props.name}
				type={props.type}
				col={props.col}
				row={props.row}
				value={props.value}
				onChange={props.handleChange}
			>
			{props.placeholder}
		</textarea>
    </div>
    )
}

export default TextArea;