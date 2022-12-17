export default function validateInfo({firstName, lastName, phoneValue, biodata, password, confirmPassword}) {
    let errors = {};

    // name
    if (firstName) {
        firstName.trim();
    }

    if (lastName) {
        lastName.trim();
    }


    // biodata
    if (biodata){biodata.trim()};

    // // fileInput
    // if (!values.fileInput) {
    //     errors.fileInput = "No file selected";
    // }


    // password
    if (password && password.length < 6) {
        errors.password = 'Password needs to be 6 characters or more';
    }

    if (confirmPassword !== password) {
        errors.confirmPassword = 'Passwords do not match';
    }
    return errors;
}