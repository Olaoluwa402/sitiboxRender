import styled from "styled-components";

export const HeaderDivider = styled.hr ` 
	width: 20px;
	height:7px;
	background-color:${(props)=> props.color ? "var(--primaryColor)" : "var(--primaryColor)"};
	margin:10px auto;
	text-align:center;
`;