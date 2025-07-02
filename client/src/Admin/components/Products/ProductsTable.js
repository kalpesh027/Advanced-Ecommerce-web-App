import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, deleteProduct, updateProduct } from "../../../Redux/Product/productSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UpdateProductModal from "./UpdateProductModal"; // Import the modal component
import Papa from 'papaparse'; // Import PapaParse for CSV parsing

const ProductTable = () => {
  const dispatch = useDispatch();
  const productsState = useSelector((state) => state.products);
  const { products, status } = productsState || {};

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [csvData, setCsvData] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    // Update filtered products when the products state or csvData changes
    if (csvData.length > 0) {
      const csvTitles = csvData.map(row => row[0]); // Assuming the product names are in the first column of CSV
      const filtered = products.filter(product => csvTitles.includes(product.title));
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [csvData, products]);

  const handleDelete = (productId) => {
    dispatch(deleteProduct(productId)).then((response) => {
      if (response.error) {
        toast.error("Failed to delete product");
      } else {
        toast.success("Product deleted successfully");
      }
    });
  };

  const handleUpdate = (product) => {
    setSelectedProduct(product);
    setShowUpdateModal(true);
  };

  const closeUpdateModal = () => {
    setShowUpdateModal(false);
    setSelectedProduct(null);
  };

  const updateProductHandler = async (updatedProductData) => {
    dispatch(updateProduct({ id: selectedProduct._id, productData: updatedProductData }))
      .then((response) => {
        if (response.error) {
          toast.error("Failed to update product");
        } else {
          toast.success("Product updated successfully");
          closeUpdateModal();
        }
      });
    window.location.reload();
  };

  // Function to truncate description
  const truncateDescription = (text, wordLimit) => {
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  // Get current products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);


  console.log("all products", currentProducts)


  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle CSV file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: false, // Do not treat the first row as header
        complete: (results) => {
          console.log(results.data); // Data from the CSV
          setCsvData(results.data); // Update the state with CSV data
        }
      });
    }
  };

  const [search, setSearch] = useState()

  const filterDataFn = () => {
    // Get current products with search functionality

    try{
    const filteredProducts = products.filter(product =>
      (product.title && product.title.toLowerCase().includes(search.toLowerCase())) ||
      (product._id && product._id.toLowerCase().includes(search.toLowerCase())) ||
      (product.BarCode && product.BarCode.toLowerCase().includes(search.toLowerCase())) ||
      (product.slug && product.slug.toLowerCase().includes(search.toLowerCase())) ||
      (product.category && product.category.name && product.category.name.toLowerCase().includes(search.toLowerCase()))
    );
    setFilteredProducts(filteredProducts)
  }
  catch(e){
    console.log("error while searching ", e)
  }

    console.log("filteredProducts", filteredProducts)
  }





  useEffect(() => {
    filterDataFn();
  }, [search]);

  return (
    <div className="p-4 bg-card text-card-foreground rounded-lg max-w-full mx-auto overflow-x-auto">
      <ToastContainer />
      <input
        type="text"
        placeholder="Search essentials, groceries and more..."
        className="bg-white w-full border-none focus:outline text-xs"
        onChange={(e) => {
          setSearch(e.target.value)
          setCurrentPage(1)

        }}

        required
        value={search}
      />
      <h1 className="text-2xl font-semibold mb-4">All Grocery Products</h1>
      {/* Add the file input for CSV upload */}
      <input type="file" accept=".csv" onChange={handleFileUpload} className="mb-4" />
      {/* Render CSV Data */}
      {csvData.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">CSV Data</h2>
          <table className="min-w-full divide-y divide-gray-200 table-fixed text-xs md:text-sm">
            <thead className="bg-gray-50">
              <tr>
                {csvData[0].map((_, index) => (
                  <th key={index} className="px-6 py-3 text-left text-gray-500 uppercase tracking-wider">
                    Column {index + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {csvData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-6 py-4 whitespace-nowrap">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {status === "loading" ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="overflow-x-auto border-b border-blue-200 shadow sm:rounded-lg lg:w-[80vw] w-[550px] self-center">
            <table className="min-w-full divide-y divide-gray-200 table-auto text-xs md:text-sm ">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Discounted Price
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Discount Percent
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentProducts && currentProducts.length > 0 ? (
                  currentProducts.map((product) => (
                    <tr key={product._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={product.imageUrl[0] || "default-image-url.jpg"} // Fetch the first image or a default one
                          alt={product.title}
                          className="h-12 w-12 md:h-16 md:w-16 object-cover"
                        />
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">{product.title}</td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        {product.description ? truncateDescription(product.description, 15) : "None"}
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        {product.category?.name || "No Category"}
                      </td>

                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">{product.price}</td>

                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">{product.discountedPrice}</td>

                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">{product.discountPercent}%</td>

                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">{product.quantity > 0 ? product.quantity : 'N/A'}</td>

                      <td className="px-4 md:px-6 py-4 whitespace-nowrap flex space-x-2 my-4">

                        <button onClick={() => handleUpdate(product)} className="bg-transparent text-green-500 px-4 py-2 rounded hover:bg-green-500 hover:text-white transition duration-300"  >
                          Edit
                        </button>
                        <button onClick={() => handleDelete(product._id)} className="bg-transparent text-red-500 px-4 py-2 rounded hover:bg-red-500 hover:text-white transition duration-300">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="px-6 py-4 text-center">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex justify-center mt-4 w-full">
            {[...Array(Math.ceil(filteredProducts.length / productsPerPage)).keys()].map((pageNumber) => (
              <button
                key={pageNumber + 1}
                className={`px-2 md:px-3 py-1 border rounded-md mx-1 ${currentPage === pageNumber + 1 ? "bg-blue-500 text-white" : "text-zinc-600 hover:bg-zinc-200"} transition duration-300`}
                onClick={() => paginate(pageNumber + 1)}
              >
                {pageNumber + 1}
              </button>
            ))}
          </div>
        </>
      )}
      {showUpdateModal && (
        <UpdateProductModal
          product={selectedProduct}
          onClose={closeUpdateModal}
          onUpdate={updateProductHandler}
        />
      )}
    </div>
  );
};

export default ProductTable;
