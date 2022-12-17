import styled from "styled-components";

export const MessageContainer = styled.div `
	 padding: 0;
	 margin:0;
	display:flex;
	justify-content:${(props) => props.sender ? 'flex-start' : 'flex-end'};
`;