import mongoose from "mongoose";

const lastcodeSchema = mongoose.Schema({
            lastAsignedCode: {type: String, required:true},
    }, {
        timestamps: true,
    }
);

const Lastcode = mongoose.model("Lastcode", lastcodeSchema);

export default Lastcode;