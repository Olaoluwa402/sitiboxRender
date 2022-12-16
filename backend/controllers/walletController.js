import axios from "axios";
import asyncHandler from "express-async-handler";
import Patient from "../models/userModel/patientModel.js";
import Doctor from "../models/userModel/doctorModel.js";
import Wallet from '../models/wallet/walletModel.js';
import Transaction from "../models/wallet/transactionModel.js";
import WalletTransaction from "../models/wallet/walletTransactionModel.js";
import Account from "../models/accountModel.js";
import crypto from 'crypto'
import { sendSMS } from "../helpers/misc.js";
import dayjs from "dayjs";
// import Transaction from "../models/wallet/transactionModel";
// import WalletTransaction from "../models/wallet/walletTransactionModel";
 
//create wallet
const createWallet = asyncHandler(async(req,res, next)=> {
    const userId = req.body.id;
   try{
      const patient = await Patient.findById({_id:userId});
      if(!patient) {
        res.status(404);
        throw new Error("No user found, pls ensure you are logged In");
      }

        // check that wallet do not exist already
      const walletExist = await Wallet.findOne({patientId:userId});
      if(walletExist){
        res.status(500)
        throw new Error('Wallet is already created')
      }

      // create wallet if it does not exist yet
      const wallet = await Wallet.create({
        patientId:userId
      })

      res.status(200).json({
        sucess:true,
        wallet
      })
      
   }catch(err){
      console.log("err", err);
      res.status(500);
      throw new Error("Something went wrong");
   }
})
  
// get wallets balance
const getWallet = asyncHandler(async(req, res, next) => {

    try{ 
       let user;
       if(req.user.doctorIsVerified){
          user = 'doctorId'
       }else{
        user = 'patientId'
       }
        
      const wallet = await Wallet.findOne({[user]:req.user._id});
       if(!wallet){
        res.status(500);
        throw new Error("No associated wallet found");
       }
      res.status(200).json({ 
        success:true, 
        wallet
      }) 
    }catch(err){ 
      console.log("err", err);
      res.status(500);
      throw new Error("No associated wallet found");
    }
})
 
// initiate wallet funding
const fundWallet = asyncHandler(async (req,res,next)=> {
    try{
      const {amount} = req.body

       
        const fundingDetail = {
            first_name: `${req.patient.firstName}`,
            last_name:`${req.patient.lastName}`,
            email: `${req.patient.email}`,
            amount: amount * 100,
            metadata:{
              first_name: `${req.patient.firstName}`,
              last_name:`${req.patient.lastName}`,
              email:  `${req.patient.email}`,
            }, 
        }; 
        
        const PAYSTACK_KEY = process.env.PAYSTACK_KEY;

        const url = "https://api.paystack.co/transaction/initialize";
        const option = {
            headers: {
                authorization: `Bearer ${PAYSTACK_KEY}`,
                "content-type": "application/json",
                "cache-control": "no-cache",
            },
        };

        const { data } = await axios.post(`${url}`, fundingDetail, option);

        console.log(data)

        res.status(200).json({
          status:'success',
          data:data.data.authorization_url
      });

    }catch(err){
      console.log(err)
    }
})

// Validating User wallet
const validateUserWallet = async (user) => {
    try {

      const {userKey, userId} = user

      // if user is patient
      if(userKey === 'patient'){
          // check if user have a wallet, else create wallet
        const userWallet = await Wallet.findOne({patientId:userId });
    
        // If user wallet doesn't exist, create a new one
        if (!userWallet) { 
          // create wallet
          const wallet = await Wallet.create({
            patientId:userId
          });
          return wallet;
        }
        return userWallet;
      }

    } catch (error) {
      console.log('validateUserWallet',error);
    }
  }
  
