import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchProducts } from '../../../Redux/Product/productSlice';
import { useCartContext } from '../../../Usecontext/cartContext';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import './Trending.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductCard from '../Products/Cards';

const smartphones = [
  { name: 'Galaxy S22 Ultra', price: '₹32999', originalPrice: '₹74999', image: 'dummy-image-1.jpg' }, 
  { name: 'Galaxy M13 (4GB | 64 GB)', price: '₹10499', originalPrice: '₹14999', image: 'dummy-image-2.jpg' },
  { name: 'Galaxy M33 (4GB | 64 GB)', price: '₹16999', originalPrice: '₹24999', image: 'dummy-image-3.jpg' },
  { name: 'Galaxy M53 (4GB | 64 GB)', price: '₹31999', originalPrice: '₹40999', image: 'dummy-image-4.jpg' },
  { name: 'Galaxy S22 Ultra', price: '₹67999', originalPrice: '₹85999', image: 'dummy-image-5.jpg' },
  { name: 'Galaxy S22 Ultra', price: '₹32999', originalPrice: '₹74999', image: 'dummy-image-1.jpg' },
  { name: 'Galaxy M13 (4GB | 64 GB)', price: '₹10499', originalPrice: '₹14999', image: 'dummy-image-2.jpg' },
  { name: 'Galaxy M33 (4GB | 64 GB)', price: '₹16999', originalPrice: '₹24999', image: 'dummy-image-3.jpg' },
  { name: 'Galaxy M53 (4GB | 64 GB)', price: '₹31999', originalPrice: '₹40999', image: 'dummy-image-4.jpg' },
  { name: 'Galaxy S22 Ultra', price: '₹67999', originalPrice: '₹85999', image: 'dummy-image-5.jpg' },
  { name: 'Galaxy S22 Ultra', price: '₹67999', originalPrice: '₹85999', image: 'dummy-image-5.jpg' },
  { name: 'Galaxy S22 Ultra', price: '₹32999', originalPrice: '₹74999', image: 'dummy-image-1.jpg' },
  { name: 'Galaxy M13 (4GB | 64 GB)', price: '₹10499', originalPrice: '₹14999', image: 'dummy-image-2.jpg' },
  { name: 'Galaxy M33 (4GB | 64 GB)', price: '₹16999', originalPrice: '₹24999', image: 'dummy-image-3.jpg' },
  { name: 'Galaxy M53 (4GB | 64 GB)', price: '₹31999', originalPrice: '₹40999', image: 'dummy-image-4.jpg' },
];


const Trending = () => {
  const [showAll, setShowAll] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const handleViewAllClick = () => {
    setShowAll(!showAll);
  };

  const dispatch = useDispatch();
  const { products, status } = useSelector((state) => state.products);
  useEffect(() => {
    dispatch(fetchProducts());
    // const handleResize = () => setIsMobile(window.innerWidth <= 500);
    // window.addEventListener('resize', handleResize);

    // return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  
  
  useEffect(() => {
    if (status === "succeeded" && products.length > 0) {
      const filtered = showAll ? products.slice(0,10) : products.slice(0, 5);
      setFilteredProducts(filtered);
      console.log("Filtered products: ", filtered);
    } else {
      setFilteredProducts([]); 
    }
  }, [products, status, showAll]);
  

  const displayedSmartphones = showAll ? smartphones : smartphones.slice(0, 5);

  return (
    <div className="p-8">
      <div className="flex flex-row gap-4 justify-between items-center ">
        <h2 className="text-2xl font-bold mb-4  w-auto">
          Grab the best Product in <span className="text-orange-500">Trending</span>
        </h2>
        <button onClick={handleViewAllClick} className="  w-40 sm:w-auto text-white bg-orange-500 px-2 py-1 rounded-md hover:bg-orange-600">
          {showAll ? 'Show Less' : 'View All'}
        </button>
      </div>
      <hr className="border-t-2 border-orange-500 mb-4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {status === "succeeded" && filteredProducts?.map((product) => (
          // <div
          //   key={product._id}
          //   className={`p-2 sm:p-4 rounded-lg bg-gray-100 hover:bg-orange-100 shadow-lg transition ease-in`}
          // >
          //   <img src={phone.image} alt={phone.name} className="w-full h-32 sm:h-40 object-cover mb-2 sm:mb-4" />
          //   <h3 className="text-sm sm:text-lg font-semibold">{phone.name}</h3>
          //   <div className="text-base sm:text-xl font-bold text-green-600">{phone.price}</div>
          //   <div className="text-xs sm:text-sm text-gray-500 line-through">{phone.originalPrice}</div>
          //   <button className="mt-1 sm:mt-2 text-green-600 text-xs sm:text-base">Buy Now</button>
          // </div>
          <ProductCard key={product._id} product={product} />
        ))}
      </div> 
    </div>
  );
};

export default Trending;





// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchProducts } from '../../../Redux/Product/productSlice';
// import { useCartContext } from '../../../Usecontext/cartContext';
// import { Link } from 'react-router-dom';
// import Slider from 'react-slick';
// import './Trending.css';
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import ProductCard from '../Products/Cards';

// const CustomPrevArrow = ({ onClick }) => (
//   <button
//     className='rounded-md px-4 py-8 absolute left-[-15px] top-1/2 transform -translate-y-1/2 z-10 bg-gray-200 hover:bg-blue-400 transition-colors duration-300 ease-in-out'
//     onClick={onClick}
//     style={{ display: "block" }}
//   >
//     &lt;
//   </button>
// );

// const CustomNextArrow = ({ onClick }) => (
//   <button
//     className='bg-gray-200 hover:bg-blue-400 transition-colors duration-300 ease-in-out rounded-md px-4 py-8 absolute right-[-15px] top-1/2 transform -translate-y-1/2 z-10'
//     onClick={onClick}
//     style={{ display: "block" }}
//   >
//     &gt;
//   </button>
// );

// const Trending = () => {
//   const dispatch = useDispatch();
//   const { products, status } = useSelector((state) => state.products);
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 500);

//   useEffect(() => {
//     dispatch(fetchProducts());
//     const handleResize = () => setIsMobile(window.innerWidth <= 500);
//     window.addEventListener('resize', handleResize);

//     return () => window.removeEventListener('resize', handleResize);
//   }, [dispatch]);

//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: isMobile ? 1 : 5,
//     autoplay: true,
//     autoplaySpeed: 2000,
//     slidesToScroll: 1,
//     prevArrow: <CustomPrevArrow />,
//     nextArrow: <CustomNextArrow />,
//   };

//   const filteredProducts = products.filter(product =>
//     ['grocery', 'dairy', 'fruits'].includes(product.category)
//   );

//   if (isMobile) {
//     return null;
//   }

//   if (status === 'loading') {
//     return <div>Loading...</div>;
//   }

//   if (status === 'failed') {
//     return <div>Error fetching products</div>;
//   }

//   return (
//     <div className="py-10">
//       <Slider {...settings}>
//         {filteredProducts.map((product) => (
//           <ProductCard key={product._id} product={product} />
//         ))}
//       </Slider>
//     </div>
//   );
// };

// export default Trending;

