import bcrypt from "bcryptjs";

const patients = [{
        clinicName: "Bayo",
        phone: "2347060507450",
        gender: "Male",
        email: "bayo@example.com",
        password: bcrypt.hashSync("123456", 10),
    },
    {
        clinicName: "Dapo",
        phone: "2347060507450",
        gender: "Male",
        email: "dapo@example.com",
        password: bcrypt.hashSync("123456", 10),
    },
];

export default patients;