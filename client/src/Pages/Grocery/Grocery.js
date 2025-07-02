import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../Redux/Category/categoriesSlice";
import { fetchProducts } from "../../Redux/Product/productSlice";
import Navbar from "../../customer/Components/Navbar/Navbar";
import MobileNavbar from "../../customer/Components/Navbar/MobileNavbar";

// The ProductCard component to display individual product
function ProductCard({ product }) {
  const navigate = useNavigate(); // Hook for navigation

  // Fetch the first image from the product.imageUrl array
  const imageUrl = product.imageUrl && product.imageUrl.length > 0 ? product.imageUrl[0] : 'default-image-url.jpg';

  return (
    <div 
      onClick={() => navigate(`/product/${product._id}`)} // Redirect to product detail page on click
      className="p-2 md:p-4 rounded-lg shadow-lg cursor-pointer" // Added cursor-pointer for visual indication
    >
      <div className="relative w-full h-40 sm:h-48 md:h-40 flex items-center justify-center border-2 border-gray-300 rounded-lg overflow-hidden">
        <img
          src={imageUrl} // Display the first image from the imageUrl array
          alt={product.name}
          className="w-full h-full object-contain"
        />
      </div>
      <h3 className="text-sm sm:text-base md:text-lg font-semibold text-center md:text-left">
        {product.title}
      </h3>
      <div className="text-base sm:text-lg md:text-base font-bold text-green-600 text-center md:text-left">
        Apala Bajar Price ₹{product.discountedPrice}
      </div>
      <div className="text-sm sm:text-base md:text-base text-gray-500 line-through text-center md:text-left">
        ₹{product.price}
      </div>
    </div>
  );
}

// The SideBar component for filtering categories
function SideBar({ showall, filteredProducts, setShowAll, sidebarDairy, title, setActiveTab, setActivel1Tab, activeTab, setActiveSubTab }) {
  const [toggleBar, setToggleBar] = useState(true);

  return (
    <div className="max-h-screen sticky m-2 pr-2 py-2 top-0 w-fit border-2 shadow-lg border-orange-200">
      <div
        onClick={() => setToggleBar(!toggleBar)}
        className="bg-white/40 border-b-2 border-orange-900 h-10 ml-4 w-fit backdrop-blur-lg flex gap-2 items-center scale-110 px-4 py-2 rounded-full shadow-md"
      >
        <h2
          onClick={() => {
            setActiveTab("");
            setActiveSubTab("");
            setActivel1Tab("");
          }}
        >
          {title}
        </h2>
      </div>
      <div className={`${toggleBar ? "hidden" : ""} backdrop-blur-lg lg:static lg:block ml-4 lg:w-fit mt-3 text-sm space-y-3`}>
        {sidebarDairy.map((item) => (
          <div
            key={item.name}
            onClick={(e) => {
              setActiveTab(item.name);
              filteredProducts(e, item.name);
              setShowAll(showall);
            }}
            className="flex flex-col px-2 hover:bg-gray-50/95 transition-all py-1 max-w-fit cursor-pointer"
          >
            <h2 className={`${activeTab === item.name ? showall ? "border-b-2 backdrop-blur-lg border-orange-700 p-2" : "" : ""}`}>
              {item.name}
            </h2>
            {activeTab === item.name && (
              <div className="w-fit px-2 whitespace-nowrap transition-all">
                {item.subCatog.map((subCat, i) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      setActiveSubTab(subCat);
                      filteredProducts(e, subCat);
                      setActivel1Tab("");
                    }}
                    className="flex my-3 px-2 hover:text-orange-600"
                  >
                    {subCat}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// The main Grocery component
function Grocery() {
  const { main, sub } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.categories) || [];
  const status = useSelector((state) => state.categories.status);
  const products = useSelector((state) => state.products.products);
  const prodstatus = useSelector((state) => state.products.prodstatus);

  const [filteredProduct, setFilteredProduct] = useState([]);
  const [filteredlevel0Products, setfilteredlevel0Products] = useState([]);
  const [filteredlevel1Products, setfilteredlevel1Products] = useState([]);
  const [showall, setShowAll] = useState(true);
  const [activeTab, setActiveTab] = useState("");
  const [activel1Tab, setActivel1Tab] = useState("");
  const [activeSubTab, setActiveSubTab] = useState("");
  const [viewport, setViewport] = useState(false);

  // Handle viewport resize for mobile view
  useEffect(() => {
    const updateViewport = () => setViewport(window.innerWidth < 620);
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  // Fetch categories and products
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCategories());
    }
  }, [status, dispatch]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Filter products based on category or subcategory
  const filteredProducts = (e, cate) => {
    if (cate) {
      e.stopPropagation();
      const filtered = products.filter((product) => product?.category?.name?.toLowerCase().includes(cate.toLowerCase()));
      setFilteredProduct(filtered);
    } else if (sub) {
      const filtered = products.filter((product) => product.category._id === sub);
      setFilteredProduct(filtered);
    }
  };

  const sidebarDairy = [];
  const parent = categories.find((e) => e._id === main);

  if (parent) {
    const level1 = [parent];
    const level2 = level1.map((x) => categories.filter((e) => e.parentCategory && e.parentCategory._id === x._id));
    const level3 = level2[0] || [];
    level3.forEach((x) => {
      sidebarDairy.push({
        name: x.name,
        subCatog: categories.filter((e) => e.parentCategory && e.parentCategory._id === x._id).map((e) => e.name),
      });
    });
  }

  useEffect(() => {
    const filteredl0Products = [];
    sidebarDairy.forEach((item) => {
      const filtered = products.filter((product) =>
        item.subCatog.some((subcat) => subcat.toLowerCase() === product.category?.name.toLowerCase())
      );
      filteredl0Products.push(...filtered);
    });
    setfilteredlevel0Products(filteredl0Products);
  }, [parent, products, sidebarDairy]);

  useEffect(() => {
    let filteredl1Products = [];
    const activeElement = sidebarDairy?.find((item) => item?.name.toLowerCase() === activel1Tab.toLowerCase());
    if (activeElement) {
      filteredl1Products = products.filter((product) =>
        activeElement.subCatog.some((subcat) => subcat.toLowerCase() === product.category?.name.toLowerCase())
      );
    }
    setfilteredlevel1Products(filteredl1Products);
  }, [activel1Tab, sidebarDairy, products]);

  if (prodstatus === "loading") return <div>Loading...</div>;
  if (prodstatus === "failed") return <div>Error fetching products</div>;

  return (
    <div>
       <Navbar />
      <div className="flex flex-col lg:flex-row font-semibold">
        {parent && (
          <SideBar
            showall={showall}
            setShowAll={setShowAll}
            setActiveSubTab={setActiveSubTab}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
            title={parent.name}
            sidebarDairy={sidebarDairy}
            setActivel1Tab={setActivel1Tab}
            filteredProducts={filteredProducts}
          />
        )}
        <div className="p-10 w-full overflow-hidden">
          {!activeTab && (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              {filteredlevel0Products?.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
          {activel1Tab && (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              {filteredlevel1Products?.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
          {sidebarDairy.some((e) => e.name.toLowerCase() === activeTab.toLowerCase()) && (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              {filteredProduct.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Grocery;
