 import {
    CHATTINGWITH_DOCTOR,
    CHATTINGWITH_PATIENT,
    ACTIVE_ROOM,
    ACTIVE_USER,
    ADD_MESSAGE,
    INJECT_MESSAGE,
    LOAD_MESSAGES,
    CLEAR_ACTIVE_MSGS,
    ACTIVE_ROOM_MSGS,
    CHAT_UPLOAD_REQUEST,
    VIDEO_SOCKETID,
    USERTOCALL_SOCKETID,
    ADD_ROOMUSERS,
    BOT_MESSAGE
} from '../constants/chatConstants';

const chatWithPatientFromStorage = localStorage.getItem("chatWithPatient") ?
    JSON.parse(localStorage.getItem("chatWithPatient")) :
    null;

const chatWithDoctorFromStorage = localStorage.getItem("chatWithDoctor") ?
    JSON.parse(localStorage.getItem("chatWithDoctor")) :
    null;

const activeChatUserFromStorage = localStorage.getItem("activeChatUser") ?
    JSON.parse(localStorage.getItem("activeChatUser")) :
    null;

const activeRoomFromStorage = localStorage.getItem("activeRoom") ?
    JSON.parse(localStorage.getItem("activeRoom")) :
    null;

const videoSocketIdFromStorage = localStorage.getItem("videoSocketId") ?
    JSON.parse(localStorage.getItem("videoSocketId")) :
    null;
const userToCallSocketIdFromStorage = localStorage.getItem("userToCallSocketId") ?
    JSON.parse(localStorage.getItem("userToCallSocketId")) :
    null;


const iniTialState = {
    activeChatUser: activeChatUserFromStorage,
    chatWithPatient: chatWithPatientFromStorage,
    chatWithDoctor: chatWithDoctorFromStorage,
    videoSocketId: videoSocketIdFromStorage,
    messages: [],
    activeRoom: activeRoomFromStorage,
    activeRoomMsgs: [],
    loading: false,
    myVideoCallID: "",
    userToCallSocketId:userToCallSocketIdFromStorage,
    roomUsers:[],
    botMessage:{}
};
export const chatReducer = (state = iniTialState, action) => {
    switch (action.type) {
        case ACTIVE_USER:
            return {
                ...state,
                activeChatUser: action.payload,
            };
        case CHATTINGWITH_PATIENT:
            return {
                ...state,
                chatWithPatient: action.payload
            };
        case CHATTINGWITH_DOCTOR:
            return {
                ...state,
                chatWithDoctor: action.payload
            };
        case ACTIVE_ROOM:
            return {
                ...state,
                activeRoom: action.payload
            };
        case LOAD_MESSAGES:
            return {
                ...state,
                messages: [...action.payload]
            };
        case BOT_MESSAGE:
            return {
                ...state,
                botMessage:action.payload
            };
        case VIDEO_SOCKETID:
            return {
                ...state,
                videoSocketId: action.payload
            };
        case USERTOCALL_SOCKETID:
            return {
                ...state,
                userToCallSocketId: action.payload
            };
        case CHAT_UPLOAD_REQUEST:
            return {
                ...state,
                loading: true
            };
        case ADD_MESSAGE:
            return {
                ...state,
                messages: [...state.messages, action.payload],
                activeRoomMsgs: [...state.activeRoomMsgs, action.payload]
            };
        case ADD_ROOMUSERS:
            const { id } = action.payload;
            const checkIfUserIDExists = state.roomUsers.filter(
                    ({ id: userID }) => userID === id,
                );

          if (checkIfUserIDExists.length > 0) {
                return {
                    ...state,
                };
            } else { 
                return {
                    ...state,
                    roomUsers: action.payload,
                };
            }
        case INJECT_MESSAGE:
            const { _id } = action.payload;
            const checkIfMsgIDExists = state.messages.filter(
                ({ _id: msgID }) => msgID === _id,
            );

            if (checkIfMsgIDExists.length > 0) {
                return {
                    ...state,
                };
            } else { 
                return {
                    ...state,
                    messages: [...state.messages, action.payload],
                    activeRoomMsgs: [...state.messages, action.payload]
                };
            }

        case ACTIVE_ROOM_MSGS:
            return {
                ...state,
                activeRoomMsgs: action.payload
            };
        case CLEAR_ACTIVE_MSGS:
            return {
                ...state,
                activeRoomMsgs: []
            };
        default:
            return state;
    }
};