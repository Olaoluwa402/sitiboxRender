import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// import Rating from "../../components/Rating";
import Message from "../../components/Message/Message";
import Spinner from "../../components/Spinner/Spinner";
import { useParams } from "react-router-dom";
import styled from "./ReviewScreen.module.css";
import { createDoctorReview } from "../../actions/orderActions";
// import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants';

const ReviewScreen = () => {
  const { id } = useParams();
  const doctId = id;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const dispatch = useDispatch();

  const patientLogin = useSelector((state) => state.patientLogin);
  const { patientInfo } = patientLogin;

  const doctorReviewCreate = useSelector((state) => state.doctorReviewCreate);
  const {
    success: successDoctorReview,
    loading: loadingDoctorReview,
    error: errorDoctorReview,
  } = doctorReviewCreate;

  useEffect(() => {
    if (successDoctorReview) {
      setRating(0);
      setComment("");
    }
  }, [dispatch, successDoctorReview]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      createDoctorReview(doctId, {
        rating,
        comment,
      })
    );
  };

  return (
    <React.Fragment>
      <div className={styled.reviewContainer}>
        <h2>Write a Review</h2>
        {successDoctorReview && (
          <Message message="defaultMessage">
            Review submitted successfully
          </Message>
        )}
        {loadingDoctorReview && <Spinner />}
        {errorDoctorReview && (
          <Message message="dangerMessage">{errorDoctorReview}</Message>
        )}
        {patientInfo ? (
          <form onSubmit={submitHandler} className={styled.formWrapper}>
            <div className={styled.formControl}>
              <label htmlFor="rating">Rating</label>
              <select
                name="rating"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              >
                <option value="">Select...</option>
                <option value="1">1 - Poor</option>
                <option value="2">2 - Fair</option>
                <option value="3">3 - Good</option>
                <option value="4">4 - Very Good</option>
                <option value="5">5 - Excellent</option>
              </select>
            </div>

            <div className={styled.formControl}>
              <label htmlFor="comment">Comment</label>
              <textarea
                type="text"
                id="comment"
                name="comment"
                value={comment}
                cols="30"
                rows="10"
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </div>

            <button disabled={loadingDoctorReview} type="submit">
              Submit
            </button>
          </form>
        ) : (
          <Message>
            Please <Link to="/login">sign in</Link> to write a review{" "}
          </Message>
        )}
      </div>
    </React.Fragment>
  );
};

export default ReviewScreen;
