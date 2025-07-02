import React, { useState, useEffect } from 'react';
import { createAdvertisement, fetchAdvertisements, deleteAdvertisement } from '../../../Redux/Advertisements/advertisementSlice';
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';




export default function HeroSection({advertisements, status, filteredProducts, searchstatus,handleSave,handlePublish,handlemodalclose,searchTerm,setSearchTerm,activeTab,handleChange,selectedProduct,SelectedProduct, isModalOpen,setIsModalOpen, handleDeleteAdvertisement, handleProductSelect}){

    const [imagePreview, setImagePreview] = useState(null);
    const dispatch = useDispatch();
    console.log("these are advertisements: ", advertisements);


    const [form, setForm] = useState({
        title: 'banner',
        imageUrl: null,
        section : "Section 0"

    });


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setForm((prevForm) => ({ ...prevForm, image: file }));
        setImagePreview(URL.createObjectURL(file));
    };

    const handleheroChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({ ...prevForm, [name]: value }));
    };



    const handleupload = (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (const key in form) {
          formData.append(key, form[key]);
        }
        console.log("herosection formdata: ",formData);
        for (const [key, value] of formData.entries()) {
            console.log(key, value);
        }
        dispatch(createAdvertisement(formData)).then((response) => {
            if (response.error) {
              toast.error('Failed to create Advertisement');
              setIsModalOpen(false);
            } else {
              toast.success('Advertisement created successfully');
              dispatch(fetchAdvertisements());
              setImagePreview(null);
              setIsModalOpen(false);
            }
          });


    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (const key in form) {
          formData.append(key, form[key]);
        }
        dispatch(createAdvertisement(formData)).then((response) => {
          if (response.error) {
            toast.error('Failed to create product');
          } else {
            toast.success('Product created successfully');
            dispatch(fetchAdvertisements());
            // Navigate to products page after a short delay to show toast
            // setTimeout(() => {
            //   window.location.href = '/admin/products';
            // }, 2000);
          }
        });
      };

      const imagearea = (imagePreview,handleFileChange) => {
        return (
          <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center p-10 w-full h-44 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 relative">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {imagePreview ? (
                      <div className="m-auto">
                          <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover rounded-md shadow-md" />
                      </div>
                  ) : (
                      <>
                          <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                          </svg>
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span></p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                      </>
                  )}
              </div>
              <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} />
          </label>
        );
      }






    return (
        <div className='m-10 mt-8 ml-0 mr-0 w-auto  md:grid max-md:flex max-md:flex-col max-md:flex-col-reverse md:grid-cols-2 gap-20'>

            <div className=' flex flex-col scroll-smooth'>
            
            {status === "succeeded" && (
                advertisements.length > 0 ? (
                    advertisements
                        .filter(publishedAdvertisement => publishedAdvertisement.section === activeTab)
                        .map((publishedAdvertisement,index) => (
                            <div className="flex justify-center mb-4" >
                            <div class="w-80  bg-white border border-gray-200 rounded-lg shadow" key={publishedAdvertisement.id}>
                                <a href="#">
                                    <img class="rounded-t-lg" src={publishedAdvertisement.imageUrl} alt="" />
                                </a>
                                <div class="p-5 flex justify-around">
                                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">Banner {index+1} </h5>
                                    <div onClick={(e) => handleDeleteAdvertisement(publishedAdvertisement._id, e)} class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
                                        Delete
                                    </div>
                                </div>
                            </div>
                            </div>
                        ))
                ) : (
                    <h2>NO BANNER PUBLISHED!</h2>
                )
            )}  
            </div>   


            {/* <div className="flex flex-col items-center justify-self-center w-fit relative">
            <h2 className="text-xl font-bold">Add your Banners for Hero Section here!</h2>
            <input
                type="text"
                className="w-full m-4 p-2 border rounded-md"
                placeholder="Search product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchstatus === 'loading' && <p>Loading products...</p>}
            {searchstatus === 'failed' && <p>Error fetching products</p>}
            {filteredProducts.length > 0 && (
                <ul className="absolute mt-4 max-h-60 overflow-y-auto z-40 divide-y divide-gray-200 bg-white rounded-md shadow-lg top-24 w-full">
                    {filteredProducts.map((product) => (
                        <li
                            key={product._id}
                            className="flex items-center py-2 px-4 cursor-pointer hover:bg-gray-100"
                            onClick={() => handleProductSelect(product)}
                        >
                            <img src={product.imageUrl} alt={product.title} className="w-12 h-12 object-cover rounded-full mr-4" />
                            <div>
                                <h3 className="text-lg font-semibold">{product.title}</h3>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {filteredProducts.length === 0 && searchTerm && (
                <p className="mt-4 text-sm text-gray-500">No products found</p>
            )}
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 relative">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {imagePreview ? (
                        <div className="m-auto">
                            <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover rounded-md shadow-md" />
                        </div>
                    ) : (
                        <>
                            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span></p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                        </>
                    )}
                </div>
                <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} />
            </label>
            <button type="button" onClick={handleupload} className="text-blue-700 mt-4 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                Publish
            </button>
        </div> */}
        <div className='flex flex-col m-10 mt-0 mb-0'>
                    <h2 className="text-lg font-semibold mb-4">Search Product for Advertisement</h2>
                    <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        placeholder="Search product..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {status === 'loading' && <p>Loading products...</p>}
                    {status === 'failed' && <p>Error fetching products</p>}
                    {filteredProducts.length > 0 && (
                        <ul className="mt-4 max-h-60 overflow-y-auto divide-y divide-gray-200 bg-white rounded-md shadow-lg">
                            {filteredProducts.map((product) => (
                                <li
                                    key={product._id}
                                    className="flex items-center py-2 px-4 cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleProductSelect(product)}
                                >
                                    <img src={product.imageUrl} alt={product.title} className="w-12 h-12 object-cover rounded-full mr-4" />
                                    <div>
                                        <h3 className="text-lg font-semibold">{product.title}</h3>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                    {filteredProducts.length === 0 && searchTerm && (
                        <p className="mt-4 text-sm text-gray-500">No products found</p>
                    )}

                    {selectedProduct && (
                        <div className="mt-8">
                            {isModalOpen && (
                                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                                        <button
                                            className="absolute top-0 right-0 mt-4 mr-4 text-gray-600 hover:text-gray-900"
                                            onClick={() => setIsModalOpen(false)}
                                        >
                                            &times;
                                        </button>
                                        <SelectedProduct
                                            selectedProduct={selectedProduct}
                                            handleChange={handleheroChange}
                                            handleSave={handleupload}
                                            handlePublish={handlePublish}
                                            handlemodalclose = {handlemodalclose}
                                            handleFileChange = {handleFileChange}
                                            imagearea = {imagearea(imagePreview,handleFileChange)}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                    )}
                </div>
        
        
        </div>
        
    );

}