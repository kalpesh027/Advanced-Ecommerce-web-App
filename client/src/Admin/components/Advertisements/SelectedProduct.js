import React from "react";

const SelectedProduct = ({ selectedProduct, handleChange, handleSave,handlemodalclose,handleFileChange,imagearea }) => {
    
    return (
        <>
            <div className="flex items-center py-2 px-4 bg-gray-100 rounded-md">
                <img src={selectedProduct.imageUrl} alt={selectedProduct.title} className="w-12 h-12 object-cover rounded-full mr-4" />
                <div>
                    <h3 className="text-lg font-semibold">{selectedProduct.title}</h3>
                </div>
            </div>
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                    type="text"
                    name="title"
                    value={selectedProduct.title}
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
            </div>
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                    name="description"
                    value={selectedProduct.description}
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
            </div>
            <div className="pt-5 pb-5">
             {imagearea}
            </div>
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                    type="date"
                    name="startDate"
                    value={selectedProduct.startDate}
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
            </div>
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                    type="date"
                    name="endDate"
                    value={selectedProduct.endDate}
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                />
            </div>
            
            <div className='flex justify-center gap-5 '>
                <button
                    className="mt-6 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    onClick={handleSave}
                >
                    Save
                </button>
                <button
                    className="mt-6 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    onClick={handlemodalclose}
                >
                    Cancel
                </button>
            </div>
        </>
    );
};

export default SelectedProduct;