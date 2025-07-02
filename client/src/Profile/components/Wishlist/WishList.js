import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist, removeFromWishlist, clearWishlist } from '../../../Redux/Wishlist/wishlistslice';
import Footer from "../../../customer/Components/footer/Footer";
import { Link } from 'react-router-dom';

const productCardClasses = "relative flex flex-col justify-between p-4 rounded-lg shadow-lg bg-white transition-all duration-200 hover:border hover:border-blue-500"; 
const imageClasses = "w-full h-60 object-cover"; 
const contentClasses = "flex flex-col justify-between flex-grow"; 
const priceClasses = "text-sm font-semibold text-gray-800"; 
const discountClasses = "line-through text-zinc-500 ml-2 text-xs"; 

const ProductCard = ({ id, imageSrc, productName, price, originalPrice, discount, onRemove }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      onRemove(id);
    }, 300); // Wait for animation to complete before calling onRemove
  };

  return (
    <div className={`${productCardClasses} ${isDeleting ? 'opacity-0 transition-opacity duration-300' : 'opacity-100'}`}>
      <div>
        <button 
          className="absolute top-2 right-2 text-zinc-500 hover:text-red-500 transition-colors duration-200" 
          onClick={handleDelete} // Call handleDelete instead of onRemove directly
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        
      </div>
      <Link to={`/product/${id}`}>
      <img src={imageSrc} alt="Product" className={imageClasses} />
      <div className={contentClasses}>
        <h3 className="text-xs font-semibold truncate">{productName}</h3>
        <div className="flex justify-between items-center mt-2">
          <span className={priceClasses}><h3>Discounted Price</h3>{price}</span>
          {originalPrice && <span className={discountClasses}><h3>Price</h3>{originalPrice}</span>}
          <span className="text-green-500 ml-2 text-xs"><h3>Saved</h3>{discount && discount}</span>
        </div>
      </div>
      </Link>
    </div>

  );
};