// Create Wallet Transaction
const createWalletTransaction = async (user, status, currency, amount) => {
  try {

    const {userKey, userId} = user;

    if(userKey === 'patient'){
        // create wallet transaction
      const walletTransaction = await WalletTransaction.create({
        amount: parseInt(amount)/100,
        patientId:userId, 
        isInflow: true,
        currency, 
        status, 
      });
      return walletTransaction;
    }
    
  } catch (error) {
    console.log('createWalletTransaction',error);
  }
}
  
  // Create Transaction
  const createTransaction = async (record) => {
    const {userKey, userId} = record.user;
    try {

      if(userKey === 'patient'){
          // create transaction
          const existTransactionId = await Transaction.findOne({transactionId: record.reference})
          if(!existTransactionId){
            const transaction = await Transaction.create({
              patientId:userId, 
              transactionId: record.reference,
              transactionType:record.type,
              name: `${record.metadata.first_name} ${record.metadata.last_name}`,
              email: record.customer.email,
              amount : parseInt(record.amount)/100,
              currency:record.currency,  
              paymentStatus: record.status,
              paymentGateway: "paystack",
            });
            return transaction;
          }else{return null}
      }else{
           // create transaction
           const existTransactionId = await Transaction.findOne({transactionId: record.reference})
           if(!existTransactionId){
             const transaction = await Transaction.create({
               doctorId:userId, 
               transactionId: record.reference,
               transactionType:record.type,
               name: `${record.account_name}`,
               email: record.customer,
               amount : parseInt(record.amount)/100,
               currency:record.currency,  
               paymentStatus: record.status,
               paymentGateway: "paystack",
               transfer_code:record.transfer_code,
               account_number:record.account_number,
               reason:record.reason
             });
             return transaction;
           }else{
            return null;
           }
      }
      
    } catch (error) {
      console.log('createTransaction',error);
    }
  };

  // Update wallet 
const updateWallet = async (user, amount) => {
  const {userKey, userId} = user;
    try {
      if(userKey === 'patient'){
          // update wallet
        const wallet = await Wallet.findOneAndUpdate(
          { patientId:userId },
          { $inc: { balance: parseInt(amount)/100 } },
          { new: true }
        );
        return wallet;
      }

      if(userKey === 'doctor'){
        // update wallet
      const wallet = await Wallet.findOneAndUpdate(
        { doctorId:userId },
        { $inc: { balance: -parseInt(amount)/100 } },
        { new: true }
      );
      return wallet;
    }
    } catch (error) {
      console.log('updateWallet',error);
    }
  }


const transactionResponse = asyncHandler(async (req,res, next) =>{
    const { ref } = req.body;
    
    const PAYSTACK_KEY = process.env.PAYSTACK_KEY;

    const config = { 
        headers: {
          Authorization: `Bearer ${PAYSTACK_KEY}`,
          "content-type": "application/json",
          "cache-control": "no-cache",
          },
    }  

  // URL with transaction ID of which will be used to confirm transaction status
  const url = `https://api.paystack.co/transaction/verify/${ref}`;
  
  try{
        // Network call to confirm transaction status
        const {data} = await axios.get(url, config); 

        console.log('verify',data)

        // throw error if transaction verification failed
        if (data.status === false) {
          res.status(500);
          throw new Error("Not verified, invalid credentials");
      } 
        const { status,currency, reference, amount, customer, metadata} = data.data;

        // check if customer exist in our database
        const patient = await Patient.findOne({ email: customer.email });
      
        // check if user have a wallet, else create wallet
        const user = {
          userKey:'patient', 
          userId : patient._id
        }
         await validateUserWallet(user);
      
        // create wallet transaction
        await createWalletTransaction(user, status, currency, amount);
      
         const record = {
            user,reference,status,type:'fund',currency,amount,customer,metadata,
         }
        // create transaction
        const transaction = await createTransaction(record);
      
        let wallet;
        if(data.data.status === 'success' && transaction !== null){
          wallet = await updateWallet(user, amount);
        }

        res.status(200).json({
            response: "wallet funded successfully",
            data: wallet,
          });
  }catch(err){
     console.log('transactionResponse',err)
  }
  
    
})
   
const getTransactions = asyncHandler(async (req, res, next)=> {
  try{ 
    let user;
    if(req.user.doctorIsVerified){
       user = 'doctorId'
    }else{
     user = 'patientId'
    }
     
   const transactions = await Transaction.find({[user]:req.user._id}).sort({_id:-1});
   
   res.status(200).json({ 
     success:true, 
     transactions
   }) 
 }catch(err){ 
   console.log("err", err);
   res.status(500);
   throw new Error("No associated wallet found");
 }
}) 

const getBanks = asyncHandler(async(req, res, next)=> {
  const PAYSTACK_KEY = process.env.PAYSTACK_KEY;
  
  try{
    const url = `https://api.paystack.co/bank?currency=NGN`
    const options = {
      headers: {
        Authorization: `Bearer ${PAYSTACK_KEY}`
      }
    }
    const {data} = await axios.get(url, options)
// console.log(data)
    res.status(200).json({ 
      success:true, 
      banks: data.data
    }) 
    
    }catch(err){
      console.log(err.response.data)
      res.status(500)
      throw new Error(err.response.data.message)
    }
  })

