import React, { useCallback, useContext} from 'react';
import { useDropzone } from 'react-dropzone';
import {WebSocketContext} from '../../WebSocket';

// import { MdAttachment } from "react-icons/md";
import { MdSend } from "react-icons/md";
import { ImUpload2 } from "react-icons/im";
import { useDispatch } from "react-redux";
import { Tooltip as ReactTooltip } from 'react-tooltip'


import styled from "./chatFooter.module.css";



const ChatFooter = ({ submitHandler, txtMsg, setTxtMsg, chatWithDoctor, chatWithPatient, doctorInfo, patientInfo }) => {
    const dispatch = useDispatch();

    const wlbs = useContext(WebSocketContext);

    // dropzone hook handler for files
    const onDrop = useCallback(acceptedFiles => {

        uploadFile(acceptedFiles[0]);

    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    // read file and convert to base64 string
    const uploadFile = (file) => {
        const reader = new FileReader();
        // console.log(file);
        reader.readAsDataURL(file);
        reader.onloadend = (file) => {
            // setPreviewSource(reader.result);
            let chatReciever;

            if (patientInfo) {
                chatReciever = chatWithDoctor.email;
            } else {
                chatReciever = chatWithPatient.email;
            }


            const chatData = {
                chatFile: reader.result,
                reciever: chatReciever,
                fileType: file.type
            };



            dispatch(wlbs.sendMsg({ chatData }));
        };
    };

    // // upload file
    // const uploadFile = () => {

    //     let chatReciever;

    //     if (patientInfo) {
    //         chatReciever = chatWithDoctor.email;
    //     } else {
    //         chatReciever = chatWithPatient.email;
    //     }


    //     const chatFile = previewSource;
    //     const reciever = chatReciever;
    //     console.log(chatFile);
    //     console.log(reciever);

    //     dispatch(sendMsg(chatFile, reciever));

    // };


    return (
        <React.Fragment>
         <form onSubmit={submitHandler} className={styled.formContainer}>
                     
                     <div style={{display:'flex', justifyContent:'center', alignItems:'center'}} {...getRootProps()}>
                          <input {...getInputProps()} />
                          {
                            isDragActive ?
                              (<ImUpload2 data-tip="upload image,video, or file " data-for='uploadButton' className={styled.formIcons} />) : (<ImUpload2 data-tip="upload image,video, or file " data-for='uploadButton' className={styled.formIcons} />)
                          }
                     </div>
                  
                        <input
                            type="text"
                            name="message"
                            value={txtMsg}
                            placeholder="Type message"
                            onChange={(e) => setTxtMsg(e.target.value)}
                            className={styled.inputGroup}
                        />
                   
                        
                        <button data-tip="Send Message" data-for='sendButton' type="submit" className={styled.join}>
                            <MdSend style={{fontSize: '1.5rem'}}/>
                        </button>
                        <ReactTooltip id='sendButton' />
                        <ReactTooltip id='uploadButton' />
                </form>
    </React.Fragment>
    )
}

export default ChatFooter;