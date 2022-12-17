import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaTimes } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { BiCheckShield } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";
import Message from "../../components/Message/Message";
import Spinner from "../../components/Spinner/Spinner";
import {
  getReviewList,
  adminDeleteReview,
  adminApproveReview,
} from "../../actions/adminActions";
// import { DOCTOR_DELETE_RESET } from "../../constants/adminConstants";
import { toast } from "react-toastify";

import styled from "./ReviewListScreen.module.css";

const ReviewListScreen = () => {
  const navigate = useNavigate();

  // get id from match params
  const { id } = useParams();
  const doctorId = id;

  const dispatch = useDispatch();

  const adminLogin = useSelector((state) => state.adminLogin);
  const { adminInfo } = adminLogin;

  const reviewList = useSelector((state) => state.reviewList);
  const { loading, error, reviews } = reviewList;

  //  const doctorDelete = useSelector((state) => state.doctorDelete);
  // const { loading:loadingDelete, error:errorDelete, success:successDelete } = doctorDelete;

  // doctor Info will be null if not logged in
  useEffect(() => {
    if (!adminInfo) {
      navigate("/adminlogin");
      toast.warning("Admins only!");
    } else {
      if (doctorId) {
        dispatch(getReviewList({ doctorId }));
      }
    }
  }, [dispatch, navigate, adminInfo, doctorId]);

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure?")) {
      dispatch(adminDeleteReview(id));
    }
  };

  const approveHandler = (id) => {
    dispatch(adminApproveReview(id));
  };

  return (
    <React.Fragment>
      <div className={styled.container}>
        <h1>All Reviews</h1>
        {loading ? (
          <Spinner />
        ) : error ? (
          <Message message="dangerMessage">{error}</Message>
        ) : reviews && reviews.length > 0 ? (
          <div className={styled.tableWrapper}>
            <table className="table-sm">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Comment</th>
                  <th>Approved</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review._id}>
                    <td>{review._id}</td>
                    <td>{review.name}</td>
                    <td>{review.comment}</td>
                    <td>
                      {review.isApproved ? (
                        <BiCheckShield style={{ color: "green" }} />
                      ) : (
                        <FaTimes style={{ color: "red" }} />
                      )}
                    </td>
                    <td>
                      <button
                        className={styled.btn}
                        onClick={() => approveHandler(review._id)}
                      >
                        Approve
                      </button>
                    </td>
                    <td>
                      <button
                        className={styled.btn}
                        onClick={() => deleteHandler(review._id)}
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
          <div className={styled.noReviews}>
            <h4>No reviews yet</h4>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default ReviewListScreen;
