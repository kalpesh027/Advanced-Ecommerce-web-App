import React, { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { Package, Truck, X, CreditCard, Calendar,} from "lucide-react"
import ProgressTracker from "./Progress.js"
import axiosInstance from "../../../axiosConfig"
import { toast } from "react-toastify";


export default function AdminOrderTrackingPopup({ order, onclose }) {
  const dispatch = useDispatch()
  const steps = ["ORDERED", "PACKED", "SHIPPED", "DELIVERED"]
  const [currentStep, setCurrentStep] = useState(1)
  const [orderData, setOrderData] = useState(order || null)
  const [showDetails, setShowDetails] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (order) {
      setOrderData(order.orderItems[0].product) 
      const currentStepIndex = steps.indexOf(order.orderStatus)
      const currentStep = currentStepIndex !== -1 ? currentStepIndex + 1 : 0
      setCurrentStep(currentStep);
    } else {
      console.log("No order data available")
    }
  }, [order])

  const openPopup = () => setIsOpen(true)
  const closePopup = () => setIsOpen(false)

  const handleSave = () => {
    toast.success("Order status updated successfully");
  };

  const updateOrderStatus = async (step) => {
    try {
      const updatedStatus = steps[step - 1]
      const resp = await axiosInstance.put("/order/updateOrderStatusAdmin", {
        orderId: order._id,
        status: updatedStatus,
      })
      if(resp.data.success){
        console.log("Order status updated:", resp.data)
        setCurrentStep(step)
      }else{
        toast.error("Error updating order status");
      }
      
    } catch (error) {
      console.error("Error updating order status:", error)
    }
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
        <button
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          onClick={onclose}
        >
          <X className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </button>
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-60 mb-2 lg:mb-0">
            {orderData && orderData.imageUrl && orderData.imageUrl.length > 0 && (
              <img
                src={orderData.imageUrl[0]}
                alt="Product"
                width={300}
                height={400}
                className="h-48 sm:h-64 lg:h-72 object-cover rounded-lg"
              />
            )}
          </div>

          <div className="w-full lg:w-3/4 lg:pl-6">
            <div className="flex flex-col lg:flex-row">
              <h2 className="text-lg sm:text-xl lg:text-xl font-bold w-full lg:w-2/3 lg:mx-7 mb-4 lg:mb-0">
                {orderData ? orderData.title : "Loading..."}
              </h2>
              <div className="mt-2 lg:mt-4 lg:mx-7">
                <p className="ml-2 text-gray-500">Cash on Delivery</p>
                <p className="text-lg font-bold">
                  ₹{orderData ? orderData.price : "Loading..."}
                </p>
              </div>
            </div>

            <div className="container mx-auto p-4 flex flex-col lg:flex-row">
              <div className="w-full">
                <ProgressTracker
                  steps={steps}
                  currentStep={currentStep}
                  onStepClick={updateOrderStatus}
                />
              </div>
              <div>
                <button
                  onClick={openPopup}
                  className="px-4 py-2 w-1/4 lg:w-auto hover:bg-red-500 hover:text-white text-red-500 rounded-xl mr-0 lg:ml-5 mt-7 border-2 border-red-500 font-bold"
                >
                  Details
                </button>
                <button
                  onClick={() => {
                    handleSave();
                  }}
                  className="px-4 py-2 w-1/4 ml-5 lg:w-auto hover:bg-green-500 hover:text-white text-green-500 rounded-xl mt-2 border-2 border-green-500 font-bold"
                >
                   save 
                </button>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row mt-6">
              <div className="flex mb-4 lg:mb-0">
                {orderData &&
                  orderData.imageUrl &&
                  orderData.imageUrl.length > 1 && (
                    <>
                      {orderData.imageUrl.slice(1, 4).map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={"Recommendation"}
                          width={112}
                          height={96}
                          className="h-20 sm:h-24 border rounded-3xl w-20 sm:w-28 mr-3"
                        />
                      ))}
                    </>
                  )}
              </div>

              <div className="flex flex-col lg:flex-row">
                <div className="text-center ml-[9px] mb-4 lg:mb-0 ml-4">
                  <h1 className="text-gray-500 font-semibold text-lg sm:text-xl">
                    Admin Control
                  </h1>
                  <h3 className="text-base sm:text-lg">admin@gmail.com</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <button
              onClick={closePopup}
              className="absolute top-12 right-96 text-orange-500 hover:text-orange-700 bg-white rounded-full "
              aria-label="Close"
            >
              <X size={24} />
            </button>
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            
            <div className="bg-orange-500 text-white p-6 rounded-t-lg">
              <h1 className="text-2xl font-bold flex items-center justify-between">
                <span>Order Details</span>
                <span className="text-orange-500 bg-white px-3 py-1 rounded-full text-sm font-semibold">
                  {order.orderStatus}
                </span>
              </h1>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <Package className="mr-2 text-orange-500" />
                    Order Summary
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">Order ID: {order._id}</p>
                  <p className="text-sm text-gray-600 mb-1">Total Items: {order.totalItem}</p>
                  <p className="text-sm text-gray-600 mb-1">Total Price: ₹{order.totalPrice}</p>
                  <p className="text-sm text-gray-600 mb-1">Discounted Price: ₹{order.totalDiscountedPrice}</p>
                  <p className="text-sm text-gray-600">Discount: ₹{order.discount}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <Truck className="mr-2 text-orange-500" />
                    Shipping Details
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">Address ID: {order.shippingAddress}</p>
                </div>
              </div>
              <hr className="my-6 border-t border-gray-200" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <CreditCard className="mr-2 text-orange-500" />
                    Payment Details
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">Method: {order.paymentDetails.paymentMethod}</p>
                  <p className="text-sm text-gray-600">Status: {order.paymentDetails.paymentStatus}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <Calendar className="mr-2 text-orange-500" />
                    Order Date
                  </h3>
                  <p className="text-sm text-gray-600">{new Date(order.orderDate).toLocaleString()}</p>
                </div>
              </div>
              <hr className="my-6 border-t border-gray-200" />
              <h3 className="text-lg font-semibold mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.orderItems.map((item) => (
                  <div key={item._id} className="bg-orange-100 p-4 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.product.imageUrl[0]}
                        alt={item.product.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.product.title}</h4>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        <p className="text-sm text-gray-600">
                          Price: ₹{item.price} | Discounted: ₹{item.discountedPrice}
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
    </div>
  )
}
