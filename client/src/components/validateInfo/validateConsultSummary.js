export default function validateConsultSummary({age, name, addCKEditorData}) {
    let errors = {};

    // name
    if (!name.trim()) {
        errors.name = "Name is required";
    }

    // age
    if (!age.trim()) {
        errors.age = "Field is required";
    }

    // prescription
    if (!addCKEditorData) {
        errors.age = "Field is required";
    }

    return errors;
}