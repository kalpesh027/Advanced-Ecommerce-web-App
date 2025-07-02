import express from "express";
import {upload} from "../middleware/multer.middlware.js";

import { addAddress, deleteAddress, getAddressById, getAllAddr,getAllAddressforUser, getAllAddressofUserforadmin, updateAddress } from "../controller/address.controller.js";

import { verifyToken } from "../middleware/verifyUser.js";
import authenticate from "../middleware/authenticat.js";


const address = express.Router();




// address routes defined here

address.route("/addAddress").post(verifyToken,
    // upload.none(),
    addAddress
);


address.route("/updateAddress/:id").put(
    updateAddress
);

address.route("/addressbyid/:id").get(getAddressById)




address.route(`/deleteAddress`).delete(

    verifyToken,
    // upload.none(),
    deleteAddress

);


address.route(`/getAddressforUser`).get(

    verifyToken,
    // upload.none(),
    getAllAddressforUser

);

address.route("/getAllAddr").get(
    verifyToken,
    getAllAddr
)

address.route("/getAllAddressofUserforadmin/:id").get(verifyToken,getAllAddressofUserforadmin)




export default address;