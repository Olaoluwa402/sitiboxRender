import React, { useState, useEffect } from "react";
import Message from "../../components/Message/Message";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../components/Spinner/Spinner";
import { sendSmsToAllAction } from "../../actions/adminActions";
import { clearErrors } from "../../actions/adminActions";
import selectOption from "../../components/selectOption";

import styles from "./EmailScreen.module.css";

const SmsScreen = () => {
  const { mailOptions } = selectOption();
  const [message, setMessage] = useState("");
  const [option, setOption] = useState("");
  const [title, setTitle] = useState("");

  const dispatch = useDispatch();

  const sendSmsToAll = useSelector((state) => state.sendSmsToAll);
  const { loading, error } = sendSmsToAll;

  // userInfo will be null if not logged in
  useEffect(() => {
    // if(id){setId(id)}
    if (error) {
      setTimeout(() => {
        dispatch(clearErrors());
      }, 5000);
    }
  }, [dispatch, error]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!message || !title || !option) {
      return;
    }

    const dataOption = {
      message,
      title,
      option,
    };

    dispatch(sendSmsToAllAction(dataOption));
    setMessage("");
    setTitle("");
    setOption("");
  };

  return (
    <React.Fragment>
      <div className={styles.screenWrapper}>
        <div className={styles.formWrapper}>
          <form className={styles.form} onSubmit={submitHandler}>
            <div className={styles.formControl}>
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Enter your title"
                value={title}
                autoFocus
                onChange={(e) => setTitle(e.target.value)}
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

export default SmsScreen;
