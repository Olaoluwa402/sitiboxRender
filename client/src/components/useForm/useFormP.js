import { useState } from "react";

const useForm = ({
  validate,
  dispatch,
  registerPatient,
  phoneValue,
  password,
  clinicName,
  email,
  Checked,
}) => {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
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
    setErrors(
      validate({ values, phoneValue, password, email, clinicName, Checked })
    );

    const myData = {
      // Dispatch register
      clinicName: clinicName.toLowerCase().replace(/ /g, ""),
      firstName: values.firstName.toLowerCase(),
      lastName: values.lastName.toLowerCase(),
      phone: phoneValue,
      email: email,
      password: password,
      isChecked: Checked,
    };

    if (
      clinicName &&
      phoneValue &&
      email &&
      password &&
      values.lastName &&
      values.firstName &&
      Checked === "true"
    ) {
      dispatch(registerPatient(myData));
    } else {
      return;
    }
  };

  return { handleChange, values, errors, submitHandler };
};

export default useForm;
