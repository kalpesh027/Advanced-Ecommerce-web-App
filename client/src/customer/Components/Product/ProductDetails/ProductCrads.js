import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSuggestedProducts } from "../../../../Redux/Product/productSlice";
import { addToCart } from '../../../../Redux/Cart/cartSlice';
import { useParams, useNavigate, Link } from "react-router-dom";

const ProductCards = ({ categoryId, excludeProductId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { suggestedProducts, status, error } = useSelector((state) => state.products);
  const [showAll, setShowAll] = useState(false);

  const handleAddToCart = async () => {
    const resultAction = await dispatch(addToCart(id));
    if (addToCart.rejected.match(resultAction) && resultAction.payload?.isUnauthorized) {
      navigate('/login');
    }
  };

  useEffect(() => {
    if (categoryId) {
      dispatch(fetchSuggestedProducts(categoryId));
    }
  }, [dispatch, categoryId]);

  const handleViewAllClick = () => {
    setShowAll(!showAll);
  };

  const filteredProducts = suggestedProducts.filter(product => product._id !== excludeProductId);
  const displayedProducts = showAll ? filteredProducts : filteredProducts.slice(0, 5);

  return (
    <div className="p-4 md:p-8">
      <div className='flex flex-col md:flex-row gap-4 justify-between items-center'>
        <h2 className="text-lg md:text-xl lg:text-2xl font-bold mb-4 text-center md:text-left">
          Grab the best deal on <span className="text-orange-500">Aapla Bajar</span>
        </h2>
        <button onClick={handleViewAllClick} className="text-orange-500">
          {showAll ? 'Show Less' : 'View All'}
        </button>
      </div>
      <div className="flex justify-between items-center mb-4">
        <hr className="border-t-2 border-orange-500 flex-grow mr-2" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {displayedProducts.map((product, index) => (
          <div
            key={product._id}
            className={`p-2 md:p-4 rounded-lg shadow-lg ${index === 1 ? 'border-2 border-orange-500' : ''}`}
          >
            <Link to={`/product/${product._id}`}>
              <div className="relative w-full h-40 sm:h-48 md:h-40 flex items-center justify-center border-2 border-gray-300 rounded-lg overflow-hidden">
                <img 
                  src={product.imageUrl[0]} // Get the first image from the array
                  alt={product.name} 
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-center md:text-left">{product.title}</h3>
            </Link>
            <div className="text-base sm:text-lg md:text-s font-bold text-green-600 text-center md:text-left">
              <span className='font-bold text-green-900'>Aapla Bajar Price</span> ₹{product.discountedPrice} 
            </div>
            <div className="text-sm sm:text-base md:text-base text-gray-500 line-through text-center md:text-left">₹{product.price}</div>
            <button onClick={handleAddToCart} className="mt-2 text-green-600 w-full md:w-auto text-center">Add To Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCards;
