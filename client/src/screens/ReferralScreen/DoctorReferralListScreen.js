import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Message from "../../components/Message/Message";
import Spinner from "../../components/Spinner/Spinner";
import { doctorReferralList } from "../../actions/doctorActions";
import { toast } from "react-toastify";

import styled from "./DoctorReferralListScreen.module.css";

const DoctorReferralListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const doctorLogin = useSelector((state) => state.doctorLogin);
  const { doctorInfo } = doctorLogin;

  const docReferralList = useSelector((state) => state.docReferralList);
  const { loading, error, referrals } = docReferralList;

  // doctor Info will be null if not logged in
  useEffect(() => {
    if (!doctorInfo) {
      navigate("/doclogin");
      toast.warning("Please login!");
    } else {
      dispatch(doctorReferralList());
    }
  }, [dispatch, navigate, doctorInfo]);

  // capitalize
  function capitalizeFirstLetter(string) {
    if (string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  }

  return (
    <React.Fragment>
      <div className={styled.container}>
        <h1>Referrals</h1>
        {loading ? (
          <Spinner />
        ) : error ? (
          <Message message="dangerMessage">{error}</Message>
        ) : referrals && referrals.length > 0 ? (
          <div className={styled.tableWrapper}>
            <table className="table-sm">
              <thead>
                <tr>
                  <th>DATE</th>
                  <th>NAME</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((referral) => (
                  <tr key={referral._id}>
                    <td>{referral.createdAt.substring(0, 10)}</td>
                    <td>
                      {capitalizeFirstLetter(referral.patient.firstName)}{" "}
                      {capitalizeFirstLetter(referral.patient.lastName)}
                    </td>
                    <td>
                      <Link to={`/docdashboard/referrals/${referral._id}`}>
                        <button className={styled.btn}>View</button>
                      </Link>
                    </td>
                    <td>
                      <Link to={`/docdashboard/referrals/${referral._id}/edit`}>
                        <button className={styled.btn}>Edit</button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ marginTop: "2rem" }}>No referrals yet</div>
        )}
      </div>
    </React.Fragment>
  );
};

export default DoctorReferralListScreen;
