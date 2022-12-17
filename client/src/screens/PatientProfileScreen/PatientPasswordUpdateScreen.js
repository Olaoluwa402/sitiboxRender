import React, { useState, useEffect } from "react";
import Message from "../../components/Message/Message";
import Spinner from "../../components/Spinner/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { changePasswordAction, logout } from "../../actions/patientActions";
import { CHANGE_PASSWORD_RESET } from "../../constants/patientConstants";
import { useNavigate } from "react-router-dom";
import styles from "./PatientPasswordUpdateScreen.module.css";

const PatientPasswordUpdateScreen = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();

  const patientLogin = useSelector((state) => state.patientLogin);
  const { patientInfo } = patientLogin;

  const patientUpdatePassword = useSelector(
    (state) => state.patientUpdatePassword
  );
  const { loading, error, success } = patientUpdatePassword;

  useEffect(() => {
    if (!patientInfo) {
      navigate("/login");
    }

    if (success) {
      dispatch({ type: CHANGE_PASSWORD_RESET });
      dispatch(logout());
      navigate("/login");
    }
  }, [dispatch, navigate, patientInfo, success]);

  // validate form
  const validate = ({ password, confirmPassword }) => {
    let errors = {};
    // password
    if (![password]) {
      errors.password = "Password is required";
    } else if ([password].length < 6) {
      errors.password = "Password needs to be 6 characters or more";
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  const submitHandler = (e) => {
    e.preventDefault();
    // set errors
    setErrors(validate({ password, confirmPassword }));

    const myData = {
      password: password,
    };

    if (password === confirmPassword) {
      console.log(myData);
      // Dispatch
      dispatch(changePasswordAction({ myData }));
    } else {
      return;
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.formWrapper}>
          <form onSubmit={submitHandler} className={styles.form}>
            <div className={styles.formControl}>
              {errors.password && <p>{errors.password}</p>}
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter New password"
                autoComplete="false"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></input>
            </div>
            <div className={styles.formControl}>
              {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
              <label htmlFor="password">Confirm password</label>
              <input
                type="password"
                id="password"
                name="confirmPassword"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              ></input>
            </div>

            {loading && <Spinner />}
            {error && <Message message="dangerMessage">{error}</Message>}

            <div className={styles.formActions}>
              <button type="submit">UPDATE</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PatientPasswordUpdateScreen;
