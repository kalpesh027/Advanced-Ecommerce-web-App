import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSuggestedProducts } from '../../../Redux/Product/productSlice'; // Adjust the path as necessary
import ProductCard from './Cards'; // Import the ProductCard component

const Gadgets = ({ section1title }) => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch products for both categories
        const biscuitProducts = await dispatch(fetchSuggestedProducts("66ba0b400162debb99ed4430")).unwrap();
        const namkeenProducts = await dispatch(fetchSuggestedProducts("66ba0b450162debb99ed4495")).unwrap();

        // Combine products from both categories
        const combinedProducts = [...biscuitProducts, ...namkeenProducts];

        // Shuffle the combined products and pick 4 (2 biscuits and 2 namkeen)
        const selectedProducts = combinedProducts.sort(() => 0.5 - Math.random()).slice(0, 4);

        setProducts(selectedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [dispatch]);

  return (
    <div className="p-8 bg-gray-50 rounded-md">
      <h2 className="text-3xl font-bold text-center mb-6">{section1title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} /> // Use ProductCard for rendering products
        ))}
      </div>
      <div className="text-center mt-6">
        <Link to="/gadgets" className="inline-block bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition duration-300">
          View All
        </Link>
      </div>
    </div>
  );
};

export default Gadgets;
