import React from 'react';
import styled from 'styled-components';


const Title = ({title, align}) => {
  return (
    <Heading align={align}>
        <h2>{title}</h2>
    </Heading>
  )
}

export default Title

const Heading = styled.div`
${
  ({align})=> {
    return `
      h2{
        color:#000;
        font-weight:bold;
        text-align:${align === 'center' ? 'center' : 'start'};
      }
  `
  }
}
`