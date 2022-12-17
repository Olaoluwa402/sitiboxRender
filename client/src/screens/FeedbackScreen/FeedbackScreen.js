import React from "react";
import { Link } from "react-router-dom";
// import { withStyles, makeStyles } from '@material-ui/core/styles';
// import Grid from '@material-ui/core/Grid';
// import Paper from '@material-ui/core/Paper';
import { HeaderDivider } from "../../components/headerDivider";
import Layout from "../../components/Layout/Layout";

import styled from "./FeedbackScreen.module.css";

// const useStyles = makeStyles((theme) => ({
//   paper: {
//     padding: theme.spacing(2),
//     textAlign: 'center',
//     color: theme.palette.text.secondary,
//   },
// }));

const FeedbackScreen = () => {
  //   const classes = useStyles();

  return (
    <Layout>
      <div className={styled.container}>
        <h2>Hello</h2>
        {/* <Grid container spacing={3}>
			        <Grid item xs={12}>
			          <Paper className={classes.paper}>
			            <h1>FeedBacks</h1>
			            <HeaderDivider />
			            <p>We will greatly appreciate your feedback concerning your experience using our platform and possible suggestions on things we can improve to better serve you. <br/> 
			            	Kindly make use of the feedback forms below. Thanks</p>
			          </Paper>
				<div className={styled.formContainer}>
					<div className={styled.patientForm}> 
						<h4>Clients/Patients</h4>
					  <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSeO0nCwbfXk3E7WUmmaF8ZtiGl3YA2Og9XxDhKiE4Qxueu-fQ/viewform?embedded=true" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>
					</div>
					<div className={styled.doctorForm}>
						<h4>Doctors</h4>
						<iframe src="https://docs.google.com/forms/d/e/1FAIpQLSdcj8EJrJeyxx3X1uaA1R-G3CxZxp9RhHI7ciEsQPb0aR6M7w/viewform?embedded=true" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>
					</div>
				</div>
			        </Grid>
			     </Grid> */}
      </div>
    </Layout>
  );
};

export default FeedbackScreen;
