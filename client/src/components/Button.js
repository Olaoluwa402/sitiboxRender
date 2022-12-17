import styled from "styled-components";

export const ButtonContainer = styled.button `
	text-transform: capitalize;
	font-size: 0.9rem;
	background: transparent;
	border: 0.05rem solid var(--mainWhite);
	border-color: ${(props) =>
		props.sec ? "var(--mainYellow)" : "var(--mainWhite)"};
	color: ${(props) => (props.sec ? "var(--mainWhite)" : "var(--mainWhite)")};
	border-radius: 0.5rem;
	padding: 1.2rem 1.8rem;
	 @media (max-width: 576px) {
   	padding:0.5rem 0.8rem;
   	font-size: 0.9rem;
  };
	cursor: pointer;
	margin: 0.2rem 0.5rem 0.2rem 0;
	transition: all 0.5s ease-in-out;

	&:hover {
		background: ${(props) =>
			props.sec
				? "linear-gradient(to right, var(--primaryColor), var(--mainYellow))"
				: "linear-gradient(to right, var(--primaryColor), var(--mainYellow))"};
		color: var(--mainWhite);
		transform: scale(1.1);
		border-color: var(--mainWhite) 
	}
	&:focus {
		outline: none;
	}
`;