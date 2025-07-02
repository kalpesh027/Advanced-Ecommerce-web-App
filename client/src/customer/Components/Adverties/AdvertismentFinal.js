import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../../Redux/Category/categoriesSlice";
import { toast } from "react-toastify";

function AdvertismentFinal({ advertisements, status }) {

    const ads = advertisements
        .filter((advertisement) => advertisement.section === "Section 3")
        .slice(0, 2);

    // console.log("ads : ",ads);

    // State to track the current ad index
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        // Automatically switch advertisements every 3 seconds
        const intervalId = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length);
        }, 5000); // 3000ms = 3 seconds

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, [ads.length]);

    const advertisement = ads[currentIndex];

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const categories = useSelector((state) => state.categories.categories);
    const categoryError = useSelector((state) => state.categories.error);
  
    useEffect(() => {
      dispatch(fetchCategories())
        .unwrap()
        .then(() => {
        // console.log("categories are: ",categories);
        })
        .catch((error) => {
          toast.error(`Failed to load categories: ${error.message}`);
        });
    }, [advertisement]);
  
    const handleNavigate = (path) => {
      navigate(path);
    };
    const catclasses = "flex items-center text-lg text-gray-700 hover:text-orange-500 cursor-pointer" 
    const catclassesborder = "flex items-center border-b-2 border-orange-500 text-lg text-gray-700 hover:text-orange-500 cursor-pointer" 
    
    const handlerCategoryClick =(category) => {
      handleNavigate(`/category/${category._id}`);
    }

    const renderCategories = () => {
      return categories
        .filter((category) => category.level === 1)
        .map((category) => (
          <div key={category._id}>
            <img
              // src={`https://cdn.dmart.in/images/categories/${category.slug}-131022.svg`}
              // alt={category.name}
              // className="mb-2"
            />
            <h2 className="font-bold mb-2">{category.name}</h2>
            {/* <ul className="space-y-1 mb-4 font-extralight">
              {renderSubcategories(category._id)}
            </ul> */}
          </div>
        ));
    };

    return (
        <div className="flex w-full py-10 flex-col md:flex-row">
            {/* Sidebar */}
            <div className="md:w-1/4 px-20 py-5">
                <ul className="space-y-4">
                    {/* {[
                        "Woman’s Fashion",
                        "Men’s Fashion",
                        "Electronics",
                        "Home & Lifestyle",
                        "Medicine",
                        "Sports & Outdoor",
                        "Baby’s & Toys",
                        "Groceries & Pets",
                        "Health & Beauty",
                    ] */}
                    {
                    categories.filter((item) => item.level === 1 || item.level === 2 ).slice(0,10)
                    .map((item, index) => ( 
                        <li
                            key={index}
                            className={item.level === 1 ? catclassesborder : catclasses}
                            onClick={()=> handlerCategoryClick(item)}
                        >
                            {item.name}
                            {(item === "Woman’s Fashion" || item === "Men’s Fashion" || item === "Electronics") && (
                                <FontAwesomeIcon
                                    icon={faChevronRight}
                                    className="ml-7"
                                    style={{ color: "#FFA900" }}
                                />
                            )}
                            
                        </li>
                    ))}
                </ul>
            </div>

            {/* Main Content */}
            <div  className="flex flex-grow m-10 mx-2 sm:mx-5 relative text-black rounded-lg shadow-lg p-8 items-center justify-center">
            
            <div key={currentIndex} className="w-full p-4 rounded-md">
            {/* <div className="text-center z-10">
                    <button className="mt-4 px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-200">
                        Shop Now →
                    </button>
            </div> */}
            <div className="absolute inset-0 right-0 z-0">
            <Link to={`/product/${advertisement?.product?._id}`}>
                <img
                    src={advertisement?.imageUrl}
                    alt={advertisement?.title}
                    className="w-full h-full object-cover rounded-lg"
                />
            </Link>
            </div>
        </div>
            </div>
        </div>
    );
}

export default AdvertismentFinal;
