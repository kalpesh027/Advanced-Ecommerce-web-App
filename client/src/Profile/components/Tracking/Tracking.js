import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, cancelOrder } from "../../../Redux/Order/orderSlice";
import axiosInstance from "../../../axiosConfig";
import ProgressTracker from "./Progress";
import StarRating from "./Star";
import Trackdetail from "./Trackdetail";
import Cancelorder from "./Cancel";
import arrow from "./arrow.png";
import {
  Package,
  Truck,
  X,
  CreditCard,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

export default function OrderTrackingPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { currorder } = location.state || {};
  const steps = ["ORDERED", "PACKED", "SHIPPED", "DELIVERED"];
  const [currentStep, setCurrentStep] = useState(1);
  const [showDetails, setShowDetails] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [addressList, setAddressList] = useState([]);
  const { orders, status, error } = useSelector((state) => state.orders || {});
  const [order, setorder] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    console.log(orders,"Final Orders");
    const fetchData = async () => {
      try {
        await Promise.all([getAllOrders(), getAddress()]);
      } catch (error) {
        console.error("Error in fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const getAddress = async () => {
    try {
      const resp = await axiosInstance.get("/address/getAddressforUser");
      setAddressList(resp.data.data);
      console.log("AddressList", resp.data.data);
    } catch (error) {
      console.error("Error in fetching addresses:", error);
    }
  };

  const getAllOrders = async () => {
    try {
      setorder(currorder);
      setOrderData(currorder.orderItems[0].product);
      const currentStepIndex = steps.indexOf(currorder.orderStatus);
      const currentStep = currentStepIndex !== -1 ? currentStepIndex + 1 : 0;
      setCurrentStep(currentStep);
    } catch (error) {
      console.error("Error in fetching orders:", error);
    }
  };

  function displayAddress(addressId) {
    console.log("Searching for address ID:", addressId);
    const foundAddress = addressList.find(
      (address) => address._id === addressId
    );

    if (foundAddress) {
      const formattedAddress = `
        ${foundAddress.houseNumber}, ${foundAddress.streetAddress}
        ${foundAddress.area}, ${foundAddress.landMark}
        ${foundAddress.city}, 
        ${foundAddress.district}
        ${foundAddress.state}
        ${foundAddress.zipCode}
      `;
      return formattedAddress;
    } else {
      console.log("Address not found for ID:", addressId);
      return "Address not found!";
    }
  }

  const handleCancelOrder = async () => {
    if (!selectedOrderId) return;
    try {
      await dispatch(cancelOrder({ orderId: selectedOrderId }));
      toast.success("Order cancelled successfully");
      await dispatch(fetchOrders());
      setIsModalOpen(false);
      setSelectedOrderId(null);
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel the order");
    }
  };

  const closeModal = () => {
    setShowDetails(false);
    setShowCancel(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4 sm:p-8">
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 flex flex-col lg:flex-row">
          <div className="w-full lg:w-60 mb-4 lg:mb-0 lg:mr-6">
            {orderData &&
              orderData.imageUrl &&
              orderData.imageUrl.length > 0 && (
                <img
                  src={orderData.imageUrl[0]}
                  alt="Product"
                  className="w-full h-48 sm:h-64 lg:h-72 object-cover rounded-lg"
                />
              )}
          </div>

          <div className="w-full lg:flex-1">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 lg:mb-0 text-gray-800">
                {orderData ? orderData.title : "Loading..."}
              </h2>
              <div className="text-right">
                <p className="text-gray-500">Cash on Delivery</p>
                <p className="text-lg font-bold text-green-600">
                  ₹{order ? order.totalDiscountedPrice : "Loading..."}
                </p>
              </div>
            </div>

            <p className="text-gray-600 text-base sm:text-lg mb-4">
              Apala Bazar 24 Hours Delivery
            </p>

            <div className="mt-6 flex flex-col lg:flex-row items-center">
              <div className="w-full lg:w-3/4 mb-4 lg:mb-0">
                {orderData && orderData.orderStatus === "CANCELLED" ? (
                  <ProgressTracker />
                ) : (
                  <ProgressTracker steps={steps} currentStep={currentStep} />
                )}
              </div>
              <div className="flex space-x-4 lg:ml-4">
                <button
                  onClick={() => {
                    if (orderData.orderStatus === "CANCELLED") {
                      toast.error("Your order is already cancelled");
                    } else if (orderData.orderStatus === "DELIVERED") {
                      toast.error("Your order is already delivered");
                    } else {
                      setSelectedOrderId(orderData._id);
                      setIsModalOpen(true);
                    }
                  }}
                  className="px-4 py-2 hover:bg-red-500 hover:text-white text-red-500 rounded-lg border-2 border-red-500 font-bold transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowDetails(true)}
                  className="px-4 py-2 hover:bg-gray-500 hover:text-white text-gray-500 rounded-lg border-2 border-gray-500 font-bold transition-colors duration-300"
                >
                  Details
                </button>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex overflow-x-auto pb-4 lg:pb-0 space-x-4">
                {orderData &&
                  orderData.imageUrl &&
                  orderData.imageUrl.length > 1 && (
                    <>
                      {orderData.imageUrl.slice(1, 4).map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`Recommendation ${index + 1}`}
                          className="h-20 w-20 sm:h-24 sm:w-24 object-cover rounded-lg flex-shrink-0"
                        />
                      ))}
                      <div className="flex flex-col items-center justify-center">
                        <div className="h-20 w-20 sm:h-24 sm:w-24 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                          <ChevronRight size={24} className="text-gray-600" />
                        </div>
                        <p className="text-xs text-center mt-1 text-gray-600">
                          See more like this
                        </p>
                      </div>
                    </>
                  )}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between mt-6">
                {/* <div className="text-center sm:text-left mb-4 sm:mb-0">
                  <h1 className="text-gray-500 font-semibold text-lg sm:text-xl">
                    User Name
                  </h1>
                  <h3 className="text-base sm:text-lg text-gray-700">
                    user@gmail.com
                  </h3>
                </div> */}
                <div className="flex justify-center sm:justify-start">
                  <StarRating />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Cancel Order
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <p className="mb-6 text-gray-600">
              Are you sure you want to cancel this order?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-300"
              >
                No, keep order
              </button>
              <button
                onClick={handleCancelOrder}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300"
              >
                Yes, cancel order
              </button>
            </div>
          </div>
        </div>
      )}
      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 bg-white rounded-full p-2"
            aria-label="Close"
          >
            <X size={24} />
          </button>
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            <div className="bg-orange-600 text-white p-6 rounded-t-lg">
              <h1 className="text-2xl font-bold flex items-center justify-between">
                <span>Order Details</span>
                <span className="text-gray-800 bg-white px-3 py-1 rounded-full text-sm font-semibold">
                  {order.orderStatus}
                </span>
              </h1>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center text-gray-800">
                    <Package className="mr-2 text-gray-600" />
                    Order Summary
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    Order ID: {order._id}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    Total Items: {order.totalItem}
                  </p>
                  <p className="text-sm text-green-600 mb-1">
                    Total Price: ₹{order.totalPrice}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    Cart Price: ₹{order.totalDiscountedPrice}
                  </p>
                  <p className="text-sm text-gray-600">
                    Discount: ₹{order.discount + order.couponPrice + 20}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center text-gray-800">
                    <Truck className="mr-2 text-gray-600" />
                    Shipping Details
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    Address: {displayAddress(order.shippingAddress)}
                  </p>
                </div>
              </div>
              <hr className="my-6 border-t border-gray-200" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center text-gray-800">
                    <CreditCard className="mr-2 text-gray-600" />
                    Payment Details
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    Method: {order.paymentDetails.paymentMethod}
                  </p>
                  <p className="text-sm text-gray-600">
                    Status: {order.paymentDetails.paymentStatus}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center text-gray-800">
                    <Calendar className="mr-2 text-gray-600" />
                    Order Date
                  </h3>
                  <p className="text-sm text-gray-600">
                    {new Date(order.orderDate).toLocaleString()}
                  </p>
                </div>
              </div>
              <hr className="my-6 border-t border-gray-200" />
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Order Items
              </h3>
              <div className="space-y-4">
                {order.orderItems.map((item) => (
                  <div key={item._id} className="bg-gray-100 p-4 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.product.imageUrl[0]}
                        alt={item.product.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">
                          {item.product.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm text-gray-600">
                          Price: ₹{item.price} | Discounted: ₹
                          {item.discountedPrice}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {showCancel && <Cancelorder closeModal={closeModal} />}
    </div>
  );
}
