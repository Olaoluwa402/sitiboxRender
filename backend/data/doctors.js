import bcrypt from "bcryptjs";

const doctors = [
  {
    name: "Mathew Jane",
    specialty: "Gynaecologist",
    image:
      "https://res.cloudinary.com/olaoluwa402/image/upload/v1613122270/liorwell/t8oqogvmeyhjf1e1hiyo.png",
    imageId: "liorwell/t8oqogvmeyhjf1e1hiyo",
    phone: "2347060507450",
    email: "mathew@example.com",
    password: bcrypt.hashSync("123456", 10),
    biodata:
      "Lorem ipsum lrebrem ipsum ipsum lrebrem Lorem ipsum lrebrem ipsum ipsum lrebrem",
  },
  {
    name: "John Henry",
    specialty: "Gynaecologist",
    image:
      "https://res.cloudinary.com/olaoluwa402/image/upload/v1613122438/liorwell/urtihrhudu27hgrbf5ux.png",
    imageId: "liorwell/urtihrhudu27hgrbf5ux",
    phone: "2347060507450",
    biodata:
      "Lorem ipsum lrebrem ipsum ipsum lrebrem Lorem ipsum lrebrem ipsum ipsum lrebrem",
    email: "john@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    name: "Jane Henry",
    specialty: "Gynaecologist",
    image:
      "https://res.cloudinary.com/olaoluwa402/image/upload/v1613122575/liorwell/n00hgemeezsbobg7tfrv.png",
    imageId: "liorwell/n00hgemeezsbobg7tfrv",
    phone: "2347060507450",
    biodata:
      "Lorem ipsum lrebrem ipsum ipsum lrebrem Lorem ipsum lrebrem ipsum ipsum lrebrem",
    email: "jane@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    name: "Bay Praise",
    specialty: "Gynaecologist",
    image:
      "https://res.cloudinary.com/olaoluwa402/image/upload/v1613122755/liorwell/nfb1owijqvozvovoexhj.png",
    imageId: "liorwell/nfb1owijqvozvovoexhj",
    phone: "2347060507450",
    biodata:
      "Lorem ipsum lrebrem ipsum ipsum lrebrem Lorem ipsum lrebrem ipsum ipsum lrebrem",
    email: "bay@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
];

export default doctors;
