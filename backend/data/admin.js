import bcrypt from "bcryptjs";

const admin = [{
    email: "admin@9jaclinic.com",
    password: bcrypt.hashSync("Successissure_402", 10),
}];

export default admin;