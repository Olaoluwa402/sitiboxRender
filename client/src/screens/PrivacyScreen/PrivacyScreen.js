import React from "react";
// import { withStyles, makeStyles } from "@material-ui/core/styles";
// import Grid from "@material-ui/core/Grid";
// import Paper from "@material-ui/core/Paper";
import { HeaderDivider } from "../../components/headerDivider";
import Layout from "../../components/Layout/Layout";

import styled from "./PrivacyScreen.module.css";

// const useStyles = makeStyles((theme) => ({
// 	paper: {
// 		padding: theme.spacing(2),
// 		textAlign: "center",
// 		color: theme.palette.text.secondary,
// 	},
// }));

const PrivacyScreen = () => {
  // const classes = useStyles();
  return (
    <Layout>
      <div className={styled.container}>
        {/* <Grid container spacing={3}>
					<Grid item xs={12}>
						<Paper className={classes.paper}>
							<h1>Privacy</h1>
							<HeaderDivider />
							<p>Our privacy policy.</p>
						</Paper>
					</Grid>
				</Grid>  */}

        <section className={styled.privacy}>
          <p>
            Sitibox®Health OCR cares about your privacy. As you know, it
            collects some of your information during use of the platform. This
            policy guides the respectful and ethical use of this information by
            Sitibox®Health OCR
          </p>
          <div className={styled.privacyDetail}>
            <h4>Information that Sitibox®Health OCR may collect</h4>
            <p>These include your biodata, clinical data and network data.</p>
          </div>
          <div className={styled.privacyDetail}>
            <h4>Use of your information</h4>
            <p>
              The information collected are solely for the purpose of improving
              your experience on Sitibox®Health OCR website and/or platforms
            </p>
          </div>
          <div className={styled.privacyDetail}>
            <h4>Protection of your information</h4>
            <p>
              Your information will be securely stored on our encrypted server.
            </p>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default PrivacyScreen;
