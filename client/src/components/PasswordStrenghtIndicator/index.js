import React from "react";

const PasswordStrengthIndicator = ({
    validity: { minChar, number, specialChar, pwMatched }
}) => {
    return (
        <div className="password-meter text-left mb-4">
            <p style={{color:'#333333', fontSize:'0.8rem'}}>Strong password must:</p>
            <ul className="text-muted" style={{fontSize:'0.7rem'}}>
                <PasswordStrengthIndicatorItem
                    isValid={minChar}
                    text="Have at least 8 characters"
                /> 
                <PasswordStrengthIndicatorItem
                    isValid={number}
                    text="Have at least 1 number"
                />
                <PasswordStrengthIndicatorItem
                    isValid={specialChar}
                    text="Have at least 1 special character"
                />
                <PasswordStrengthIndicatorItem 
                    isValid={pwMatched}
                    text="Password matched with confirm password"
                />
            </ul>
        </div>
    ); 
};

const PasswordStrengthIndicatorItem = ({ isValid, text }) => {
    const highlightClass = isValid
        ? "text-success"
        : isValid !== null
        ? "text-danger"
        : "";
    return <li className={highlightClass}>{text}</li>;
};

export default PasswordStrengthIndicator;