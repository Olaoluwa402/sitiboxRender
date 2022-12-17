import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import Message from "../../components/Message/Message";
import Spinner from "../../components/Spinner/Spinner";
import { consultationSummaryList } from "../../actions/doctorActions";
import { toast } from "react-toastify";

import styled from "./ConsultationSummaryListScreen.module.css";

const ConsultationSummaryListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const doctorLogin = useSelector((state) => state.doctorLogin);
  const { doctorInfo } = doctorLogin;

  const listConsultationSummary = useSelector(
    (state) => state.listConsultationSummary
  );
  const { loading, error, summaries } = listConsultationSummary;

  // doctor Info will be null if not logged in
  useEffect(() => {
    if (!doctorInfo) {
      navigate("/doclogin");
      toast.warning("Please login!");
    } else {
      dispatch(consultationSummaryList());
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
        <h1>Client Case Files</h1>
        {loading ? (
          <Spinner />
        ) : error ? (
          <Message message="dangerMessage">{error}</Message>
        ) : summaries && summaries.length > 0 ? (
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
                {summaries.map((summary) => (
                  <tr key={summary._id}>
                    <td>{summary.createdAt.substring(0, 10)}</td>
                    <td>
                      {capitalizeFirstLetter(summary.patient.firstName)}{" "}
                      {capitalizeFirstLetter(summary.patient.lastName)}
                    </td>
                    <td>
                      <Link to={`/docdashboard/summaries/${summary._id}`}>
                        <button className={styled.btn}>View</button>
                      </Link>
                    </td>
                    <td>
                      <Link to={`/docdashboard/summaries/${summary._id}/edit`}>
                        <button className={styled.btn}>Edit</button>
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
