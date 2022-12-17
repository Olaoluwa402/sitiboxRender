import react, { useState } from 'react';

const useFormC = (validate, dispatch, registerPatient, history) => {
    const [values, setValues] = useState({
        name: "",
        complaint: "",
        gender: "Male",
        age: "",
        fileInput: "",
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

        // Dispatch register
        const name = values.name;
        const complaint = values.complaint;
        const age = values.age;
        const gender = values.gender;
        console.log(file);

        if (name && complaint && gender && age) {
            history.push('/pickdoctor');
        } else {
            return;
        }

    };


    return { handleChange, values, errors, submitHandler };

};

export default useFormC;