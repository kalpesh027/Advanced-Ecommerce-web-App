import express from "express"
import Addtimelocation, { AlldataTimelocation, Check_address, DeleteTimelocation, gettimelocationbyId, set_Location, updateTimelocation } from "../controller/Time_location_controller.js";
import { verifyToken } from "../middleware/verifyUser.js";

const Timelocationroute = express.Router();


// http://localhost:5454/api/timelocation/
Timelocationroute.post("/createaddress", Addtimelocation)

Timelocationroute.get("/addressbyid", gettimelocationbyId)

Timelocationroute.get("/alldata", AlldataTimelocation)

Timelocationroute.delete("/delete/:id", DeleteTimelocation)

Timelocationroute.put("/update", updateTimelocation)

Timelocationroute.post("/checkaddress", Check_address)

Timelocationroute.get("/setlocation", set_Location)


export default Timelocationroute