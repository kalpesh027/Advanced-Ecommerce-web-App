import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../Redux/Product/productSlice";
import Navbar from "../customer/Components/Navbar/Navbar.js";
import ProductCard from "../customer/Components/Products/Cards.js";

const SearchResults = () => {
  const { name } = useParams();
  const dispatch = useDispatch();

  const { products = [], status } = useSelector((state) => state.products);


  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Error fetching products</div>;
  }

  const filteredProducts = products.filter((product) => {
    const titleMatch = product?.title?.toLowerCase().includes(name?.toLowerCase());
    const categoryMatch = product?.category?.name?.toLowerCase().includes(name?.toLowerCase());
    const brandMatch = product?.brand?.toLowerCase().includes(name?.toLowerCase());
    return titleMatch || categoryMatch || brandMatch;
  });

  console.log("name",name,"filteredProducts",filteredProducts)

  return (
    <>
      <Navbar />
      <div className="p-4">
        <h2 className="text-2xl font-semibold">Search results</h2>
        <p className="text-muted-foreground">
          Showing results for <span className="font-semibold">"{name}"</span>.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </>
  );
};

export default SearchResults;
