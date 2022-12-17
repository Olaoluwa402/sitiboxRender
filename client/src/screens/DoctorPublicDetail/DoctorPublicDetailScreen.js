import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message/Message";
import Spinner from "../../components/Spinner/Spinner";
import Rating from "../../components/Rating";
import { BiCheckShield } from "react-icons/bi";
import { FaTimes } from "react-icons/fa";
import Layout from "../../components/Layout/Layout";
import { useParams } from "react-router-dom";
import { listDoctorDetails } from "../../actions/doctorActions";

import styled from "./DoctorPublicDetailScreen.module.css";

const DoctorPublicDetailScreen = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const doctorDetails = useSelector((state) => state.doctorDetails);
  const { loading, error, doctor } = doctorDetails;

  useEffect(() => {
    if (!doctor || (doctor && doctor._id !== id)) {
      dispatch(listDoctorDetails(id));
    }
  }, [dispatch, id, doctor]);

  return (
    <Layout>
      <React.Fragment>
        {loading ? (
          <Spinner />
        ) : error ? (
          <Message message="dangerMessage">{error}</Message>
        ) : doctor ? (
          <React.Fragment>
            <div className={styled.wrapper}>
              <div className={styled.left}>
                <img src={doctor.image} alt="doctor" width="300" />
                <h4 style={{ textTransform: "capitalize" }}>
                  Dr {doctor.firstName}
                </h4>
                <p>{doctor.specialty}</p>
              </div>
              <div className={styled.right}>
                <h2 style={{ textTransform: "capitalize" }}>
                  Dr {doctor.firstName + " " + doctor.lastName}
                </h2>
                <div className={styled.info}>
                  <h3>Information</h3>
                  <div className="info_data">
                    <div className={styled.data}>
                      <h4>Bio</h4>
                      <p>{doctor.biodata ? doctor.biodata : null}</p>
                    </div>
                    <div className="info_data">
                      <div className={styled.data}>
                        <h4>Verified</h4>
                        <p>
                          {doctor.doctorIsVerified ? (
                            <BiCheckShield style={{ color: "green" }} />
                          ) : (
                            <FaTimes style={{ color: "red" }} />
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styled.projects}>
                  <h3>Extra Details</h3>
                  <div className={styled.projectsData}>
                    <div className={styled.data}>
                      <h4>Ratings</h4>
                      <p>
                        <Rating
                          value={doctor.rating}
                          text={`${doctor.numReviews} reviews`}
                        />
                      </p>
                    </div>
                    <div className={styled.data}>
                      <h4>Reviews</h4>
                      <p>
                        <Link
                          to="/docdashboard/docProfile"
                          style={{ textDecoration: "none" }}
                        >
                          Patients Reviews.
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </React.Fragment>
        ) : null}
      </React.Fragment>
    </Layout>
  );
};

export default DoctorPublicDetailScreen;
