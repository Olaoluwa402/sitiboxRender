import React, { useEffect, useRef } from "react";
import ChatMessage from "./chatMessage";
import GroupedMsgDate from "./GroupedMsgDate";
// import ScrollToBottom from 'react-scroll-to-bottom';
import { MessageContainer } from "../chatContainer";
import dayjs from 'dayjs';
import _ from "lodash"; 


const ChatBody = ({ activeRoomMsgs }) => {
    const messagesEndRef = useRef(null); 

    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [activeRoomMsgs]);

    let groupedResults = _.groupBy(activeRoomMsgs, (message) => dayjs(message['createdAt']).startOf('isoWeek').format('MMM D YYYY'));;
    const keys = Object.keys(groupedResults);
    
    return (
        <div style={{ overflowY: "scroll", flex: "1" }}>
            {keys.length > 0 ? (keys.map((data, index) => {

        const ac = (<GroupedMsgDate key={index}  data={data}/>)

        const ab = groupedResults[data].map(({ _id, chatMsg, sender, type, time }) => {
            return (<MessageContainer key={_id} sender={sender}>
                        <ChatMessage
                            key={_id}
                            chatMsg={chatMsg}
                            sender={sender}
                            type={type}
                            time={time}
                        /> 
                    </MessageContainer>);
        }) 

        return [ac, ab]
      }
       ) 
            ) : (
                <div
                    style={{
                        height: "85vh",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        color:"var(--primaryColor)",
                        padding:"1.2rem"
                    }}
                >
                    <p>Welcome to 9jaclinic sitibox chat app consultation room!</p>
                    
                    <p style={{marginTop:"1.5rem", lineHeight:"1.5"}}>
                        Feel free to record a voice note, drop a message, send a
                        picture or video to your doctor, he/she has been notified
                        that you are online. 
                    </p>
                    <p>Start Chatting..</p>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default ChatBody;
