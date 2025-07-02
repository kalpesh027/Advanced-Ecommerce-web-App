import React from 'react';
import { FaTimes } from 'react-icons/fa';

const OrderDetailsPopup = ({ order, onClose }) => {
  console.log("order details",order)
  console.log("order items",order.orderItems)
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-3xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Order Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={24} />
          </button>
        </div>
        <div>
          <div className="flex items-center space-x-4 mb-4">
            <img src={order.orderItems[0]?.product?.imageUrl[0] || 'https://placehold.co/80x80'} alt="product" className="w-20 h-20" />
            <div>
              <h3 className="text-xl font-semibold">{order.orderItems[0]?.product?.title || 'Unknown Product'}</h3>
              <p>Order ID: {order._id}</p>
              <p>Total Price: {order.totalPrice}</p>
              <p>Quantity: {order.orderItems.length}</p>
              <p>Payment Method: {order.paymentDetails.paymentMethod}</p>
              <p>Status: {order.orderStatus}</p>
              <p>Tracking ID: {order.trackingId || 'N/A'}</p>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-2">Order Items:</h4>
            <ul>
              {order.orderItems.map((item) => (
                <li key={item._id} className="mb-2">
                  {item.product?.title || "null" } x {item.quantity}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPopup;
