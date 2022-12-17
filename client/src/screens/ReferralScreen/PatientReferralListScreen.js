import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import Message from "../../components/Message/Message";
import Spinner from "../../components/Spinner/Spinner";
import { patientReferralList } from "../../actions/patientActions";
import { toast } from "react-toastify";

import styled from "./PatientReferralListScreen.module.css";

const PatientReferralListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const patientLogin = useSelector((state) => state.patientLogin);
  const { patientInfo } = patientLogin;

  const patientReferrals = useSelector((state) => state.patientReferrals);
  const { loading, error, referrals } = patientReferrals;

  // doctor Info will be null if not logged in
  useEffect(() => {
    if (!patientInfo) {
      navigate("/login");
      toast.warning("Please login!");
    } else {
      dispatch(patientReferralList());
    }
  }, [dispatch, navigate, patientInfo]);

  return (
    <React.Fragment>
      <div className={styled.container}>
        <h1>My referrals</h1>
        {loading ? (
          <Spinner />
        ) : error ? (
          <Message message="dangerMessage">{error}</Message>
        ) : referrals && referrals.length > 0 ? (
          <div className={styled.tableWrapper}>
            <table className="table-sm">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>DATE</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((referral) => (
                  <tr key={referral._id}>
                    <td>{referral._id}</td>
                    <td>{referral.createdAt.substring(0, 10)}</td>
                    <td>
                      <Link to={`/dashboard/referrals/${referral._id}`}>
                        <button className={styled.btn}>View</button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ marginTop: "2rem" }}>
            <h3>No referrals yet</h3>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default PatientReferralListScreen;
