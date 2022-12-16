import mongoose from "mongoose";

const connectDB = () => {
  return mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify:false
  });
};
export default connectDB;
