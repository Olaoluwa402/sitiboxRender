export default function validateInfo({values,phoneValue,Checked, password, email}) {
    let errors = {};

   // first name
    if (!values.firstName.trim()) {
        errors.firstName = "first name is required";
    }

    // last name
    if (!values.lastName.trim()) {
        errors.lastName = "last name is required";
    }

    // // gender
    // if (!values.gender.trim()) {
    //     errors.gender = "Gender is required";
    // }

    // phone 
    if (!phoneValue) {
        errors.phoneValue = "Phone is required";
    }else if (!/^\+(?:[0-9] ?){6,14}[0-9]$/.test(phoneValue)) {
        errors.phoneValue = 'phone is invalid';
    } 

    if(!Checked){
        errors.isChecked = "Terms and condition must be accepted "
    }

    // // biodata
    // if (!values.biodata.trim()) {
    //     errors.biodata = "Field is required";
    // } 

    // email
    if (!email) {
        errors.email = "Please enter your email";
    }

    // password
    if (!password) {
        errors.password = 'Please enter your password';
    }
    return errors;
}