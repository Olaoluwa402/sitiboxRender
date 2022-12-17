import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import {
  addAccount,
  getAcctList,
  deleteAcct,
} from "../../actions/doctorActions";
import {
  ADD_ACCT_RESET,
  DELETE_ACCT_RESET,
} from "../../constants/doctorConstants";
import Message from "../../components/Message/Message";
import Spinner from "../../components/Spinner/Spinner";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import selectOption from "../../components/selectOption";
import { useNavigate } from "react-router-dom";
import styled from "./PaymentDetailScreen.module.css";

const PaymentDetailScreen = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    name: "",
    acctNumber: "",
    bankName: "",
    paymentPattern: "",
  });

  const [errors, setErrors] = useState({});
  const { bankOptions, paymentPatternOptions } = selectOption();

  const dispatch = useDispatch();

  const doctorLogin = useSelector((state) => state.doctorLogin);
  const { doctorInfo } = doctorLogin;

  const addAcct = useSelector((state) => state.addAcct);
  const { loading, error, acct } = addAcct;

  const getAccts = useSelector((state) => state.getAccts);
  const { loading: acctsLoading, error: acctsError, accts } = getAccts;

  const acctDelete = useSelector((state) => state.acctDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = acctDelete;

  // doctor Info will be null if not logged in
  useEffect(() => {
    if (!doctorInfo) {
      navigate("/");

      toast.warning("Only registered doctors are authorized!.");
    }

    if (acct || successDelete) {
      dispatch({ type: ADD_ACCT_RESET });
      dispatch({ type: DELETE_ACCT_RESET });
      dispatch(getAcctList());
    } else {
      dispatch(getAcctList());
    }
  }, [dispatch, navigate, acct, doctorInfo, successDelete]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const validate = ({ values }) => {
    let errors = {};

    // name
    if (!values.name.trim()) {
      errors.name = "name cannot be empty";
    }

    // email
    if (!values.acctNumber) {
      errors.acctNumber = "Please, provide Account Number!";
    }

    // message
    if (!values.bankName) {
      errors.bankName = "Please, provide Bank Name!";
    }

    if (!values.paymentPattern) {
      errors.patternOptions = "Please payment pattern!";
    }

    return errors;
  };

  const submitHandler = (e) => {
    e.preventDefault();

    // set errors
    setErrors(validate({ values }));

    // Dispatch register
    const myData = {
      name: values.name,
      acctNumber: values.acctNumber,
      bankName: values.bankName,
      paymentPattern: values.paymentPattern,
    };

    if (
      myData.name &&
      myData.acctNumber &&
      myData.bankName &&
      myData.paymentPattern
    ) {
      dispatch(addAccount(myData));
    } else {
      return;
    }
  };

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deleteAcct(id));
    }
  };

  return (
    <React.Fragment>
      <div className={styled.addAcct}>
        {errors.name && <p>{errors.name}</p>}
        {errors.acctNumber && <p>{errors.acctNumber}</p>}
        {errors.bankName && <p>{errors.bankName}</p>}
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

          {loading && <Spinner />}
          {error && <Message message="dangerMessage">{error}</Message>}
          <button type="submit">Add Account</button>
        </form>
      </div>

      {errorDelete && <Message message="dangerMessage">{errorDelete}</Message>}
      {loadingDelete && <Spinner />}

      {acctsLoading ? (
        <Spinner />
      ) : acctsError ? (
        <Message message="dangerMessage">{acctsError}</Message>
      ) : accts && accts.length > 0 ? (
        <div className={styled.tableWrapper}>
          <table className="table-sm">
            <thead>
              <tr>
                <th>Account Name</th>
                <th>Account Number</th>
                <th>Bank Name</th>
                <th>Payment Pattern</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {accts.map((acct) => (
                <tr key={acct._id}>
                  <td>{acct.name}</td>
                  <td>{acct.acctNumber}</td>
                  <td>{acct.bankName}</td>
                  <td>
                    {acct.paymentPattern ? acct.paymentPattern : "Monthly"}
                  </td>
                  <td>
                    <Link to={`/docdashboard/paydetail/${acct._id}`}>
                      <button className={styled.btn}>
                        <FaEdit />
                      </button>
                    </Link>
                  </td>
                  <td>
                    <button
                      className={styled.btn}
                      onClick={() => deleteHandler(acct._id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <h3>No account added yet</h3>
        </div>
      )}
    </React.Fragment>
  );
};

export default PaymentDetailScreen;
