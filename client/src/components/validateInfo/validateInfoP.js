export default function validateInfo({values,phoneValue,password, email, clinicName,Checked}) {
    let errors = {};



    // clinic name
    if (!clinicName.trim()) {
        errors.clinicName = "Please enter clinic name";
    }

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

    // email
    if (!email) {
        errors.email = "Email is required";
    } 

    // phone 
    if (!phoneValue) {
        errors.phoneValue = "Phone is required";
    }else if (!/^\+(?:[0-9] ?){6,14}[0-9]$/.test(phoneValue)) {
        errors.phoneValue = 'phone is invalid';
    }

    // if (!selectedDate) {
    //     errors.birthdate = "Date of birth is required";
    // }

    if(!Checked){
        errors.isChecked = "Terms and condition must be accepted "
    }

    // password
    if (!password) {
        errors.password = 'Password is required';
    } 

    // if (!/\d/.test(pword)){
    //     errors.pwNum = "Password must contain a number";
    // }

    // if (!/[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pword)){
    //     errors.pwChar = "Password must contain special character";
    // }


    return errors;
}