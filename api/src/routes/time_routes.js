import express from "express"
import { Createtime, deletetime, getalltime, gettimebyId, UpdateTime } from "../controller/time.controller.js"

export const timeroutes =express.Router()

timeroutes.post("/create",Createtime)

timeroutes.get("/getall",getalltime)

timeroutes.put("/updatetime/:id",UpdateTime)

timeroutes.delete("/deletetime/:id",deletetime)

timeroutes.get("/gettimebyid/:id",gettimebyId)