const verifyAccountNumber = asyncHandler(async(req, res, next)=> {
  const PAYSTACK_KEY = process.env.PAYSTACK_KEY;
  const {acct, bankCode} = req.body;
  try{
    const url = `https://api.paystack.co/bank/resolve?account_number=${acct}&bank_code=${bankCode}`
    const options = {
      headers: {
        Authorization: `Bearer ${PAYSTACK_KEY}`
      }
    }
    const {data} = await axios.get(url, options)
  
    res.status(200).json({  
      success:true, 
      data: {
        account_number: data.data.account_number,
        bank_code:bankCode,
        account_name:data.data.account_name
      }
    }) 
    
    }catch(err){
      console.log(err.response.data)
      res.status(500)
      throw new Error(err.response.data.message)
    }
  }) 

const widthdrawWalletFund = asyncHandler( async(req, res, next) => {
  try{
    const {acct, bankCode} = req.body;
      // verify account number before making payment
     const acctVerification =  await verifyAccountNumber(acct, bankCode);

  }catch(err){
      console.log(err)
      res.status(500)
      throw new Error('something went wrong')
  }
}) 

const transfer = async(raw, user)=> {
  const PAYSTACK_KEY = process.env.PAYSTACK_KEY;

  const config = { 
      headers: {
        Authorization: `Bearer ${PAYSTACK_KEY}`,
        "content-type": "application/json",
        "cache-control": "no-cache",
        },
  }  

  const options = {
    source: "balance",
    amount: raw.amount,
    recipient: raw.recipient_code,
    reason: 'Consultation Renumeration'
  }
 
const url = `https://api.paystack.co/transfer`;

try{
  // Network call to confirm transaction status
  const {data} = await axios.post(url, options, config); 
 
  console.log(data)
  if(data.data.status === 'false'){
    console.log(data.data.message)
    throw new Error(data.data.message)
  }else{
    //resgister the transaction to the db

    const record = {
      user:raw.user,
      reference:data.data.reference,
      status:data.message === 'Transfer has been queued' ? 'pending' : null,
      type:'transfer',
      currency:data.data.currency,
      amount:data.data.amount,
      customer:raw.email,
      account_name:raw.account_name,
      recipient_code:raw.recipient_code,
      account_number:raw.account_number,
      reason:data.data.reason
   }
   console.log('record',record)
  // create transaction
    const transaction = await createTransaction(record);

    console.log(transaction)

    if(transaction){
       //update wallet
       await Wallet.findOneAndUpdate(
        { doctorId:user.userId},
        { $inc: { balance: -parseInt(data.data.amount)/100 } },
        { new: true }
      );

      return {
        account_name:transaction.name,
        amount:transaction.amount, 
        account_number:transaction.account_number,
        createdAt:transaction.createdAt,
        paymentGateway:transaction.paymentGateway
      };
    }
   
  }
   
}catch(err){
  console.log(err)
  throw new Error(err)
} 

}

const transferRecipient = asyncHandler(async (req,res, next) =>{
  const { account_name, account_number, bank_code, amount } = req.body;


   const balance = await Wallet.findOne({doctorId:req.doctor._id})
    if(amount > balance.balance){
        res.status(500)
        throw new Error('Sorry!, insufficient balance')
    }

    if(amount < 100 ){
      res.status(500)
      throw new Error('Sorry!, Minimum withdrawal is N1000')
  }
  
  const PAYSTACK_KEY = process.env.PAYSTACK_KEY;

  const config = { 
      headers: {
        Authorization: `Bearer ${PAYSTACK_KEY}`,
        "content-type": "application/json",
        "cache-control": "no-cache",
        },
  }  

  const options = {
    type:"nuban",
    name: account_name,
    account_number: account_number,
    bank_code: bank_code,
    currency: "NGN"
  }
 
const url = `https://api.paystack.co/transferrecipient`;

try{
  // Network call to confirm transaction status
  const {data} = await axios.post(url, options, config); 

  console.log(data)
  const detail = {
    amount: Number(amount) * 100 ,
    recipient_code: data.data.recipient_code,
    account_name,
    account_number: account_number,
    user : {
      userKey:'doctor', 
      userId : req.doctor._id
    },
    email:req.doctor.email
  }

  const user = {
    userKey:'doctor', 
    userId : req.doctor._id
  }

  // initiate transfer
   const result = await transfer(detail, user)
  res.status(200).json({
      status: 'success',
      data: result,
    });
}catch(err){
  console.log(err)
  res.status(500)
  throw new Error(err)
}
})

