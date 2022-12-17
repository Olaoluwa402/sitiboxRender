 export default function validateInfo({password, confirmPassword}) {
    let errors = {};

    // password
    if (!password) {
        errors.password = 'Password is required';
    } else if (password.length < 6) {
        errors.password = 'Password needs to be 6 characters or more';
    }

    if(confirmPassword !== password) {
        errors.confirmPassword = 'Passwords do not match';
    }
    return errors;
}