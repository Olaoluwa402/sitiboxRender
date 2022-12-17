import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import jsPDF from "jspdf";
import Logo from "../../img/SitiboxLOGO-min.png";

import Message from "../../components/Message/Message";
import Spinner from "../../components/Spinner/Spinner";
import { receiptDetail } from "../../actions/patientActions";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

import styled from "./ReceiptScreen.module.css";

const ReceiptScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const receiptId = id;

  const patientLogin = useSelector((state) => state.patientLogin);
  const { patientInfo } = patientLogin;

  const adminLogin = useSelector((state) => state.adminLogin);
  const { adminInfo } = adminLogin;

  const myreceiptDetail = useSelector((state) => state.myreceiptDetail);
  const { loading, error, receipt } = myreceiptDetail;

  // doctor Info will be null if not logged in
  useEffect(() => {
    if (!patientInfo && !adminInfo) {
      navigate("/");
      toast.warning("Please login!");
    }

    if (receiptId) {
      dispatch(receiptDetail({ receiptId }));
    }
  }, [dispatch, navigate, patientInfo, adminInfo, receiptId]);

  const generatePdf = () => {
    let doc = new jsPDF("p", "pt", "a4");
    doc.html(document.querySelector("#invoice"), {
      callback: function (pdf) {
        // const pageCount = doc.internal.getNumberOfPages();
        // pdf.deletePage(pageCount);
        pdf.save("invoice.pdf");
      },
    });
  };

  const today = new Date();

  return (
    <React.Fragment>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem",
        }}
      >
        <h2>Your Receipt</h2>
      </div>

      {loading ? (
        <Spinner />
      ) : error ? (
        <Message message="dangerMessage">{error}</Message>
      ) : receipt ? (
        <React.Fragment>
          <div className={styled.download}>
            <button onClick={generatePdf} type="primary">
              download pdf
            </button>
          </div>
          <div className={styled.invoiceBox} id="invoice">
            <table cellPadding="0" cellSpacing="0">
              <tr className={styled.top}>
                <td colSpan="2">
                  <table>
                    <tr>
                      <td className={styled.title}>
                        <img
                          src={Logo}
                          alt="sitibox_logo"
                          style={{ width: "100%", maxWidth: "156px" }}
                        />
                      </td>
                      <td>
                        Date:{" "}
                        {`${today.getDate()} / ${
                          today.getMonth() + 1
                        } / ${today.getFullYear()}`}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr className={styled.information}>
                <td colSpan="2">
                  <table>
                    <tr>
                      <td style={{ textTransform: "capitalize" }}>
                        Customer name: {receipt.patient.clinicName}
                      </td>
                      <td>Receipt No: {receipt.receiptNo}</td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr className={styled.heading}>
                <td>Consultation Detail</td>
                <td>Charge</td>
              </tr>
              <tr className={styled.item}>
                <td>
                  <h4>Regular: ₦1000 (₦334/day)</h4>
                  <h6>Duration: 3days</h6>
                  <p>Clinical consultation fee - ₦200</p>
                  <p>Convenience fee - ₦100</p>
                  <p>Quality Assurance fee - ₦34</p>
                </td>

                <h4>Promo: ₦200</h4>

                <td>{receipt.amount}</td>
              </tr>
            </table>
            <br />
            <h1 className={styled.justifyCenter}>
              Total Charge: {receipt.amount}
            </h1>
          </div>
        </React.Fragment>
      ) : null}
    </React.Fragment>
  );
};

export default ReceiptScreen;
