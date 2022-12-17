import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

import Message from "../../components/Message/Message";
import Spinner from "../../components/Spinner/Spinner";
import { getConsultationSummaryPerChat } from "../../actions/doctorActions";
import { toast } from "react-toastify";

import styled from "./ConsultationSummaryListScreen.module.css";

const ConsultationSummaryListScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const patientsummaryId = id;
  const dispatch = useDispatch();

  const doctorLogin = useSelector((state) => state.doctorLogin);
  const { doctorInfo } = doctorLogin;

  const chatConsultationSummaries = useSelector(
    (state) => state.chatConsultationSummaries
  );
  const { loading, error, summaries } = chatConsultationSummaries;

  // doctor Info will be null if not logged in
  useEffect(() => {
    if (!doctorInfo) {
      navigate("/doclogin");
      toast.warning("Please login!");
    } else {
      if (patientsummaryId) {
        dispatch(getConsultationSummaryPerChat({ patientsummaryId }));
      }
    }
  }, [dispatch, navigate, doctorInfo, patientsummaryId]);

  return (
    <React.Fragment>
      <div className={styled.container}>
        <h1>Consultation summaries</h1>
        <Link to="/docdashboard/chatroom">Chatroom</Link>
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
                      <Link to={`/docdashboard/summaries/${summary._id}`}>
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
