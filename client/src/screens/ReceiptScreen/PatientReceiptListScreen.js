import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import Message from "../../components/Message/Message";
import Spinner from "../../components/Spinner/Spinner";
import { patientReceiptList } from "../../actions/patientActions";
import { toast } from "react-toastify";

import styled from "./PatientReceiptListScreen.module.css";

const PatientReceiptListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const patientLogin = useSelector((state) => state.patientLogin);
  const { patientInfo } = patientLogin;

  const myreceiptList = useSelector((state) => state.myreceiptList);
  const { loading, error, receipts } = myreceiptList;

  // doctor Info will be null if not logged in
  useEffect(() => {
    if (!patientInfo) {
      navigate("/login");
      toast.warning("Please login!");
    } else {
      dispatch(patientReceiptList());
    }
  }, [dispatch, navigate, patientInfo]);

  return (
    <React.Fragment>
      <div className={styled.container}>
        <h1>My Receipts</h1>
        {loading ? (
          <Spinner />
        ) : error ? (
          <Message message="dangerMessage">{error}</Message>
        ) : receipts && receipts.length > 0 ? (
          <div className={styled.tableWrapper}>
            <table className="table-sm">
              <thead>
                <tr>
                  <th>REFERENCE</th>
                  <th>DATE</th>
                  <th>DESCRIPTION</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {receipts.map((receipt) => (
                  <tr key={receipt._id}>
                    <td>{receipt.reference}</td>
                    <td>{receipt.createdAt.substring(0, 10)}</td>
                    <td>
                      {receipt.method}- ({receipt.card_type}{" "}
                      {receipt.last4Digit})
                    </td>
                    <td>
                      <Link to={`/dashboard/receipt/${receipt._id}`}>
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
            <h3>No receipt yet</h3>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default PatientReceiptListScreen;
