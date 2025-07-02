import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCoupons } from '../../../Redux/Coupons/couponSlice';
import { FaClipboard, FaEye } from 'react-icons/fa';

const Coupons = () => {
  const dispatch = useDispatch();
  const { coupons, status, error } = useSelector((state) => state.coupons);
  const [visibleCoupons, setVisibleCoupons] = useState({});

  useEffect(() => {
    dispatch(fetchCoupons());
  }, [dispatch]);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    alert(`Copied: ${code}`);
  };

  const handleShow = (id) => {
    setVisibleCoupons((prev) => ({ ...prev, [id]: true }));
  };

  if (status === 'loading') return <div>Loading...</div>;

  const errorMessage = error && typeof error === 'object' ? error.message : error;
  if (errorMessage) return <div>Error: {errorMessage}</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Available Coupons</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map(coupon => (
          <div key={coupon._id} className="bg-white rounded-lg shadow-lg p-6 relative border border-blue-300 hover:shadow-xl transition-all duration-300">
            <div className="text-center">
              <h2 className="text-3xl font-semibold text-blue-600">
                {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `$${coupon.discountValue} OFF`}
              </h2>
              {visibleCoupons[coupon._id] ? (
                <div className="mt-4">
                  <p className="text-lg font-medium opacity-100 transition-opacity duration-500">
                    Coupon Code: <span className="font-bold text-green-500">{coupon.code}</span>
                  </p>
                  <button 
                    className="mt-3 bg-blue-500 text-white rounded px-3 py-1 hover:bg-blue-600 transition"
                    onClick={() => handleCopy(coupon.code)}
                  >
                    Copy <FaClipboard className="inline ml-1" />
                  </button>
                </div>
              ) : (
                <button 
                  className="bg-blue-500 text-white rounded px-3 py-1 mt-2 hover:bg-blue-600 transition"
                  onClick={() => handleShow(coupon._id)}
                >
                  Show <FaEye className="inline ml-1" />
                </button>
              )}
            </div>
            <p className="text-yellow-500 mt-4">Valid Until: <strong>{new Date(coupon.expirationDate).toLocaleDateString()}</strong></p>
            <p className="text-gray-700 mt-2">Discount Type: <strong>{coupon.discountType}</strong></p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Coupons;
