import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../../Redux/Category/categoriesSlice"; 
import { fetchSuggestedProducts } from "../../../Redux/Product/productSlice"; 
import { addToCart, removeFromCart } from '../../../Redux/Cart/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../../Redux/Wishlist/wishlistslice'; 
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ProductCard from "./Cards";

const SnacksAndBeverages = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchCategories()).unwrap();

        const subcategoryIds = [
          "66ba0b400162debb99ed4430", // Biscuits
          "66ba0b400162debb99ed4438", // Cream Biscuits
          "66ba0b450162debb99ed4495", // Namkeen
        ];

        const productsPromises = subcategoryIds.map(id => dispatch(fetchSuggestedProducts(id)).unwrap());
        const productsData = await Promise.all(productsPromises);
        
        const allProducts = productsData.flat();
        setProducts(allProducts);

        toast.success("Products loaded successfully!");
      } catch (error) {
        toast.error(`Failed to load products: ${error.message}`);
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
          Snacks & Beverages
        </h2>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard 
              key={product._id} 
              product={product} 
              // addToCart={() => dispatch(addToCart(product))}
              // removeFromCart={() => dispatch(removeFromCart(product._id))}
              // addToWishlist={() => dispatch(addToWishlist(product))}
              // removeFromWishlist={() => dispatch(removeFromWishlist(product._id))}
            />
          ))}
        </div>

        {/* Toast Container for Notifications */}
        <ToastContainer />
        <footer className="absolute bottom-0 left-0 right-0 bg-white py-2 text-center text-sm text-gray-500">
          © 2024 Snack Store. All rights reserved.
        </footer>
      </div>
    </>
  );
};

export default SnacksAndBeverages;
