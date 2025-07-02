import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
import { fetchCategories } from '../../../Redux/Category/categoriesSlice';
import { useDispatch, useSelector } from 'react-redux';

const UpdateProductModal = ({ product, onClose, onUpdate }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    title: product.title || '',
    description: product.description || '',
    price: product.price || '',
    discountedPrice: product.discountedPrice || '',
    discountPercent: product.discountPercent || '',
    quantity: product.quantity || '',
    brand: product.brand || '',
    category:(!product.category) ? '' :  product.category ,
    imageUrl: null,
  });

  const categories = useSelector((state) => state.categories.categories);
  const loadingCategories = useSelector((state) => state.categories.loading);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (product.category && categories.length) {
      const matchedCategory = categories.find((cat) => cat._id === product.category._id);
      if (matchedCategory) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          category: matchedCategory._id,
        }));
      }
    }
  }, [categories, product.category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, imageUrl: file });
  };

  const handleDescriptionChange = (value) => {
    setFormData({ ...formData, description: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = new FormData();
    for (const key in formData) {
      updatedData.append(key, formData[key]);
    }
    onUpdate(updatedData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 overflow-auto">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-xl w-full h-auto max-h-screen overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Update Product</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            className="block w-full mb-2 p-2 border border-gray-300 rounded"
          />
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <ReactQuill
              value={formData.description}
              onChange={handleDescriptionChange}
              className="mb-2"
              theme="snow"
              placeholder="Description"
            />
          </div>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            className="block w-full mb-2 p-2 border border-gray-300 rounded"
          />
          <input
            type="number"
            name="discountedPrice"
            value={formData.discountedPrice}
            onChange={handleChange}
            placeholder="Discounted Price"
            className="block w-full mb-2 p-2 border border-gray-300 rounded"
          />
          <input
            type="number"
            name="discountPercent"
            value={formData.discountPercent}
            onChange={handleChange}
            placeholder="Discount Percent"
            className="block w-full mb-2 p-2 border border-gray-300 rounded"
          />
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Quantity"
            className="block w-full mb-2 p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder="Brand"
            className="block w-full mb-2 p-2 border border-gray-300 rounded"
          />
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Category <span className="text-destructive">*</span></label>
            {loadingCategories ? (
              <p>Loading categories...</p>
            ) : (
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="block w-full mb-2 p-2 border border-gray-300 rounded"
                required
              >
                <option value="">Choose category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>{category.name}</option>
                ))}
              </select>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">Image</label>
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              className="block w-full mb-2 p-2 border border-gray-300 rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Update
          </button>
          <button
            type="button"
            onClick={onClose}
            className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProductModal;



// import React, { useEffect, useState } from 'react';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css'; // import styles
// import { fetchCategories } from '../../../Redux/Category/categoriesSlice';
// import { useDispatch, useSelector } from 'react-redux';

// const UpdateProductModal = ({ product, onClose, onUpdate }) => {
//   const [formData, setFormData] = useState({
//     title: product.title || '',
//     description: product.description || '',
//     price: product.price || '',
//     discountedPrice: product.discountedPrice || '',
//     discountPercent: product.discountPercent || '',
//     quantity: product.quantity || '',
//     brand: product.brand || '',
//     category:(!product.category) ? '' :  product.category ,
    
//     imageUrl: null, // Changed from imageUrl to image for file upload
//   });
//   const dispatch = useDispatch();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setFormData({ ...formData, image: file });
//   };

//   const handleDescriptionChange = (value) => {
//     setFormData({ ...formData, description: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const updatedData = new FormData();
//     for (const key in formData) {
//       updatedData.append(key, formData[key]);
//     }
//     onUpdate(updatedData);
//   };
//   const categories = useSelector((state) => state.categories.categories);

//   useEffect(() => {
//     dispatch(fetchCategories());
//   }, [dispatch]);

//   return (
//     <div className="fixed inset-0 flex items-center  justify-center z-50 overflow-auto">
//       <div className="bg-white p-6 rounded-lg shadow-xl max-w-xl w-full h-auto max-h-screen overflow-y-auto">
//         <h2 className="text-xl font-semibold mb-4">Update Product</h2>
//         <form onSubmit={handleSubmit}>
//           <input
//             type="text"
//             name="title"
//             value={formData.title}
//             onChange={handleChange}
//             placeholder="Title"
//             className="block w-full mb-2 p-2 border border-gray-300 rounded"
//           />
//           <div className="mb-4">
//             <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description</label>
//             <ReactQuill
//               value={formData.description}
//               onChange={handleDescriptionChange}
//               className="mb-2"
//               theme="snow"
//               placeholder="Description"
//             />
//           </div>
//           <input
//             type="number"
//             name="price"
//             value={formData.price}
//             onChange={handleChange}
//             placeholder="Price"
//             className="block w-full mb-2 p-2 border border-gray-300 rounded"
//           />
//           <input
//             type="number"
//             name="discountedPrice"
//             value={formData.discountedPrice}
//             onChange={handleChange}
//             placeholder="Discounted Price"
//             className="block w-full mb-2 p-2 border border-gray-300 rounded"
//           />
//           <input
//             type="number"
//             name="discountPercent"
//             value={formData.discountPercent}
//             onChange={handleChange}
//             placeholder="Discount Percent"
//             className="block w-full mb-2 p-2 border border-gray-300 rounded"
//           />
//           <input
//             type="number"
//             name="quantity"
//             value={formData.quantity}
//             onChange={handleChange}
//             placeholder="Quantity"
//             className="block w-full mb-2 p-2 border border-gray-300 rounded"
//           />
//           <input
//             type="text"
//             name="brand"
//             value={formData.brand}
//             onChange={handleChange}
//             placeholder="Brand"
//             className="block w-full mb-2 p-2 border border-gray-300 rounded"
//           />
//             <div>
//               <label htmlFor="category"  className="block w-full mb-2 p-2 border border-gray-300 rounded"
//               >Category <span className="text-destructive">*</span></label>
//               <select id="category" name="category" value={formData.category} onChange={handleChange}             className="block w-full mb-2 p-2 border border-gray-300 rounded"
//  required>
//                 <option value="">Choose category</option>
//                 {categories.map((category) => (
//                   <option key={category._id} value={category._id}>{category.name}</option>
//                 ))}
//               </select>
//             </div>
           
//           {/* <input
//             type="text"
//             name="category"
//             value={formData.category}
//             onChange={handleChange}
//             placeholder="Category"
//             className="block w-full mb-2 p-2 border border-gray-300 rounded"
//           /> */}
//           <div className="mb-4">
//             <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">Image</label>
//             <input
//               type="file"
//               name="image"
//               onChange={handleFileChange}
//               className="block w-full mb-2 p-2 border border-gray-300 rounded"
//             />
//           </div>
//           <button
//             type="submit"
//             className="bg-blue-500 text-white px-4 py-2 rounded"
//           >
//             Update
//           </button>
//           <button
//             type="button"
//             onClick={onClose}
//             className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
//           >
//             Cancel
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default UpdateProductModal;