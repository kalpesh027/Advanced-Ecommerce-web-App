import express from "express";
import { testingRegisterUser } from "../controller/testing.controller.js";
const Test = express.Router();

Test.delete('/remove',testingRegisterUser);
export default Test;