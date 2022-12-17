import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import Message from "../../../components/Message/Message";
import Spinner from "../../../components/Spinner/Spinner";
import { consultationSummaryList } from "../../../actions/adminActions";
import { toast } from "react-toastify";

import styled from "./ConsultationSummaryListScreen.module.css";

const ConsultationSummaryListScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const adminLogin = useSelector((state) => state.adminLogin);
  const { adminInfo } = adminLogin;

  const consultationSummaryListAdmin = useSelector(
    (state) => state.consultationSummaryListAdmin
  );
  const { loading, error, summaries } = consultationSummaryListAdmin;

  // doctor Info will be null if not logged in
  useEffect(() => {
    if (!adminInfo) {
      navigate("/adminlogin");
      toast.warning("Please login!");
    } else {
      dispatch(consultationSummaryList());
    }
  }, [dispatch, navigate, adminInfo]);

  return (
    <React.Fragment>
      <div className={styled.container}>
        <h1>Consultation summaries</h1>
        {loading ? (
          <Spinner />
        ) : error ? (
          <Message message="dangerMessage">{error}</Message>
        ) : summaries && summaries.length > 0 ? (
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
                {summaries.map((summary) => (
                  <tr key={summary._id}>
                    <td>{summary._id}</td>
                    <td>{summary.createdAt.substring(0, 10)}</td>
                    <td>
                      <Link to={`/admindashboard/summaries/${summary._id}`}>
                        <button className={styled.btn}>View</button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div
            style={{
              height: "50vh",
              display: "grid",
            }}
          >
            <h4
              style={{
                margin: "auto",
              }}
            >
              No summary created yet!
            </h4>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default ConsultationSummaryListScreen;
