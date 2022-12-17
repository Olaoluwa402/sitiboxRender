export default function validateInfo({values, age, birthDate,}) {
    let errors = {};

    // firstname
    if (!values.firstName.trim()) {
        errors.firstname = "first name is required";
    }

      // lastname
    if (!values.lastName.trim()) {
        errors.lastname = "last name is required";
    }

    // age
    if (!age) {
        errors.age = "Age is required";
    }

    // gender
    if (!values.gender) {
        errors.gender = "Gender is required";
    }

    // complait
    if (!values.complaint) {
        errors.complaint = "Complaint is required";
    }

     // birthdate
    if (!birthDate) {
        errors.birthdate = "Birthdate is required";
    }


    return errors;
}