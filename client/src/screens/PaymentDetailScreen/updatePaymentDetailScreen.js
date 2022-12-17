import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import selectOption from "../../components/selectOption";
import Message from "../../components/Message/Message";
import Spinner from "../../components/Spinner/Spinner";
import { toast } from "react-toastify";
import { getAcctDetail, updateAccount } from "../../actions/doctorActions";
import {
  UPDATE_ACCTDETAIL_RESET,
  GET_ACCTDETAIL_RESET,
} from "../../constants/doctorConstants";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./updatePaymentDetailScreen.module.css";

const UpdatePaymentDetailScreen = () => {
  const navigate = useNavigate();
  // get id from match params
  const { id } = useParams();
  const acctId = id;

  const { bankOptions, paymentPatternOptions } = selectOption();

  const dispatch = useDispatch();

  const doctorLogin = useSelector((state) => state.doctorLogin);
  const { doctorInfo } = doctorLogin;

  const getAcct = useSelector((state) => state.getAcct);
  const { loading, acct } = getAcct;

  const updateAcct = useSelector((state) => state.updateAcct);
  const { loading: updateLoading, error: updateError, success } = updateAcct;

  const [values, setValues] = useState({
    name: "",
    acctNumber: "",
    bankName: "",
    paymentPattern: "",
  });

  useEffect(() => {
    if (!doctorInfo) {
      navigate("/");

      toast.warning("Only registered doctors are authorized!.");
    }

    if (!acct) {
      dispatch(getAcctDetail(acctId));
    } else {
      setValues({
        name: acct.name,
        acctNumber: acct.acctNumber,
        bankName: acct.bankName,
        paymentPattern: acct.paymentPattern,
      });
    }

    if (success) {
      dispatch({ type: GET_ACCTDETAIL_RESET });
      dispatch({ type: UPDATE_ACCTDETAIL_RESET });
      navigate("/docdashboard/paydetail");
    }
  }, [dispatch, navigate, acct, success, doctorInfo]);

  //    if(acct){
  // 	setValues({
  // 		name: acct.name,
  // 	    acctNumber: acct.acctNumber,
  // 	    bankName: acct.bankName,
  // 	})
  // }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();

    // Dispatch register
    const myData = {
      name: values.name,
      acctNumber: values.acctNumber,
      bankName: values.bankName,
      paymentPattern: values.paymentPattern,
    };

    dispatch(updateAccount(myData));
  };
  return (
    <React.Fragment>
      <div className={styles.container}>
        {loading && <Spinner />}
        <h2>Update Account</h2>

        <div className={styles.addAcct}>
          <form onSubmit={submitHandler}>
            <input
              type="text"
              name="name"
              value={values.name}
              placeholder="Account Name"
              onChange={handleChange}
            />

            <input
              type="text"
              name="acctNumber"
              value={values.acctNumber}
              placeholder="Account Number"
              onChange={handleChange}
            />

            <select
              name="bankName"
              value={values.bankName}
              onChange={handleChange}
            >
              {bankOptions.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              name="paymentPattern"
              value={values.paymentPattern}
              onChange={handleChange}
            >
              {paymentPatternOptions.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {updateLoading && <Spinner />}
            {updateError && (
              <Message message="dangerMessage">{updateError}</Message>
            )}
            <button type="submit">Update</button>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
};

export default UpdatePaymentDetailScreen;
