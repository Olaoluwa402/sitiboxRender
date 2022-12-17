import React from "react";

import style from "./chatMessage.module.css";

const ChatMessage = ({ chatMsg, sender, type, time }) => {
	const senderProp = sender ? "#009ffd" : "#567FBD";

	return ( 
		<React.Fragment>
			<div 
				className={style.messages}
				style={{ background: `${senderProp}`, borderRadius: "10px" }}
			>
				{type === "text" ? (
					<div>{chatMsg} <span className={style.timestamp}>{time}</span></div>
			 	) : type === "image" ? (
			 	<div>
			 		<img
						src={chatMsg}
						alt="chat_image"
						style={{ width: "200px" }}
					/> 
					<span className={style.timestamp}>{time}</span></div>
				) : type === "video" ? (
					<div>
						<video
						src={chatMsg}
						alt="video"
						type="video/mp4"
						style={{ width: "200px" }}
						controls
					/>
					<span className={style.timestamp}>{time}</span></div>
				) : <span style={{color:'red'}}>Not supported yet</span>}
			</div>
		</React.Fragment>
	);
};

export default ChatMessage;
