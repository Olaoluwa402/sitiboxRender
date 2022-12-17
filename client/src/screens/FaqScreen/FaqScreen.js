import React from "react";
// import { withStyles, makeStyles } from "@material-ui/core/styles";
// import Grid from "@material-ui/core/Grid";
// import Paper from "@material-ui/core/Paper";
// import MuiAccordion from "@material-ui/core/Accordion";
// import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
// import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
// import Typography from "@material-ui/core/Typography";
import { HeaderDivider } from "../../components/headerDivider";
import Layout from "../../components/Layout/Layout";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     flexGrow: 1,
//   },
//   paper: {
//     padding: theme.spacing(2),
//     textAlign: "center",
//     color: theme.palette.text.secondary,
//   },
// }));

// const Accordion = withStyles({
//   root: {
//     border: "1px solid rgba(0, 0, 0, .125)",
//     boxShadow: "none",
//     "&:not(:last-child)": {
//       borderBottom: 0,
//     },
//     "&:before": {
//       display: "none",
//     },
//     "&$expanded": {
//       margin: "auto",
//     },
//   },
//   expanded: {},
// })(MuiAccordion);

// const AccordionSummary = withStyles({
//   root: {
//     backgroundColor: "rgba(0, 0, 0, .03)",
//     borderBottom: "1px solid rgba(0, 0, 0, .125)",
//     marginBottom: -1,
//     minHeight: 56,
//     "&$expanded": {
//       minHeight: 56,
//     },
//   },
//   content: {
//     "&$expanded": {
//       margin: "12px 0",
//     },
//   },
//   expanded: {},
// })(MuiAccordionSummary);

// const AccordionDetails = withStyles((theme) => ({
//   root: {
//     padding: theme.spacing(2),
//   },
// }))(MuiAccordionDetails);

export default function CustomizedAccordions() {
  // const classes = useStyles();

  const [expanded, setExpanded] = React.useState("");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <Layout>
      <div className="" mt={5}>
        {/* <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <h1>FAQ</h1>
            <HeaderDivider />
            <p>
              Have questions? checkout some of the useful and frequently asked questions below.
            </p>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className={classes.paper}>
            <div>
              <Accordion
                square
                expanded={expanded === "panel1"}
                onChange={handleChange("panel1")}
                textAlign="left"
              >
                <AccordionSummary
                  aria-controls="panel1d-content"
                  id="panel1d-header"
                  textAlign="left"
                >
                  <Typography textAlign="left">What is Sitibox®Health OCR?</Typography>
                </AccordionSummary>
                <AccordionDetails textAlign="left">
                  <Typography textAlign="left">
                    Sitibox® online consultation room (OCR) is an online
                    platform that gives you access to quick, cost effective and
                    efficient healthcare services and resources by linking you
                    up with verified and qualified medical professionals. These
                    medical professionals will obtain information about your
                    medical condition and provide guidance and resources
                    (including appropriate drug prescriptions, laboratory test
                    results, referral and health advice) based on their
                    assessments
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion
                square
                expanded={expanded === "panel2"}
                onChange={handleChange("panel2")}
                textAlign="left"
              >
                <AccordionSummary
                  aria-controls="panel2d-content"
                  id="panel2d-header"
                  textAlign="left"
                >
                  <Typography textAlign="left">
                    What is the scope of service on Sitibox®Health OCR?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails textAlign="left">
                  <Typography textAlign="left">
                    Sitibox® health is expected to provide a platform for
                    attending to medical cases that are non - emergent or life
                    threatening in nature. It is advised that acute emergencies
                    should approach the nearest hospital rather than seek remote
                    access on sitibox®. Once stable, can come back on sitibox
                    health for follow up.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion
                square
                expanded={expanded === "panel3"}
                onChange={handleChange("panel3")}
                textAlign="left"
              >
                <AccordionSummary
                  aria-controls="panel3d-content"
                  id="panel3d-header"
                  textAlign="left"
                >
                  <Typography textAlign="left">
                    Can I use Sitibox®Health OCR to request consultation for
                    another person?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails textAlign="left">
                  <Typography textAlign="left">
                    Absolutely yes. However, the consulting online medical
                    doctor should be made aware of this. The biodata on the
                    complaint page should also be that of the person you are
                    complaining for.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </div>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className={classes.paper}>
            <div>
              <Accordion
                square
                expanded={expanded === "panel4"}
                onChange={handleChange("panel4")}
                textAlign="left"
              >
                <AccordionSummary
                  aria-controls="panel1d-content"
                  id="panel1d-header"
                  textAlign="left"
                >
                  <Typography textAlign="left">
                    How many languages does at Sitibox®Health OCR support?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails textAlign="left">
                  <Typography textAlign="left">
                    The platform supports only English language. Those who can’t
                    read English can use the assistance of another trusted
                    person who does. However, your access password should not be
                    revealed to such 3rd party.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion
                square
                expanded={expanded === "panel5"}
                onChange={handleChange("panel5")}
                textAlign="left"
              >
                <AccordionSummary
                  aria-controls="panel2d-content"
                  id="panel2d-header"
                  textAlign="left"
                >
                  <Typography textAlign="left">What is an Ingress Code?</Typography>
                </AccordionSummary>
                <AccordionDetails textAlign="left">
                  <Typography textAlign="left">
                    This is the code that gives you remote access to the
                    specific doctor you want. Obtain this code directly from any
                    of your doctors (in real life) to connect with them remotely
                    on SITIBOX health OCR.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion
                square
                expanded={expanded === "panel6"}
                onChange={handleChange("panel6")}
                textAlign="left"
              >
                <AccordionSummary
                  aria-controls="panel3d-content"
                  id="panel3d-header"
                  textAlign="left"
                >
                  <Typography textAlign="left">
                    How much does it cost to use Sitibox®Health OCR?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails textAlign="left">
                  <Typography textAlign="left">
                    It’s presently free. All you need to access the service on
                    this platform is to request for an INGRESS CODE from your
                    doctor (in real life)
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </div>
          </Paper>
        </Grid>
      </Grid> */}
      </div>
    </Layout>
  );
}
