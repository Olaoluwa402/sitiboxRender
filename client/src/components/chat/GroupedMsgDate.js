import React from 'react';

import styled from './chatMessage.module.css';
const GroupedMsgDate = ({ data }) => {
   return (

   	<React.Fragment>
   		<div className={styled.dateStamp}><span>{data}</span></div>
   </React.Fragment>
   )
   	
};

export default GroupedMsgDate;
