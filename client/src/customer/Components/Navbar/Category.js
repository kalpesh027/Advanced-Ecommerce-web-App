import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { fetchCategories } from "../../../Redux/Category/categoriesSlice";
import { CategoryCard } from "./category-card";
import Navbar from "./Navbar";

export default function CategoryPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.categories);

  useEffect(() => {
    dispatch(fetchCategories())
      .unwrap()
      .then(() => {
        toast.success("Categories loaded successfully!");
      })
      .catch((error) => {
        toast.error(`Failed to load categories: ${error.message}`);
      });
  }, [dispatch]);

  const handleNavigate = (path) => {
    navigate(path);
  };

  // Get only parent categories (those with no parent or level 0)
  const parentCategories = categories.filter(
    (category) => !category.parentCategory || category.level === 0
  );

  // Create a map of categories with their subcategories
  const categoriesWithSubs = parentCategories.map((category) => ({
    ...category,
    subcategories: categories.filter(
      (subcat) => subcat.parentCategory?._id === category._id
    ),
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-6 relative">
        <button
          onClick={() => handleNavigate("/")}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-800 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
          aria-label="Close"
        >
          <span className="text-2xl">&times;</span>
        </button>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categoriesWithSubs.length > 0 ? (
            categoriesWithSubs.map((category) => (
              <CategoryCard
                key={category._id}
                category={category}
                onNavigate={handleNavigate}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-gray-500">
              No categories available.
            </div>
          )}
        </div>
      </div>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

