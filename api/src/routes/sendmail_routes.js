import express from "express"
import { Sendmail } from "../controller/Sendemail.js"


export const sendmail_routes = express.Router()

sendmail_routes.post("/create",Sendmail)

       