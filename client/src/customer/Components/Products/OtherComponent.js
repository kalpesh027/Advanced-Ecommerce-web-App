import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchSuggestedProducts } from '../../../Redux/Product/productSlice'; // Adjust the path as necessary
import ProductCard from './Cards'; // Import the ProductCard component

const OtherComponent = ({ section2title }) => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);

  const subcategoryId = "66ba0b370162debb99ed4346"; // Jams and Honey subcategory ID

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch products from the Jams and Honey category
        const jamsAndHoneyProducts = await dispatch(fetchSuggestedProducts(subcategoryId)).unwrap();

        console.log('Fetched products:', jamsAndHoneyProducts); // Log fetched products for debugging

        // Take the first 4 products
        const selectedProducts = jamsAndHoneyProducts.slice(0, 4);

        console.log('Selected first 4 products:', selectedProducts); // Log selected products for debugging

        setProducts(selectedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [dispatch]);

  return (
    <div className="p-8 bg-gray-50 rounded-md">
      <h2 className="text-3xl font-bold text-center mb-6">{section2title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product._id} product={product} /> // Use ProductCard for rendering products
          ))
        ) : (
          <p className="text-center">No products found.</p> // Display message if no products are found
        )}
      </div>
      <div className="text-center mt-6">
        <Link to="/all-foods-and-beverages" className="inline-block bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition duration-300">
          View All
        </Link>
      </div>
    </div>
  );
};

export default OtherComponent;
