import { useState} from "react";

const useForm = (validate, dispatch, getDoctorProfile, doctor, countryCodeValue) => {
    const [values, setValues] = useState({
        name: "",
        phone: "",
        email: "",
        biodata: "",
        gender: "",
        specialty: "",
        fileInput: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});

     const [file, setFile] = useState({});
    const [previewSource, setPreviewSource] = useState("");

    const handleChange = (e) => { 
        const { name, value } = e.target;
        if (name === "fileInput") {
            const fileUpload = e.target.files[0];
            previewFile(fileUpload);
            setFile(fileUpload);
        }

        setValues({
            ...values,
            [name]: value,
        });
    };

    const previewFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file); 
        reader.onloadend = () => {
            setPreviewSource(reader.result);
        };
    };

    const submitHandler = (e) => {
        e.preventDefault();
             // set errors
             setErrors(validate(values));

            const removeLeadingZero = +values.phone;

            const myData = {
                image: previewSource,
                name: values.name,
                gender: values.gender,
                phone: Number(countryCodeValue + removeLeadingZero),
                specialty: values.specialty,
                email: values.email,
                biodata: values.biodata,
                password: values.password
            };

            console.log('updateData', myData);

            // // Dispatch register
            // dispatch(registerDoctor(myData));
    };

    return { handleChange, values, errors, previewSource, submitHandler };
};

export default useForm;