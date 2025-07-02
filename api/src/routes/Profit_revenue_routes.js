import express from "express"
import { Profit_Revenue, Profit_Revenue_aggregate, Profit_Revenuegraph, Profit_RevenueNullproduct, Top10ProductselledbyOrder } from "../controller/Profit_Revenue_controller.js"

export const profitrevenueroutes = express.Router()

profitrevenueroutes.get("/get",Profit_Revenue)
profitrevenueroutes.get("/getaggregate",Profit_Revenue_aggregate)
profitrevenueroutes.get("/getNullproduct",Profit_RevenueNullproduct)


profitrevenueroutes.get("/Profit_Revenuegraph",Profit_Revenuegraph)
profitrevenueroutes.get("/Top10ProductselledbyOrder",Top10ProductselledbyOrder)