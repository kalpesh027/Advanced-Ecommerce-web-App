import mongoose from "mongoose";

const TimelocationSchema = new mongoose.Schema({

    address: {
        type: String
    },
    city: {
        type: String
    },
    pincode: {
        type: Number
    },
    landMark: {
        type: String,

    },
    street: {
        type: String,
    },
    timeslot:{
        type:String
    },
    start: {
        type: String
    },
    end: {
        type: String
    },
    area: {
        type: String,
    },
    district: {
        type: String,
    },
    day:{
        type: String,
        enum: ['Tomorrow', 'Today'],
    },

    state: {
        type: String,
    },

    houseNumber: {
        type: String,

    },
    // user_id: {
    //     type: mongoose.Schema.Types.ObjectId,  // id  
    //     ref: "User",

    // },
    mobile: {
        type: String,
        length: 10
    },
}, {
    timestamps: true
})

const Timelocation = mongoose.model("Timelocation", TimelocationSchema)

export default Timelocation;