import React from "react";
import { Grid, Box } from "@mui/material";
import Achivement from "./Achivement";
import MonthlyOverview from "./MonthlyOverview";
import ProductsTable from "../Products/ProductsTable";
import Customers from "../Customer/Customer";
import Navbar from "../../tables/navbar";
import ChartGallery from "../../tables/ChartGallery";
import Analytics from "./Analytics";
import Analytics2 from "./Analytics2";
import Analytics3 from "./Analytics3";
import Dashboard from "./Demodashbaord";

function AdminDashboard() {
  return (
    <div className=" ">
    

        <Analytics/>
        {/* <Analytics2/> */}
        {/* <Analytics3/> */}


    </div>
  );
}

export default AdminDashboard;

