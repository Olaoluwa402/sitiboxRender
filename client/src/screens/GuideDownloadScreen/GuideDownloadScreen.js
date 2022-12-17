import React from "react";
import useFileDownloader from "../../hooks/useFileDownloader";
import { FaDownload } from "react-icons/fa";

// import { makeStyles } from '@material-ui/core/styles';
// import Card from '@material-ui/core/Card';
// import CardActionArea from '@material-ui/core/CardActionArea';
// import CardActions from '@material-ui/core/CardActions';
// import CardContent from '@material-ui/core/CardContent';
// import CardMedia from '@material-ui/core/CardMedia';
// import Button from '@material-ui/core/Button';
// import Typography from '@material-ui/core/Typography';
import Layout from "../../components/Layout/Layout";

import styled from "./GuideDownloadScreen.module.css";

// const useStyles = makeStyles({
//   root: {

//   },
//   media: {
//     height: 140,
//   },
// });

const files = [
  {
    name: "SITIBOX PATIENT'S GUIDE",
    thumb:
      "https://res.cloudinary.com/njaclinic/image/upload/v1631586723/liorwell/appguide2_vfqnrb.png",
    file: "https://res.cloudinary.com/njaclinic/image/upload/v1634318176/Sitibox_Patients_GUIDE_PPT_critni.pdf",
    filename: "sitibox-patient-guide.pdf",
  },
  {
    name: "SITIBOX DOCTOR'S GUIDE",
    thumb:
      "https://res.cloudinary.com/njaclinic/image/upload/v1631586723/liorwell/appguide2_vfqnrb.png",
    file: "https://res.cloudinary.com/njaclinic/image/upload/v1634318199/Sitibox_Health_OCR_1.0._User_guide_for_Medical_Doctors_3D_i7hvr0.pdf",
    filename: "sitibox-doctor-guide.pdf",
  },
];

const GuideDownloadScreen = () => {
  // const classes = useStyles();

  // call useFileDownloader hook
  const [downloadFile, downloaderComponentUI] = useFileDownloader();

  const download = (file) => downloadFile(file);

  return (
    <Layout>
      <div className="row">
        <div className={styled.cardContainer}>
          <h2>File Download</h2>
          {/* <div className={styled.cardBox}>
	            {files.map((file, idx) => (
	              <div className={styled.card} key={idx}>
	              	  <Card className={classes.root}>
				      <CardActionArea key={idx}>
				        <CardMedia
				          className={classes.media}
				          image={file.thumb}
				          title={file.name}
				        />
				        <CardContent>
				          <Typography gutterBottom variant="h5" component="h2">
				            {file.name}
				          </Typography>
				          <Typography variant="body2" color="textSecondary" component="p">
				            Make use of Sitibox guide for easy app use. 
				          </Typography>
				        </CardContent>
				      </CardActionArea>
				      <CardActions>
				        <Button 
				        	onClick={() => download(file)}
				        	size="small" 
				        	color="primary">
				          Download <FaDownload />
				        </Button>
				      </CardActions>
				    </Card>
	              </div>
	            ))}
	          </div> */}
        </div>
        {downloaderComponentUI}
      </div>
    </Layout>
  );
};

export default GuideDownloadScreen;
