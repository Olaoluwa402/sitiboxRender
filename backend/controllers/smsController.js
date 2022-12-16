import asyncHandler from "express-async-handler";
import Vonage from '@vonage/server-sdk';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

// extend dayjs plugins
    dayjs.extend(utc);
    dayjs.extend(timezone);


// @desc    send sms alert to consultation doctor
// @route   POST /api/sendsms
// @access  Private


const SendSMS = asyncHandler(async (req, res, next) => {

    const APIKEY = process.env.API_KEY_VONAGE;
    const APISECRET = process.env.API_SECRET_VONAGE;


    const {
        smsData
    } = req.body;

    const vonage = new Vonage({
        apiKey: APIKEY,
        apiSecret: APISECRET
    });

    const date = new Date();
    const start_Date = dayjs.utc(date, 'z').tz('Africa/Lagos').format('D MMM, YYYY');
    const end_Date = dayjs.utc(date, 'z').add(2, 'day').tz('Africa/Lagos').format('D MMM, YYYY')
     
    function capitalizeFirstLetter(string){
        return string.charAt(0).toUpperCase() + string.slice(1);
   }

    const from = 'SITIBOX';
    const to = smsData.docPhone;
    const text = "Txt: Alert \n" + `Doc: Dr. ${capitalizeFirstLetter(smsData.docName)} \n` + `Pat: ${capitalizeFirstLetter(smsData.patientName)} \n` + "Desc: Consult/3DAYS \n" + `Start: ${start_Date} \n` + `End: ${end_Date} \n` + "Login: https://sitibox.9jaclinic.com";




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
});

export {
    SendSMS
};