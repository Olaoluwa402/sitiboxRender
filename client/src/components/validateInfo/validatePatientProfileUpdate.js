export default function validateInfo({phone}) {
    let errors = {};

    // phone
    if (phone){
        // /^\+(?:[0-9] ?){6,14}[0-9]$/
        if(!/^([0-9] ?){6,14}[0-9]$/.test(phone)) {
            errors.phone = 'invalid international phone format';
        }
    }

    return errors;
}