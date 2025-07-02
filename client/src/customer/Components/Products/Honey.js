import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import { useDispatch } from "react-redux";
import { fetchCategories } from "../../../Redux/Category/categoriesSlice"; // Adjust the path as necessary
import { fetchSuggestedProducts } from "../../../Redux/Product/productSlice"; 
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ProductCard from "./Cards"; // Assuming this component renders individual product cards

const Honey = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state
  const subcategoryId = "66ba0b370162debb99ed4346"; // ID for Jams and Honey

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchCategories()).unwrap();

        // Fetch products for Jams and Honey using the provided ID
        const productsData = await dispatch(fetchSuggestedProducts(subcategoryId)).unwrap();

        // Set fetched products in state
        setProducts(productsData);

        toast.success("Jams and Honey products loaded successfully!");
      } catch (error) {
        toast.error(`Failed to load products: ${error.message}`);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchData();
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6 bg-white relative min-h-screen">
        {/* Header Section */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center md:text-left">
          Jams & Honey
        </h2>

        {/* Loading Indicator */}
        {loading && <p className="text-center">Loading products...</p>}

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* Toast Container for Notifications */}
        <ToastContainer />
        <footer className="absolute bottom-0 left-0 right-0 bg-white py-2 text-center text-sm text-gray-500">
          © 2024 Jams & Honey Store. All rights reserved.
        </footer>
      </div>
    </>
  );
};

export default Honey;