const webhookEvents = async(req,res)=> {
  const PAYSTACK_KEY = process.env.PAYSTACK_KEY;

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

    //validate event
    const hash = crypto.createHmac('sha512', PAYSTACK_KEY).update(JSON.stringify(req.body)).digest('hex');
   try{
    if (hash == req.headers['x-paystack-signature']) {

      // Retrieve the request's body
      const event = req.body;
      // console.log('event',event)
        
      //update funding
      if(event.event === 'charge.success'){
        console.log('event',event)
        const transaction = await Transaction.findOne({transactionId:event.data.reference})
        console.log('Transaction not found', transaction)
        if(!transaction){
            console.log('Transaction not found')
            return
        } 

          console.log('event-inner',event)
          //update wallet
        if(transaction.paymentStatus === 'success'){
           return;
        }

         transaction.paymentStatus = event.data.status
          await Wallet.findOneAndUpdate(
            { patientId:transaction.patientId },
            { $inc: { balance: parseInt(event.data.amount)/100 } },
            { new: true }
          );
        
          await transaction.save()
        

         // sent text message to admin
         const patient = await Patient.findOne({_id:transaction.patientId})
         const phone = patient.phone;
         const msg =
           `SITIBOX Credit wallet: NGN${parseFloat(event.data.amount / 100)} \n` +
           `Date: ${dayjs(event.data.paid_at).format('DD-MM-YYYY h:mm:ss A')}\n` + 
           `Desc: TELEMEDCINE: Fund wallet for Dr ${capitalizeFirstLetter(patient.clinicName)} \n` +
           `https://sitibox.9jaclinic.com/feedback`

         sendSMS({ phone: phone, message: msg }); 

         res.sendStatus(200)
      }


      // trasfer update
      if(event.event === 'transfer.failed'){
        console.log('event',event)
        const transaction = await Transaction.findOne({transactionId:event.data.reference})
        if(!transaction){
          console.log('Transaction not found')
          return
        }
        transaction.paymentStatus = event.data.status

          //update wallet
          await Wallet.findOneAndUpdate(
          { doctorId:transaction.doctorId },
          { $inc: { balance: parseInt(event.data.amount)/100 } },
          { new: true }
        );
        await transaction.save()

        res.sendStatus(200)
      } 

      if(event.event === 'transfer.reversed'){
        console.log('event',event)
        const transaction = await Transaction.findOne({transactionId:event.data.reference})
        if(!transaction){
          console.log('Transaction not found')
          return
        }
       
        transaction.paymentStatus = event.data.status

          //update wallet
          await Wallet.findOneAndUpdate(
          { doctorId:transaction.doctorId },
          { $inc: { balance: parseInt(event.data.amount)/100 } },
          { new: true }
        );
      
        await transaction.save()

        res.sendStatus(200)
      }  

      if(event.event === 'transfer.success'){
        console.log('event',event)
        const transaction = await Transaction.findOne({transactionId:event.data.reference})
        if(transaction){
            transaction.paymentStatus = event.data.status
        }
        await transaction.save()

        // sent text message to admin
          const doctor = await Doctor.findOne({_id:transaction.doctorId})
          const docPhone = doctor.phone;
          const msg =
            `SITIBOX Debit Widthdrawal: NGN${parseFloat(event.data.amount / 100)} \n` +
            `Date: ${dayjs(event.data.recipient.created_at).format('DD-MM-YYYY h:mm;ss A')}\n` + 
            `Desc: TELEMEDCINE: Wallet Widthdrawal for Dr ${capitalizeFirstLetter(doctor.firstName)} \n` +
            `https://sitibox.9jaclinic.com/feedback`

          sendSMS({ phone: docPhone, message: msg }); 

          res.sendStatus(200)

      }

    }
    
   }catch(err){
      console.log(err)
   }
}




export {
    transactionResponse, 
    createWallet,
    getWallet,
    fundWallet,
    getTransactions,
    verifyAccountNumber,
    getBanks,
    widthdrawWalletFund,
    transferRecipient,
    webhookEvents
}