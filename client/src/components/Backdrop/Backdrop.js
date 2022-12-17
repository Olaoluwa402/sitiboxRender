import React from 'react';
import styled from './Backdrop.module.css';

const backdrop = props => <div className={styled.backdrop} onClick={props.click} />



export default backdrop