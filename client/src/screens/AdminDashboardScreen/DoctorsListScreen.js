import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { BiCheckShield } from "react-icons/bi";

import Message from "../../components/Message/Message";
import Spinner from "../../components/Spinner/Spinner";
import { getDoctorsList, adminDeleteDoctor } from "../../actions/adminActions";
import { DOCTOR_DELETE_RESET } from "../../constants/adminConstants";
import { toast } from "react-toastify";

import styled from "./DoctorsListScreen.module.css";

const DoctorsListScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const adminLogin = useSelector((state) => state.adminLogin);
  const { adminInfo } = adminLogin;

  const allDoctors = useSelector((state) => state.allDoctors);
  const { loading, error, doctors } = allDoctors;

  const doctorDelete = useSelector((state) => state.doctorDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = doctorDelete;

  // doctor Info will be null if not logged in
  useEffect(() => {
    if (!adminInfo) {
      navigate("/adminlogin");
      toast.warning("Admins only!");
    } else {
      if (successDelete) {
        dispatch({ type: DOCTOR_DELETE_RESET });
        dispatch(getDoctorsList());
        toast.success("Successfully Deleted");
      } else {
        dispatch(getDoctorsList());
      }
    }
  }, [dispatch, navigate, adminInfo, successDelete]);

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure?")) {
      dispatch(adminDeleteDoctor(id));
    }
  };

  return (
    <React.Fragment>
      <div className={styled.container}>
        <h1>All Doctors</h1>
        {loadingDelete && <Spinner />}
        {errorDelete && (
          <Message message="dangerMessage">{errorDelete}</Message>
        )}
        {loading ? (
          <Spinner />
        ) : error ? (
          <Message message="dangerMessage">{error}</Message>
        ) : doctors && doctors.length > 0 ? (
          <div className={styled.tableWrapper}>
            <table className="table-sm">
              <thead>
                <tr>
                  <th>REG DATE</th>
                  <th>Name</th>
                  <th>Verified</th>
                  <th>Reviews</th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doctor) => (
                  <tr key={doctor._id}>
                    <td>{doctor.createdAt.substring(0, 10)}</td>
                    <td>
                      {doctor.firstName} {doctor.lastName}
                    </td>
                    <td>
                      {doctor.doctorIsVerified ? (
                        <BiCheckShield style={{ color: "green" }} />
                      ) : (
                        <FaTimes style={{ color: "red" }} />
                      )}
                    </td>
                    <td>
                      <Link
                        to={`/admindashboard/doctors/${doctor._id}/reviews`}
                      >
                        <button className={styled.btn}>
                          <span className={styled.reviews}>
                            {doctor.reviews.length}
                          </span>{" "}
                          Reviews
                        </button>
                      </Link>
                    </td>
                    <td>
                      <Link to={`/admindashboard/doctors/${doctor._id}`}>
                        <button className={styled.btn}>Details</button>
                      </Link>
                    </td>
                    {/* <td>
                                            <Link
                                                to={`/admindashboard/email/${doctor._id}`}
                                            >
                                                <button className={styled.btn}>
                                                    Email
                                                </button>
                                            </Link>
                                        </td>
                                        
                                        <td>
                                            <Link
                                                to={`/admindashboard/sms/${doctor._id}`}
                                            >
                                                <button className={styled.btn}>
                                                    Sms
                                                </button>
                                            </Link>
                                        </td> */}

                    <td>
                      <button
                        className={styled.btn}
                        onClick={() => deleteHandler(doctor._id)}
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
            <h3>No data yet</h3>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default DoctorsListScreen;
