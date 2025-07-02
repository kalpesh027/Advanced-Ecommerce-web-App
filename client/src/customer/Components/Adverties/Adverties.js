

import React from 'react';
import { Link } from 'react-router-dom';

const Gadgets = ({section3title, advertisements, status }) => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">{section3title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {advertisements
          .filter((advertisement) => advertisement.section === "Section 3")
          .slice(0, 2)
          .map((advertisement, index) => (
            <div
              key={index}
              className={`w-full md:w-${index === 0 ? '1/2' : '1/2'} lg:w-${index === 0 ? '1/3' : '2/3'} p-4`}
            >
              <div className="bg-white border rounded-lg shadow-lg overflow-hidden transform hover:shadow-xl transition-shadow duration-300">
                <Link to={`/product/${advertisement.product?._id}`}>
                  <div className="relative">
                    <img
                      src={advertisement.imageUrl}
                      alt={advertisement.title}
                      className="w-full h-72 object-cover sm:h-[400px] lg:h-[500px] transition-transform duration-500 ease-in-out hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <span className="text-white text-2xl font-semibold">View Details</span>
                    </div>
                  </div>
                </Link>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{advertisement.title}</h3>
                  <p className="text-green-600 text-sm mb-4">{advertisement.description}</p>
                  <Link
                    to={`/product/${advertisement.product?._id}`}
                    className="inline-block px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors duration-300"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Gadgets;
