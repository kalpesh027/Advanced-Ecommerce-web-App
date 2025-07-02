import React from 'react';
import { Link } from 'react-router-dom';

const Gadgets = ({section4title, advertisements, status }) => {
  return (
    <div className="p-8 bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">{section4title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {advertisements
          .filter((advertisement) => advertisement.section === "Section 4")
          .slice(0, 3)
          .map((advertisement, index) => (
            <Link key={index} to={`/product/${advertisement.product?._id}`}>
              <div className="relative bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <div className="overflow-hidden">
                <img
                  src={advertisement.imageUrl}
                  alt={advertisement.title}
                  className="w-full h-64 object-contain transition-transform duration-300 ease-in-out hover:scale-105"
                />

                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">{advertisement.title}</h3>
                  <p className="text-gray-500 text-sm">{advertisement.discount}</p>
                </div>
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold py-1 px-3 rounded-full shadow-md">
                  Sponsored
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default Gadgets;
