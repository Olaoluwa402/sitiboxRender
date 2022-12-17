import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

import Message from "../../components/Message/Message";
import Spinner from "../../components/Spinner/Spinner";
import { allReceiptsList } from "../../actions/adminActions";

import styled from "./PatientReceiptListScreen.module.css";

const AllReceiptsScreen = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const adminLogin = useSelector((state) => state.adminLogin);
  const { adminInfo } = adminLogin;

  const allReceipts = useSelector((state) => state.allReceipts);
  const { loading, error, receipts } = allReceipts;

  // doctor Info will be null if not logged in
  useEffect(() => {
    if (!adminInfo) {
      navigate("/adminlogin");
      toast.warning("Please login!");
    } else {
      dispatch(allReceiptsList());
    }
  }, [dispatch, navigate, adminInfo]);

  return (
    <React.Fragment>
      <div className={styled.container}>
        <h1>All Receipts</h1>
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
                      <Link to={`/admindashboard/receipt/${receipt._id}`}>
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

export default AllReceiptsScreen;
