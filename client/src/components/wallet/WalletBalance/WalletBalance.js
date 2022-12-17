import React, {useEffect, useState, useRef} from 'react'
import {useSelector, useDispatch, } from 'react-redux'
import { useParams } from 'react-router'
import Title from '../../Title'
import styles from './WalletBalance.module.css'
import {
  getBalanceAction, 
  fundWalletAction, 
  verifyFundWalletAction,
  verifyBankAccount, 
  getBanksAction,
  createRecipientAction
} from '../../../actions/walletActions'
import {getAcctList} from '../../../actions/doctorActions' 
import SpinnerWhite from '../../Spinner/SpinnerWhite'
import Spinner from '../../Spinner/Spinner'
import paystackImg from '../../../img/paystack.png'
import qs from 'query-string'
import CustomModal from '../../CustomModal.js/CustomModal'
import { NUBAN } from '../../Nuban'
import {BANK_VERIFY_RESET,CREATE_RECIPIENT_RESET,} from '../../../constants/walletConstants'
import Image from '../../../img/SitiboxLOGO-min.png'
import {FaHourglassHalf} from 'react-icons/fa'

const WalletBalance =() =>{ 
  const {reference} = qs.parse(window.location.search)

  // console.log('reference', reference)
  const [open, setOpen] = useState(false)
  const [state, setState] = useState({
    amount:'',
    acct:'',
    bankCode: '',
  })
  const [errors, setErrors] = useState({
    amount:'',
    acct:'',
    bankCode:''
  }) 

  const doctorLogin = useSelector((state) => state.doctorLogin);
  const { doctorInfo } = doctorLogin;

  const walletBalance = useSelector((state)=> state.walletBalance)
  const {loading, error,success, wallet} = walletBalance; 

  const verifyFundWallet = useSelector((state)=> state.verifyFundWallet)
  const {loading:loadingVerify, error:loadingError, success:successVerify} = verifyFundWallet;

  const getAccts = useSelector((state) => state.getAccts);
  const { loading: acctsLoading, error: acctsError, accts } = getAccts;

  const bankVerify = useSelector((state) => state.bankVerify);
  const { loading: acctVerifyLoading, error: acctVerifyError, verify } = bankVerify;

  const createRecipient = useSelector((state) => state.createRecipient);
  const { loading: recipientLoading, error: recipientError, recipient } = createRecipient;
  
  
  const getBanks = useSelector((state) => state.getBanks);
  const { banks } = getBanks;

  console.log(verify)
// use Ref hook
  let timeOutRef = useRef(null)
  // involke dispatch 
 const dispatch = useDispatch();
//  useEffect 
  useEffect(()=> { 
      dispatch(getBalanceAction())
      dispatch(getAcctList())
 
     if(reference){
        dispatch(verifyFundWalletAction(reference))
     }

     if(verify){
         setOpen((prev)=> !prev)
     }

     if(errors.amount){
        timeOutRef = setTimeout(()=> {
          setErrors({...errors, amount:''})
        }, 5000)
     } 

    //  cleanup
    return ()=> {
      clearTimeout(timeOutRef)
    }
  }, [ errors.amount, reference, verify])


  const fundHandler = ()=> {
    setOpen((prev)=> !prev)
  }

  const initiateWidthdrawHandler = ()=> {
    dispatch(getBanksAction())
    setTimeout(()=> {
      setOpen((prev)=> !prev)
    }, 2000)
  }

  const changeHandler = (e)=> {
     const {value, name} = e.target;
     setState({
      ...state,
      [name]:value
     })
  }
 
  const submitHandler = (e)=> {
    e.preventDefault()
    if(!state.amount || isNaN(state.amount)){
       setErrors({...errors, amount:'Please enter a valid amount'})
       return;
    }
    
    dispatch(fundWalletAction(state.amount))
    setState({
      ...state,
      amount:''
    })
    setOpen((prev)=> !prev)
  }

  const cancelHandler = ()=> {
    setOpen((prev)=> !prev)
    dispatch({
      type:BANK_VERIFY_RESET
    })
    dispatch({
      type:CREATE_RECIPIENT_RESET
    })
  }

  const withdrawHandler = (e)=> {
    e.preventDefault()

   if(!state.acct){
     setErrors({...errors, acct:'Field is required'})
     return;
  }

  if(!state.bankCode){
   setErrors({...errors, bankCode:'Field is required'})
   return;
}
    // console.log('widthdraw', state.bankCode, state.acct)
    dispatch(verifyBankAccount(state.acct, state.bankCode))
   
  } 

  const  createRecipientHandler = (e)=> {
    e.preventDefault()

   if(!state.amount){
     setErrors({...errors, acct:'Field is required'})
     return;
  }

    // console.log('widthdraw', state.bankCode, state.acct)
    dispatch(createRecipientAction(verify.account_name, verify.account_number, verify.bank_code, state.amount))

    setState({
      ...state,
      amount:''
    })
   
  } 

 

  const banksTemp = banks ? [{id:1000, code:'', name:'Select Bank'}, ...banks] : []
  const bankCodes =  banksTemp ? banksTemp.map((data) => (<option key={data.code} value={data.code}>{data.name}</option>)) : []
  
  const acctsArray = accts ? [{_id:'123456hjg', acctNumber:'Select Account'}, ...accts] : []
  const bankAcct = accts ? acctsArray.map((data) => (<option key={data._id} value={data.acctNumber}>{data.acctNumber}</option>)) : []
  

  // Create our number formatter. 
var formatter = new Intl.NumberFormat(undefined, { 
  style: 'currency',
  currency: 'NGN',

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

; /* $2,500.00 */

  return (
    <div className={styles.container}> 
        <Title title='Your Wallet' align='start'/>
        <div className={styles.balance}>
           {loading && (<SpinnerWhite />)}
           {wallet && (<span>{formatter.format(wallet.balance)}</span>)}
           <h4>Balance</h4>

           <div className={styles.funding}>
            {
              doctorInfo 
              ? (<button onClick={initiateWidthdrawHandler}>Widthdraw Fund</button>) 
              : (<button onClick={fundHandler}>Fund Wallet</button>) 
            }
             
          </div>
        </div>

         {open && (<div className={styles.fundingWrapper}>
            <div className={styles.formWrapper}>
              {doctorInfo 
                ? (<Title title='Widthdraw Fund' align='center'/>)
                :<Title title='Fund Your Wallet' align='center'/>
              }
                
                {errors.amount && <span style={{color:'red', fontSize:'0.8rem'}}>{errors.amount}</span>}
                {errors.bankCode && <span style={{color:'red', fontSize:'0.8rem'}}>{errors.bankCode}</span>}
                {errors.acct && <span style={{color:'red', fontSize:'0.8rem'}}>{errors.acct}</span>}
                <div className={styles.form}>
                    {!doctorInfo && (<div className={styles.formGroup}>
                      <label htmlFor="amount">Amount</label>
                      <input 
                        type="text" 
                        value={state.amount} 
                        name='amount' 
                        placeholder='Enter amount e.g 2000'  
                        onChange={changeHandler}/>
                    </div>)
                    }
                    {doctorInfo ? (
                      <>
                        <div className={styles.formGroup}>
                            <label htmlFor='acct'>Account No</label>
                            <select name='acct' id='acct' onChange={changeHandler}>
                              {bankAcct}
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor='bankCode'>Bank</label>
                            <select name='bankCode' id='bankCode' onChange={changeHandler}>
                              {bankCodes}
                            </select>
                        </div>
                      </>
                          ) : null}

                    {acctVerifyLoading && <Spinner />}
                    
                    <div className={styles.actionBtn}>
                      {
                        doctorInfo 
                        ? (<button className={styles.btn} onClick={withdrawHandler}>widthdraw</button>) 
                        : (<button className={styles.btn} onClick={submitHandler}>fund</button>)
                      }
                        <button className={styles.btn} onClick={cancelHandler}>Cancel</button>
                    </div>
                </div>
                <img src={paystackImg} alt="paystack"/>
            </div>
         </div>)}

         { verify && <CustomModal title='Widthrawal'>
            <div className={styles.form}>
                  <div className={styles.acctDetail}>
                     <h4 style={{color:'black'}}>Account Number: {verify.account_number}</h4>
                     <h4 style={{color:'black'}}>Account Name: {verify.account_name}</h4>
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="amount">Amount</label>
                    <input 
                      type="text" 
                      value={state.amount} 
                      name='amount' 
                      placeholder='Enter amount e.g 2000' 
                      onChange={changeHandler}/>
                  </div>

                  
                    <div className={styles.actionBtn}>
                        <button className={styles.btn} onClick={cancelHandler}>Cancel</button>
                      {recipientLoading ? (<Spinner />): (<button disabled = {state.amount ? false : true} className={styles.btn} onClick={createRecipientHandler}>continue</button>) }
                        
                    </div>
                </div>
            
            </CustomModal>
          }

          {recipient && <CustomModal title='Transfer Completed!'>
            <div className={styles.form}>
                <div className={styles.summary}>
                  <FaHourglassHalf style={{fontSize:'2rem'}}/>
                  <p>Pending transfer to <b>{recipient.account_name}</b></p>
                  <p>Account number - {recipient.account_number}</p>
                  <p><b>- {formatter.format(parseFloat(recipient.amount))}</b></p>
                  <p style={{fontSize:'0.8rem'}}>We assure you that your money will be delivered shortly. This might take between few minutes to 24hrs. We will notify you via SMS as soon as it is received.</p>
                  
                  <img src={Image} alt='sitibox' width={150} height={80}/>
                  <p>{recipient.createdAt.substring(0,10)}</p>
                </div>
                
                <div className={styles.actionBtn}>
                    <button className={styles.btn} onClick={cancelHandler}>Close</button>
                </div>
            </div>
            
            </CustomModal>}
    </div> 
  )
}

export default WalletBalance
