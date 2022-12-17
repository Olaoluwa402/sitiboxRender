import { useState } from "react";

const usePrescriptionForm = (
  validate,
  dispatch,
  sendPrescription,
  addCKEditorData,
  patientId,
  orderId
) => {
  // generate random numbers prescription
  const prescriptionNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  const [values, setValues] = useState({
    name: "",
    age: "",
    prescriptionNumber: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();

    // set errors
    setErrors(validate(values, addCKEditorData));

    if (values.name && values.age && addCKEditorData && patientId) {
      const myData = {
        name: values.name,
        age: values.age,
        prescription: addCKEditorData,
        prescriptionNumber: prescriptionNumber(1000, 10000000),
        patient: patientId,
        orderId: orderId,
      };

      // Dispatch register
      dispatch(sendPrescription({ myData }));

      //  // reset state after dispatch
      //  setValues({
      //     name: "",
      //     age:"",
      //     prescriptionNumber: prescriptionNumber(1000, 10000000),
      //     prescription: ""
      // });
    } else {
      return;
    }
  };

  return { handleChange, values, setValues, errors, submitHandler };
};

export default usePrescriptionForm;
