import React, { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useSelector, useDispatch } from "react-redux";
import Message from "../../../components/Message/Message";
import Spinner from "../../../components/Spinner/Spinner";
import { FaTrash } from "react-icons/fa";
import { MdContentCopy } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  generatePromoCode,
  getPromoCodes,
  deletePromoCode,
} from "../../../actions/adminActions";
import {
  GENERATE_PROMOCODE_RESET,
  DELETE_PROMOCODE_RESET,
} from "../../../constants/adminConstants";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import styled from "./PromoCodeScreen.module.css";

// extend dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const PromoCodeScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [uniqueCode, setUniqueCode] = useState("");

  const adminLogin = useSelector((state) => state.adminLogin);
  const { adminInfo } = adminLogin;

  const newpromocode = useSelector((state) => state.newpromocode);
  const { loading, error, promocode } = newpromocode;

  const procodeList = useSelector((state) => state.procodeList);
  const {
    loading: loadingCodeList,
    error: errorPromoCodeList,
    promocodes,
  } = procodeList;

  const promocodeDelete = useSelector((state) => state.promocodeDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = promocodeDelete;

  useEffect(() => {
    if (!adminInfo) {
      navigate("/");
    }

    if (promocode || successDelete) {
      dispatch({ type: GENERATE_PROMOCODE_RESET });
      dispatch({ type: DELETE_PROMOCODE_RESET });
      dispatch(getPromoCodes());
    } else {
      dispatch(getPromoCodes());
    }
  }, [dispatch, navigate, adminInfo, promocode, successDelete]);

  const generateCodeHandler = ({ uniqueCode }) => {
    if (!uniqueCode) {
      return;
    }

    dispatch(generatePromoCode({ uniqueCode }));

    setUniqueCode("");
  };

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deletePromoCode(id));
    }
  };

  const dt = new Date();
  const date = dayjs.utc(dt, "z").add(1, "hour").tz("Africa/Lagos").format();
  // modifiedDate = new Date(date).toISOString();
  const modifiedDate = new Date(date).toISOString();

  return (
    <React.Fragment>
      <div className={styled.container}>
        <div className={styled.gencode}>
          <input
            type="text"
            value={uniqueCode}
            placeholder="enter unique code"
            onChange={(e) => setUniqueCode(e.target.value)}
          />
          <button
            className={styled.btn}
            onClick={() => generateCodeHandler({ uniqueCode })}
          >
            Generate Promo Code
          </button>
          {loading && <Spinner />}
          {error && <Message message="dangerMessage">{error}</Message>}
        </div>

        {errorDelete && (
          <Message message="dangerMessage">{errorDelete}</Message>
        )}
        {loadingDelete && <Spinner />}

        {loadingCodeList ? (
          <Spinner />
        ) : errorPromoCodeList ? (
          <Message message="dangerMessage">{errorPromoCodeList}</Message>
        ) : promocodes && promocodes.length > 0 ? (
          <div className={styled.tableWrapper}>
            <table className="table-sm">
              <thead>
                <tr>
                  <th>GEN DATE</th>
                  <th>CODE</th>
                  <th></th>
                  <th>STATUS</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {promocodes.map((code) => (
                  <tr key={code._id}>
                    <td>{code.createdAt.substring(0, 10)}</td>
                    <td>{code.promoCode}</td>
                    <td>
                      <CopyToClipboard
                        text={code.promoCode}
                        style={{ cursor: "pointer" }}
                      >
                        <MdContentCopy
                          onClick={() =>
                            toast(`Copied`, {
                              position: "top-center",
                              autoClose: 5000,
                              hideProgressBar: false,
                              closeOnClick: true,
                              pauseOnHover: true,
                              draggable: true,
                              type: "success",
                            })
                          }
                          title="copy to clipboard"
                        />
                      </CopyToClipboard>
                    </td>
                    <td>
                      {modifiedDate > code.expirePromoCode ? (
                        <span style={{ color: "red" }}>expired</span>
                      ) : (
                        <span style={{ color: "green" }}>active</span>
                      )}
                    </td>

                    <td>
                      <button
                        className={styled.btn}
                        onClick={() => deleteHandler(code._id)}
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
          <div style={{ marginTop: "2rem" }}>
            <h3>No promocode yet</h3>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default PromoCodeScreen;
