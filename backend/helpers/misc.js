import Chats from "../models/chatsModel.js";
import Messages from '../models/messagesModel.js';
import { v4 as uuidv4 } from "uuid";
import Vonage from "@vonage/server-sdk";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';


// extend dayjs plugins
    dayjs.extend(utc);
    dayjs.extend(timezone);

const users = [];

const addUser = async({ senderEmail, recieverEmail }, socket) => {
   console.log("addUser", senderEmail, recieverEmail)
    if (!recieverEmail || !senderEmail) {
        return { error: "Users are required" };
    }
 
    const user = { recieverEmail, senderEmail };
    try{
         await Chats.aggregate([{
        $match: {
            recieverEmail: recieverEmail,
            senderEmail: senderEmail,
        },
    }, ]).then(async(chat) => {
        if (chat.length > 0) {
            socket.emit("openChat", { ...chat[0] });
        } else {
            await Chats.aggregate([{
                $match: {
                    recieverEmail: senderEmail,
                    senderEmail: recieverEmail,
                },
            }, ]).then(async(lastAttempt) => {
                if (lastAttempt.length > 0) {
                    socket.emit("openChat", { ...lastAttempt[0] });
                } else {

                    const newChat = {
                        ...user,
                        roomID: uuidv4(),
                    };

                    socket.emit("openChat", newChat);

                    // save new chat
                    await new Chats(newChat).save();
                }
            });
        }
    });
    }catch(err){
        console.log(err);
    }
       
   
};

const formatMessages = (name, text) => {
	const date = new Date();
    return {
        name,
        text,
        time: dayjs.utc(date, 'z').tz('Africa/Lagos').format('h:mm A'),
    }
}

const userJoin = ({userId, roomID, username}) => {
    const user = {
        id: userId,
        username: username, 
        roomID: roomID
    };

     const  index = users.findIndex(u => u.id === userId)
        if(index === -1){
            users.push(user) 
            console.log(users)
        }else{
            users[index] = user
        }
    return user;
}


// get current user
const getCurrentUser = (id) => {
    return users.find(user => user.id === id);
}

// user leaves
const userLeave = (id) => {
    const index = users.findIndex(user => user.id === id)
console.log('userLeave', id, index);
    if(index !== -1){
        console.log('userLeave',index);
        return users.splice(index, 1)[0];
    }
}

// get room users
const getRoomUsers = (room) => {
    return users.filter(user => user.roomID === room);
}

const loadMessages = async(socket) => {

    socket.on('myMsgs', async({ myEmail }, cb) => {
        try{
            await Messages.find({
            $or: [

                { senderEmail: myEmail },
                { recieverEmail: myEmail }
            ]
        }).then((msgs) => {
            if (!msgs) return cb(null);
            
            cb(msgs);
        });
        }catch(err){
            console.log(err)
        }
    });

};

const sendSMS = async({phone,message}) => {
    const APIKEY = process.env.API_KEY_VONAGE;
    const APISECRET = process.env.API_SECRET_VONAGE;

    const vonage = new Vonage({
        apiKey: APIKEY,
        apiSecret: APISECRET
    });

  
    const from = 'SITIBOX';
    const to = phone;
    const text = message;

 vonage.message.sendSms(from, to, text, (err, responseData) => {
        if (err) {
            console.log('smsError', err);
        } else {
            if (responseData.messages[0]['status'] === "0") {
                
                console.log("Message sent successfully.");
            } else {
                console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
            }
        }
    });
}


export { addUser, sendSMS, loadMessages, formatMessages, userJoin, getCurrentUser, userLeave, getRoomUsers};