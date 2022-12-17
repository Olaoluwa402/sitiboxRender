import { useState} from "react";

const useForm = ({validate, dispatch, registerDoctor, phoneValue,password, email,Checked}) => {
    const [values, setValues] = useState({
        firstName: "",
        lastName: "",
        specialty: "Primary Care Doctor",
    });

    const [errors, setErrors] = useState({});

    // const [profileFile, setProfileFile] = useState({});
    // const [profilePreview, setProfilePreview] = useState("");

    // const [licenseFile, setLicenseFile] = useState({});
    // const [licensePreview, setLicensePreview] = useState("");
    
    // const [fellowshipExamFile, setFellowshipExamFile] = useState({});
    // const [fellowshipExamPreview, setFellowshipExamPreview] = useState("");
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        // preview profile picture
        // if (name === "profile") {
        //     const fileUpload = e.target.files[0];
        //     handleProfilePreviewFile(fileUpload);
        //     setProfileFile(fileUpload);
        // }


        // // preview membershipExam 
        // if (name === "fellowshipExam") {
        //     const fileUpload = e.target.files[0];
        //     handleFellowshipExamPreviewFile(fileUpload);
        //     setFellowshipExamFile(fileUpload);
        // }


        // // preview license 
        // if (name === "license") {
        //     const fileUpload = e.target.files[0];
        //     handleLicensePreviewFile(fileUpload);
        //     setLicenseFile(fileUpload);
        // }

    

        setValues({
            ...values,
            [name]: value,
        });
    };

    // const handleProfilePreviewFile = (file) => {
    //     const reader = new FileReader();
    //     reader.readAsDataURL(file);
    //     reader.onloadend = () => {
    //         setProfilePreview(reader.result);
    //     };
    // };


    // const handleFellowshipExamPreviewFile = (file) => {
    //     const reader = new FileReader();
    //     reader.readAsDataURL(file);
    //     reader.onloadend = () => {
    //         setFellowshipExamPreview(reader.result);
    //     };
    // };


    // const handleLicensePreviewFile = (file) => {
    //     const reader = new FileReader();
    //     reader.readAsDataURL(file);
    //     reader.onloadend = () => {
    //         setLicensePreview(reader.result);
    //     };
    // };
 

    const submitHandler = (e) => {
        e.preventDefault();

        // set errors
        setErrors(validate({values, phoneValue, Checked, password, email}));
        
        const myData = {
                firstName: values.firstName.toLowerCase(),
                lastName: values.lastName.toLowerCase(),
                isChecked:Checked,
                phone: phoneValue,
                specialty: values.specialty,
                email: email,
                password: password
            }; 


        if (
            values.firstName &&
            values.lastName &&
            email &&
            password &&
            phoneValue &&
            values.specialty &&
            Checked === "true"
        ) {
            // Dispatch register
             dispatch(registerDoctor(myData));
        } else {
            return;
        }
    };

    return { 
            handleChange,
            values,
            errors,
            submitHandler,
        };
}; 

export default useForm;