const WishList = () => {
  const dispatch = useDispatch();
  const { wishlist } = useSelector(state => state.wishlist);
  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleRemoveFromWishlist = (productId) => {
    dispatch(removeFromWishlist(productId)).then(() => dispatch(fetchWishlist()));
  };

  const handleClearWishlist = () => {
    dispatch(clearWishlist()).then(() => dispatch(fetchWishlist()));
  };

  return (
    <div className="mx-auto bg-white p-6 rounded-lg shadow max-w-screen-xl">
      <h2 className="text-2xl font-semibold mb-4">My Wishlist ({wishlist.length})</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {wishlist && wishlist.map(product => (
          <ProductCard
            key={product._id}
            id={product._id}
            imageSrc={Array.isArray(product.imageUrl) && product.imageUrl[0] ? product.imageUrl[0] : 'defaultImage.jpg'}
            productName={product.title}
            price={product.retailPrice}
            originalPrice={product.price}
            discount={product.price - product.retailPrice}
            onRemove={handleRemoveFromWishlist}
          />
        ))}
      </div>
      <div className='flex justify-end mt-5'>
        <button className='py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white w-[110px]' onClick={handleClearWishlist}>
          Remove All
        </button>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default WishList;







// import React, { useState } from 'react';
// import Footer from "../../../customer/Components/footer/Footer";

// const productCardClasses = "relative flex flex-col justify-between p-0 rounded-lg shadow-lg bg-white h-80"; 
// const imageClasses = "w-full h-full object-cover rounded-t-lg"; // Added rounded-t-lg for rounded corners
// const contentClasses = "flex flex-col justify-end p-2"; 
// const priceClasses = "text-sm font-semibold text-gray-800"; 
// const discountClasses = "line-through text-zinc-500 ml-2 text-xs"; 

// const ProductCard = ({ id, imageSrc, productName, price, originalPrice, discount, onRemove }) => {
//   return (
//     <div className={productCardClasses}>
//       <button 
//         className="absolute top-1 right-2 text-zinc-500 hover:text-red-500" 
//         onClick={() => onRemove(id)}
//       >
//         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
//         </svg>
//       </button>
//       <img src={imageSrc} alt="Product" className={imageClasses} />
//       <div className={contentClasses}>
//         <h3 className="text-xs font-semibold truncate">{productName}</h3>
//         <div className="flex justify-between items-center">
//           <span className={priceClasses}>{price}</span>
//           {originalPrice && <span className={discountClasses}>{originalPrice}</span>}
//           {discount && <span className="text-green-500 ml-2 text-xs">{discount}</span>}
//         </div>
//       </div>
//     </div>
//   );
// };

// const WishList = () => {
//   const [products, setProducts] = useState([
//     {
//       id: 1,
//       imageSrc: "https://rukminim2.flixcart.com/image/312/312/xif0q/t-shirt/z/t/i/l-yrtncbfh-try-this-original-imahf8zzuzggkg7f.jpeg?q=70",
//       productName: "Try This Colorblock Men Round Neck Blue, Maroon T-Shirt",
//       price: "₹469",
//       originalPrice: "₹999",
//       discount: "53% off"
//     },
//     {
//       id: 2,
//       imageSrc: "https://rukminim2.flixcart.com/image/312/312/xif0q/shirt/i/0/v/xl-checkered-shirt-zoitgiest-original-imagtjksvawkjzz5.jpeg?q=70",
//       productName: "Marmic Fab Men Solid Casual Maroon Shirt",
//       price: "₹378",
//       originalPrice: "₹1,399",
//       discount: "72% off"
//     },
//     {
//       id: 3,
//       imageSrc: "https://rukminim2.flixcart.com/image/312/312/xif0q/t-shirt/y/u/u/3xl-tbrbl-dgyblhenful-d37-tripr-original-imagn9wgpe7fhz25.jpeg?q=70",
//       productName: "Magnolia Modern Trendy Sneakers",
//       price: "Price: Not Available"
//     },
//     {
//       id: 4,
//       imageSrc: "https://rukminim2.flixcart.com/image/312/312/xif0q/shirt/i/0/v/xl-checkered-shirt-zoitgiest-original-imagtjksvawkjzz5.jpeg?q=70",
//       productName: "TRIPR Colorblock Men Mandarin Collar",
//       price: "₹699",
//       originalPrice: "₹2,999",
//       discount: "76% off"
//     },
//     {
//       id: 5,
//       imageSrc: "https://rukminim2.flixcart.com/image/312/312/xif0q/t-shirt/z/t/i/l-yrtncbfh-try-this-original-imahf8zzuzggkg7f.jpeg?q=70",
//       productName: "Try This Colorblock Men Round Neck Blue, Maroon T-Shirt",
//       price: "₹469",
//       originalPrice: "₹999",
//       discount: "53% off"
//     },
//     {
//       id: 6,
//       imageSrc: "https://rukminim2.flixcart.com/image/312/312/xif0q/shirt/i/0/v/xl-checkered-shirt-zoitgiest-original-imagtjksvawkjzz5.jpeg?q=70",
//       productName: "Marmic Fab Men Solid Casual Maroon Shirt",
//       price: "₹378",
//       originalPrice: "₹1,399",
//       discount: "72% off"
//     },
//     {
//       id: 7,
//       imageSrc: "https://rukminim2.flixcart.com/image/312/312/xif0q/t-shirt/y/u/u/3xl-tbrbl-dgyblhenful-d37-tripr-original-imagn9wgpe7fhz25.jpeg?q=70",
//       productName: "Magnolia Modern Trendy Sneakers",
//       price: "Price: Not Available"
//     },
//     {
//       id: 8,
//       imageSrc: "https://rukminim2.flixcart.com/image/312/312/xif0q/shirt/i/0/v/xl-checkered-shirt-zoitgiest-original-imagtjksvawkjzz5.jpeg?q=70",
//       productName: "TRIPR Colorblock Men Mandarin Collar",
//       price: "₹699",
//       originalPrice: "₹2,999",
//       discount: "76% off"
//     }
//   ]);

//   const handleRemoveProduct = (id) => {
//     setProducts(products.filter(product => product.id !== id));
//   };

//   return (
//     <div className="mx-auto bg-white p-4 rounded-lg shadow">
//       <h2 className="text-2xl font-semibold mb-4">My Wishlist ({products.length})</h2>
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         {products.map(product => (
//           <ProductCard
//             key={product.id}
//             id={product.id}
//             imageSrc={product.imageSrc}
//             productName={product.productName}
//             price={product.price}
//             originalPrice={product.originalPrice}
//             discount={product.discount}
//             onRemove={handleRemoveProduct}
//           />
//         ))}
//       </div>
//       <Footer />
//     </div>
   
//   );
// };

// export default WishList;
