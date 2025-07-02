import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import AdminDashboard from "./components/Dashboard/Dashboard";
import CreateProductForm from "./components/createProduct/CreateProductForm";
import OrdersTable from "./components/Orders/OrdersTable";
import ProductsTable from "./components/Products/ProductsTable";
import Customers from "./components/Customer/Customer";
import Categories from './components/Category/categories';
import { BiSolidCategoryAlt } from "react-icons/bi";
import * as XLSX from 'xlsx';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from "./tables/navbar";
import Advertisements from "./components/Advertisements/Advertisements";
import Coupons from "./components/Coupons/Coupons";
import { FaTachometerAlt, FaBoxOpen, FaTags, FaShoppingCart, FaUser, FaCog, FaTimes } from 'react-icons/fa';
import { RiAdvertisementFill,RiCoupon2Fill, RiTimeZoneFill } from "react-icons/ri";
import axiosInstance from "../axiosConfig";
import TimeLocation from "./components/Time_Location/Time_Location";

const sidebarClasses = 'w-64 bg-white border-r border-gray-200 shadow-lg fixed lg:static h-full lg:z-auto'; // Increased z-index
const linkClasses = 'flex items-center p-4 mt-2 text-gray-600 hover:bg-gray-100 hover:text-green-500 rounded-lg transition-colors duration-200';
const activeLinkClasses = 'flex items-center p-4 text-green-500 bg-gray-100 rounded-lg font-bold shadow-sm';

export const importExcelData = (file, callback) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    const data = new Uint8Array(event.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const headers = jsonData[0];
    const rows = jsonData.slice(1);
    const formattedData = rows.map((row) => {
      const obj = {};
      row.forEach((cell, index) => {
        obj[headers[index]] = cell;
      });
      return obj;
    });

    callback(formattedData);
  };
  reader.readAsArrayBuffer(file);
};

function AdminPanel() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const dispatch = useDispatch();

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      importExcelData(file, async (data) => {
        try {
          const response = await axiosInstance.post('/import', { products: data });
          console.log('Data imported successfully:', response.data);

          dispatch(response.data.data);
          if (response.data.skipped.length > 0) {
            console.log('Skipped products:', response.data.skipped);
          }
        } catch (error) {
          console.error('Error importing data:', error);
        }
      });
    }
  };

  const menu = [
    { name: "Dashboard", path: "/admin", icon: <FaTachometerAlt /> },
    { name: "Products", path: "/admin/products", icon: <FaBoxOpen /> },
    { name: "Add Products", path: "/admin/product/create", icon: <FaTags /> },
    { name: "Categories", path: "/admin/categories", icon: <BiSolidCategoryAlt /> },
    { name: "Customers", path: "/admin/customers", icon: <FaUser /> },
    { name: "Orders", path: "/admin/orders", icon: <FaShoppingCart /> },
    {name: "Time And Location", path: "/admin/timelocation", icon: <RiTimeZoneFill/>},
    { name: "Advertisements", path: "/admin/advertisements", icon: <RiAdvertisementFill /> },
    { name: "Coupons", path: "/admin/coupons", icon: <RiCoupon2Fill /> },
    // { name: "Settings", path: "/admin/settings", icon: <FaCog /> }
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <section className="flex w-screen">
      <div className="bg-[#eff4f8] lg:w-full w-[1000px] ">
        <Navbar toggleSidebar={toggleSidebar} />
        <div className="flex h-full">
          {isSidebarOpen && (
            <div className={sidebarClasses}>
              <div className="p-4 flex justify-between items-center w-[280px]">
                <h1 className="text-2xl font-bold text-green-500">Admin</h1>
                <button className="text-gray-600 hover:text-green-500 lg:hidden" onClick={toggleSidebar}>
                  <FaTimes />
                </button>
              </div>
              <nav className="mt-8 h-screen">
                {menu.map((item, index) => (
                  <Link 
                    to={item.path || "#"} 
                    key={index} 
                    className={linkClasses} 
                    onClick={!item.path ? undefined : toggleSidebar}  
                  >
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                  </Link>
                ))}
                {/* <label className={linkClasses}>
                  <FaCog />
                  <span className="ml-3">Import</span>
                  <input 
                    type="file" 
                    accept=".xlsx, .xls, .csv" 
                    onChange={handleImport} 
                    className="hidden"
                  />
                </label> */}
              </nav>
            </div>
          )}
          <div className='flex-grow'>
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/product/create" element={<CreateProductForm />} />
              <Route path="/products" element={<ProductsTable />} />
              <Route path="/orders" element={<OrdersTable />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/advertisements" element={<Advertisements />} />
              <Route path="/coupons" element={<Coupons />} />
              <Route path="/timelocation" element={<TimeLocation />} />
            </Routes>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminPanel;

