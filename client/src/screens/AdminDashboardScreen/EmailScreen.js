import React, { useState, useEffect } from "react";
import Message from "../../components/Message/Message";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../components/Spinner/Spinner";
import { sendMailToAllAction } from "../../actions/adminActions";

import { clearErrors } from "../../actions/adminActions";
import selectOption from "../../components/selectOption";

import styles from "./EmailScreen.module.css";

const EmailScreen = () => {
  const { mailOptions } = selectOption();
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [option, setOption] = useState("");

  const dispatch = useDispatch();

  const sendMailToAll = useSelector((state) => state.sendMailToAll);
  const { loading, error } = sendMailToAll;

  // userInfo will be null if not logged in
  useEffect(() => {
    if (error) {
      setTimeout(() => {
        dispatch(clearErrors());
      }, 5000);
    }
  }, [dispatch, error]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!message || !subject || !option) {
      return;
    }

    const dataOption = {
      message,
      subject,
      option,
    };

    dispatch(sendMailToAllAction(dataOption));
    setMessage("");
    setOption("");
    setSubject("");
  };

  return (
    <React.Fragment>
      <div className={styles.screenWrapper}>
        <div className={styles.formWrapper}>
          <form className={styles.form} onSubmit={submitHandler}>
            <div className={styles.formControl}>
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                placeholder="Enter your subject"
                value={subject}
                autoFocus
                onChange={(e) => setSubject(e.target.value)}
              ></input>
            </div>

            <div className={styles.formControl}>
              <label htmlFor="option">To Patients or Doctors</label>
              <select
                name="option"
                value={option}
                onChange={(e) => setOption(e.target.value)}
              >
                {mailOptions.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formControl}>
              <label htmlFor="message">Message</label>
              <textarea
                type="text"
                id="message"
                name="message"
                value={message}
                cols="30"
                rows="10"
                onChange={(e) => setMessage(e.target.value)}
              >
                Message
              </textarea>
            </div>

            {error && <Message message="dangerMessage">{error}</Message>}

            <div className={styles.formActions}>
              {loading ? <Spinner /> : <button type="submit">Send</button>}
            </div>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
};

export default EmailScreen;
