import React from 'react';

const Trackdetail = ({ closeModal, product }) => {
  const { images, name, price, trackingInfo } = product;

  return (
    <div className="flex justify-center items-center h-screen ">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        {/* Product Info */}
        <div className="flex items-start space-x-4">
          {Array.isArray(images) ? (
            <div className="flex space-x-2">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Product ${index + 1}`}
                  className="w-16 h-16 object-cover rounded-md"
                />
              ))}
            </div>
          ) : (
            <img
              src={images}
              alt="Product"
              className="w-16 h-16 object-cover rounded-md"
            />
          )}
          <div>
            <h2 className="text-lg font-semibold">{name}</h2>
            <p className="text-gray-500">₹{price}</p>
          </div>
        </div>

        {/* Tracking Status */}
        <div className="mt-6 border-l-2 border-gray-300 h-auto">
          {trackingInfo.map((step, index) => (
            <div key={index} className="flex items-center mb-4">
              <div
                className={`w-3 h-3 ml-[-6px] rounded-full ${
                  step.completed ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                {step.completed && (
                  <svg
                    className="w-4 h-4 text-white "
                    fill="none"
                    viewBox="0 0 28 28"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div className="ml-2 text-gray-700">
                <p className="mt-[-2px]">{step.status}</p>
                <p className="text-sm text-gray-500">{step.date}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={closeModal}
            className="bg-gradient-to-t from-red-400 to-red-600 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
          >
            Cancel
          </button>
          <button className="bg-gradient-to-t from-cyan-400 to-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Need Help?
          </button>
        </div>
      </div>
    </div>
  );
};

export default Trackdetail;
