import React from "react";
import { Link} from "react-router-dom";

import styled from './ConsultationSteps.module.css';

const ConsultationSteps = ({ step1, step2, step3, step4 }) => {
    return (
        <nav className={styled.stepsContainer}> 
        <ul>
            <li>
              {step1 ? (
          
            <Link to="/complaint" className={styled.steps}>{`1. Complaint`}</Link>
          
        ) : (
          <Link to="/complaint" className={styled.disabled}>Complaint</Link>
        )}
            </li>
            <li>
               {step2 ? (
          
            <Link to="/pickdoctor" className={styled.steps}>{`2. Pick Doctor`}</Link>
          
        ) : (
          <Link to="/pickdoctor" className={styled.disabled}>{`2. Pick Doctor`}</Link>
        )}
            </li>

            <li>
              {step3 ? (
          
            <Link to="/complaint" className={styled.steps}>{`3. Consultation`}</Link>
          
        ) : (
          <Link to="/complaint" className={styled.disabled}>{`3. Consultation`}</Link>
        )}
            </li>
            
        </ul>
      </nav>

    );
};

export default ConsultationSteps;