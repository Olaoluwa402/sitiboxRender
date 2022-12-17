import React from "react";

import "./Message.css";

const Message = ({ message, children }) => {
    return (
        <React.Fragment>
			<div className={message}>{children}</div>
		</React.Fragment>
    );
};

Message.defaultProps = {
    message: "defaultMessage",
};

export default Message;