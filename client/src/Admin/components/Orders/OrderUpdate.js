import React, { useState, useEffect } from 'react';
import UpdateAddressForm from './UpdateAddressForm';
import { loadRazorpay } from './loadRazorpay';
import axiosInstance from '../../../axiosConfig';
import { createPaymentOrder, verifyPayment } from '../../../Redux/Payment/paymentSlice';
import { useDispatch } from 'react-redux';

import paymentlogo from "./paymentlogo.png";
import { placeOrder } from '../../../Redux/Order/orderSlice';
import { useNavigate } from 'react-router-dom';


const Updateorder = ({ order, userAddresses, onOrderUpdated }) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(order.shippingAddress || '');
  const [paymentMethod, setPaymentMethod] = useState(order.paymentDetails.paymentMethod);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const dispatch = useDispatch()

  useEffect(() => {
    setSelectedAddressId(order.shippingAddress);
    setPaymentMethod(order.paymentDetails.paymentMethod);
  }, [order]);

  const fetchAddresses = async () => {
    const res = await axiosInstance.get(`/address/getAllAddressofUserforadmin/${order.user?._id}`); // Endpoint to get addresses

    setAddresses(res.data.data);
    console.log("user all adresss", res.data.data)
  };
  useEffect(() => {
    fetchAddresses()
  }, []);

  // Handle address selection
  const handleAddressChange = (newAddressId) => {
    setSelectedAddressId(newAddressId);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Handle payment method change
  const handlePaymentMethodChange = async (e) => {
    const selectedMethod = e.target.value;
    // Allow changing payment method only if it's COD
    if (paymentMethod === 'COD' || selectedMethod === 'COD') {
      setPaymentMethod(selectedMethod);
    }

    if (selectedMethod === 'Online') {


      const res = await loadRazorpayScript();
      if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        return;
      }

      try {
        const updateorder = await dispatch(
          createPaymentOrder({
            amount: order.totalDiscountedPrice,
            currency: "INR",
          })
        ).unwrap();
        console.log("updated order ", updateorder)
        const options = {
          key: "rzp_test_yWMvyDcDnYXnV6",
          image: paymentlogo,
          amount: updateorder.amount,
          currency: updateorder.currency,
          order_id: updateorder.id,
          name: "Aapala Bajar",
          description: "Checkout",
          handler: async function (response) {
            try {
              const verificationData = {
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              };

              // Verify the payment
              await dispatch(verifyPayment(verificationData)).unwrap();
              setIsPaymentSuccess(true); // Set payment success state
              alert("payment verified success")
              // toast.success("Payment verified successfully");

              // // Get selected address
              // const selectedAddress = address.find(
              //   (addr) => addr._id === savedAddressChecked
              // );
              // if (!selectedAddress) {
              //   console.log("Selected address not found");
              //   return;
              // }

              // Prepare order data
              const orderData = {
                shippingAddress: selectedAddressId || order.shippingAddress,
                paymentDetails: {
                  paymentMethod: "Online Payment",
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                },
              };
              try {

                // Place the order
                const response = await axiosInstance.put(`/order/updateoreradmin/${order._id}`, orderData);
                console.log("order updated", response)
                if (response.status === 200) {
                  onOrderUpdated(response.data)
                  alert("order updated successfully")
                }
                else {
                  alert('Failed to update the order.');
                }

              }
              catch (e) {
                console.log('Error updating order:', e);
                alert('Error updating order');
              }
            } catch (error) {
              console.log("Failed to place order:", error);
              alert("Failed to place order");
            }
          },

          prefill: {
            name: "shivkumar",
            email: "your-email@example.com",
            contact: 24234234,
          },
          notes: {
            address: "shrigonda , honrao chowk",
          },

          // prefill: {
          //   name: formData.fullName,
          //   email: "your-email@example.com",
          //   contact: formData.mobile,
          // },
          // notes: {
          //   address: `${formData.houseNumber}, ${formData.area}, ${formData.streetAddress}, ${formData.state} - ${formData.zipCode}`,
          // },
          theme: {
            color: "#FFAC1C",
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();


      } catch (e) {
        console.log(e)
      }

    } else {
      setPaymentMethod('COD');
    }
  };

  // Save updated order (address and payment)
  const handleSaveOrder = async () => {
    // Prepare the object to hold updates
    const updatedOrderdata = {};

    if(!selectedAddressId){
      alert("please select a shipping address.!")
      return;
    }else if (selectedAddressId !== order.shippingAddress){
      updatedOrderdata.shippingAddress = selectedAddressId; // Only update if different

    }

    // Check if the payment method has changed
    if (paymentMethod !== order.paymentDetails.paymentMethod) {
      updatedOrderdata.paymentDetails = { paymentMethod };

      // If the new payment method is online, verify the payment first
      if (paymentMethod === 'Online' && !isPaymentSuccess) {
        alert('Please complete the payment to continue.');
        return
      }
    }
    // Ensure there's something to update
    if (Object.keys(updatedOrderdata).length === 0) {
      alert('No changes to save.');
      return;
    }

    try {
      const response = await axiosInstance.put(`/order/updateoreradmin/${order._id}`, updatedOrderdata);
      console.log("updaed order data", response)
      if (response.status === 200) {
        const updatedOrderData = response
        console.log("updaed order data", response)
        onOrderUpdated(updatedOrderData); // Notify parent component
      } else {
        alert('Failed to update the order.');
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };


return (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-2xl font-semibold mb-4">Edit Order</h2>

    {/* Shipping Address Selection */}
    <div className="mb-4">
      <label className="block text-gray-700 font-medium mb-2">Shipping Address</label>
      <select
        value={selectedAddressId}
        onChange={(e) => handleAddressChange(e.target.value)}
        className="block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        {addresses.map(address => (
          <option key={address._id} value={address._id}>
            {address.fullName}, {address.houseNumber}, {address.streetAddress}, {address.area}, {address.city}, {address.pincode}
          </option>
        ))}
      </select>
    </div>

    {/* Payment Method Section */}
    <div className="mb-4">
      <label className="block text-gray-700 font-medium mb-2">Payment Method</label>
      <select
        value={paymentMethod}
        onChange={handlePaymentMethodChange}
        className="block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        disabled={paymentMethod !== 'COD'} // Disable dropdown if payment method is not COD

      >
        <option value="COD">Cash on Delivery</option>
        <option value="Online">Online Payment</option>
      </select>
      {isPaymentSuccess && <p className="mt-2 text-green-600">Payment Successful!</p>}
    </div>
    <button
      onClick={handleSaveOrder}
      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
    >
      Save Changes
    </button>
  </div>
);
};

export default Updateorder;
