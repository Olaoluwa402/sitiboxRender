import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import Message from "../../components/Message/Message";
import Spinner from "../../components/Spinner/Spinner";
import { allReferralList } from "../../actions/adminActions";
import { toast } from "react-toastify";

import styled from "./DoctorReferralListScreen.module.css";

const AllPrescriptionsScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const adminLogin = useSelector((state) => state.adminLogin);
  const { adminInfo } = adminLogin;

  const allReferrals = useSelector((state) => state.allReferrals);
  const { loading, error, referrals } = allReferrals;

  // doctor Info will be null if not
  useEffect(() => {
    if (!adminInfo) {
      navigate("/adminlogin");
      toast.warning("Please login!");
    } else {
      dispatch(allReferralList());
    }
  }, [dispatch, navigate, adminInfo]);

  return (
    <React.Fragment>
      <div className={styled.container}>
        <h1>All Referrals</h1>
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
                      <Link to={`/admindashboard/referrals/${referral._id}`}>
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

export default AllPrescriptionsScreen;
