import Doctor from "../models/userModel/doctorModel.js";
import Patient from "../models/userModel/patientModel.js";
import Messages from "../models/messagesModel.js";
import { addUser, loadMessages, formatMessages, getCurrentUser, userJoin, userLeave, getRoomUsers} from "../helpers/misc.js";
import _ from "lodash";


 
const socketConfig = (io) => {
   
    io.on("connection", (socket) => {
        // console.log("socket connected");  

        let userId = socket.handshake.auth.userId; // GET USER ID
        let username = socket.handshake.auth.username; // GET loggedin USER name

        if(!userId){
            // throw new Error('invalid user!'); 
            console.log('No valid user id');
            return;
        }


        const botName = '9jaclinic Bot';
        // welcome current user
        // socket.emit('defaultMessage', formatMessages(botName, 'welcome to 9jaclinic'));
        // console.log(formatMessages(botName, 'welcome to 9jaclinic'))
      
        // get user
        socket.on("getUsers", async (chatData) => {
            const { chatDataD, chatDataP, loggedInUser } = chatData;

            if (chatDataD && chatDataP) {
                try {
                    const doctor = await Doctor.findOne({
                        _id: chatDataD.docID,
                    });

                    const patient = await Patient.findOne({
                        _id: chatDataP.patientID,
                    }); 

                    const docTemp = {
                        _id: doctor._id,
                        name: doctor.firstName,
                        email: doctor.email,
                        avatar: doctor.image,
                        connected: false
                    };

                    const patientTemp = {
                        _id: patient._id,
                        name: patient.clinicName,
                        email: patient.email,
                        avatar: patient.image,
                        connected:false
                    };

                    const userData = {
                        doctor: docTemp,  
                        patient: patientTemp,
                    }; 
 
                    io.emit("usersDetails", userData);
                } catch (err) {console.log(err)}
            }
        });

        // load messages
        loadMessages(socket);

        // start uniquechat
        socket.on(
            "startUniqueChat",
            ({ senderEmail, recieverEmail, recieverID }, callback) => {
                addUser({ senderEmail, recieverEmail, recieverID }, socket);
            }
        );

        // join two users to same room
        socket.on("joinTwoUsers", ({ roomID }, cb) => {

            const user = userJoin({userId, roomID, username})
            socket.join(roomID);

        
            // broadcast when a user connects
            socket.broadcast.to(user.roomID).emit('defaultMessage', formatMessages(botName,  `${user.username} has joined the chat`));
            
            // send users and users info
            io.to(user.roomID).emit('roomUsers', {
                users:getRoomUsers(user.roomID)
            })
            // callback
             cb({ roomID });
        });

        // send to other User
        socket.on("sendTouser", async(data) => { 
            // console.log("sendTouser", data);
 
            socket.broadcast.to(data.roomID).emit("dispatchMsg", { ...data });

            const {
                roomID: roomID,
                senderEmail: senderEmail,
                recieverEmail: recieverEmail,
                composeMsg: { createdAt, time, chatMsg, publicId, type, sender },
            } = data;
        try{
            const message = await new Messages({
                roomID,
                senderEmail,
                recieverEmail,
                time,
                chatMsg,
                publicId,
                type,
                sender,
                createdAt
            }).save();

            socket.broadcast.to(data.roomID).emit("savedMessage", message);
        }catch(err){
            console.log(err);
        }
            
        });

        // For video calls

        // send caller id
        socket.on("myVideoCallID", () => {
            socket.emit("myId", socket.id);
        });

        socket.on("callUserID", ({activeRoom}) => {
            socket.broadcast.to(activeRoom).emit("userToCallSocketId", socket.id)
        });
        

        // call the user
        socket.on("callUser", (data) => {
            io.to(data.userToCall).emit("callUser", {
                signal: data.signalData,
                from: data.from,
                name: data.name,
            });
        }); 

        // answer video call
        socket.on("answerCall", (data) => {
            io.to(data.to).emit("callAccepted", data.signal);
        });
 
        
        // client disconnect 
        socket.on("disconnect", () => {
            // console.log("socket disconnected"); 

            // video call ended
            socket.broadcast.emit("videoCallEnded");

            // user leaves room
            const user = userLeave(userId);
            // console.log('userLeave',user)
            if(user){
                io.to(user.roomID).emit('defaultMessage', formatMessages(botName, `${user.username} has left the chat`));
                
                // send users and users info
                io.to(user.roomID).emit('roomUsers', {
                    users:getRoomUsers(user.roomID)
                })
            }
             

            // let disconnectedUsers = [];
            // const matchingSockets = await io.in(socket.id).allSockets();
            // const isDisconnected = matchingSockets.size === 0;
            // // io.emit("offline", disconnectedUsers);
            // if(isDisconnected){
            //     // notify users 
            //      const  index = disconnectedUsers.findIndex(u => u.userID === userId)
            //     if(index === -1){
            //         disconnectedUsers.push({
            //             userID:userId,
            //             socketID:socket.id
            //         })
            //     }else{
            //         disconnectedUsers[index] = {userID:userId, socketID:socket.id}
            //     }

            //     // io.emit("notOnline", disconnectedUsers);
            //     socket.broadcast.emit("notOnline", disconnectedUsers);
            //     console.log("discon", disconnectedUsers);
            //     console.log(userId, "Is offline!", socket.id);
            //     socket.disconnect(); 
            // }
            
            

        
        });
 
    });
};

export { socketConfig };
