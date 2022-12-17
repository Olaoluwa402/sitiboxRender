export default function validatePrescriptionInfo(values, addCKEditorData) {
    let errors = {};

    // name
    if (!values.name.trim()) {
        errors.name = "Name is required";
    }

    // age
    if (!values.age.trim()) {
        errors.age = "Field is required";
    }

    // prescription
    if (!addCKEditorData) {
        errors.age = "Field is required";
    }

    return errors;
}