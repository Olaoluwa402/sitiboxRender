import React from "react";
import Layout from "../../components/Layout/Layout";

import styled from "./NotFoundScreen.module.css";
const NotFound = () => (
  <Layout className={styled.notFound}>
    <h1>Sorry. Page Not Found!</h1>
  </Layout>
);

export default NotFound;