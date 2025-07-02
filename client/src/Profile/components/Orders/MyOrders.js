import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  X,
  Package,
  Truck,
  HelpCircle,
  Edit3,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, cancelOrder } from "../../../Redux/Order/orderSlice";
import { fetchAllTimeLocations } from "../../../Redux/Time_location/TimelocationSlice";
import axiosInstance from "../../../axiosConfig";
import order from "./noorder.webp";
import HelpPopup from "./HelpPopup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import TrackOrder from "../Tracking/Tracking.js";

export default function Component() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [expandedOrder, setExpandedOrder] = useState(null);
  const { orders, status, error } = useSelector((state) => state.orders || {});
  const [addressList, setAddressList] = useState([]);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [timeSlot, setalltimeSlot] = useState([]);
  const locations = useSelector((state) => state.TimeLocation.locations);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [FolderOpen, setFolderOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(fetchOrders()),
          getAddress(),
          dispatch(fetchAllTimeLocations()),
        ]);
      } catch (error) {
        console.error("Error in fetching data:", error);
      }
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    setalltimeSlot(locations);
  }, [locations]);

  // console.log("TimeLocation", timeSlot);

  console.log("Orders", orders);

  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
  );

  const getAddress = async () => {
    try {
      const resp = await axiosInstance.get("/address/getAddressforUser");
      setAddressList(resp.data.data);
      console.log("User Aadress", resp.data.data);
    } catch (error) {
      console.error("Error in fetching addresses:", error);
    }
  };

  useEffect(() => {
    console.log("Updated Address List:", addressList);
  }, [addressList]);

  function displayAddress(addressId) {
    console.log("Searching for address ID:", addressId);
    const foundAddress = addressList.find(
      (address) => address._id === addressId
    );
console.log(foundAddress)
    if (foundAddress) {
      const formattedAddress = `
        ${foundAddress.houseNumber}, ${foundAddress.streetAddress}
        ${foundAddress.area}, ${foundAddress.landMark}
        City: ${foundAddress.city}, District: ${foundAddress.district}
        State: ${foundAddress.state}
        ${foundAddress.zipCode}
      `;
      return formattedAddress;
    } else {
      console.log("Address not found for ID:", addressId);
      return "Address not found!";
    }
  }

  const handleTrackOrder = (currorder) => {
    navigate("/myprofile/track-order", { state: { currorder } });
  };

  const findShippingAddress = (orderId) => {
    const add = addressList.find((o) => o._id === orderId);
    return add;
  };

  const searchTimeSlot = (area, city, zipCode) => {
    const filteredSlot = timeSlot.filter(
      (slot) =>
        slot.city.toLowerCase() === city.toLowerCase() &&
        slot.area.toLowerCase() === area.toLowerCase() &&
        String(slot.pincode) === String(zipCode)
    );

    if (filteredSlot.length > 0) {
      return filteredSlot
        .map((slot) => `${slot.day}: ${slot.start} - ${slot.end}`)
        .join(", ");
    } else {
      return "Update soon";
    }
  };

  const getTimeSlotsForOrder = (orderId) => {
    const shippingAddress = findShippingAddress(orderId);

    if (shippingAddress) {
      const { area, city, zipCode } = shippingAddress;
      return searchTimeSlot(area, city, zipCode);
    } else {
      return "Shipping address not found";
    }
  };
  const handleModifyOrder = (order) => {
    // Navigate to the order modification page, passing the current order as state
    navigate("/myprofile/modify-order", { state: { order } });
  };
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

  const openHelp = () => setIsHelpOpen(true);
  const closeHelp = () => setIsHelpOpen(false);

  const toggleOrder = (orderId) => {
    setExpandedOrder((prev) => (prev === orderId ? null : orderId));
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      {status === "loading" && (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-gray-600"></div>
        </div>
      )}

      {status === "failed" && (
        <div className="text-red-600 text-center font-semibold">
          Error: {error}
        </div>
      )}

      {status === "succeeded" && (!orders || orders.length === 0) && (
        <div className="flex flex-col justify-center items-center min-h-screen">
          <img
            src={order}
            alt="no order"
            className="w-64 mb-8 transition-transform transform hover:scale-105"
          />
          <p className="text-3xl text-gray-700 font-bold text-center">
            No Orders Found
          </p>
          <p className="text-xl text-gray-500 mt-4">
            Start shopping to see your orders here!
          </p>
        </div>
      )}

      {status === "succeeded" && orders && orders.length > 0 && (
        <>
          <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
            My Orders
          </h1>
          <div className="space-y-6">
            {sortedOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg"
              >
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => toggleOrder(order._id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-base sm:text-xl font-semibold text-gray-800">
                        Order #{order._id}
                      </h2>
                      <p className="text-gray-600 mt-1">
                        Placed on{" "}
                        {new Date(order.orderDate).toLocaleDateString("en-GB")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg sm:text-2xl font-bold text-gray-800">
                        ₹{order.totalDiscountedPrice}
                      </p>
                      <p className="text-green-600 font-semibold">
                        Saved ₹
                        {order.orderStatus !== "CANCELLED"
                          ? order.discount + order.couponPrice + 20
                          : 0}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center mt-4 text-gray-700">
                    <Package className="mr-2" size={18} />
                    <span>{order.totalItem} items</span>
                    <span className="mx-2">•</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        order.orderStatus === "CANCELLED"
                          ? "bg-red-100 text-red-800"
                          : order.orderStatus === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {order.orderStatus.charAt(0).toUpperCase() +
                        order.orderStatus.slice(1)}
                    </span>
                  </div>
                  {expandedOrder === order._id ? (
                    <ChevronUp className="text-gray-600 mt-2" />
                  ) : (
                    <ChevronDown className="text-gray-600 mt-2" />
                  )}
                </div>
                {expandedOrder === order._id && (
                  <div className="px-6 pb-6 bg-gray-50 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-3 text-gray-800">
                          Order Summary
                        </h3>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <p className="flex justify-between mb-2">
                            <span className="text-gray-600">Total Amount:</span>
                            <span className="font-semibold">
                              ₹{order.totalPrice}
                            </span>
                          </p>
                          <p className="flex justify-between mb-2">
                            <span className="text-gray-600">Cart Total:</span>
                            <span className="font-semibold">
                              ₹{order.totalDiscountedPrice}
                            </span>
                          </p>
                          <p className="flex justify-between mb-2">
                            <span className="text-gray-600">
                              Delivery Charges:
                            </span>
                            <span className="font-semibold text-green-500 line-through">
                              ₹{order.orderStatus !== "CANCELLED" ? 20 : 0}
                            </span>
                          </p>
                          <p className="flex justify-between text-green-600">
                            <span>Total Savings:</span>
                            <span className="font-semibold">
                              ₹
                              {order.orderStatus !== "CANCELLED"
                                ? order.discount + order.couponPrice + 20
                                : 0}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-3 text-gray-800">
                          Delivery Details
                        </h3>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <p className="font-semibold mb-2 text-gray-700">
                            Address:
                          </p>
                          <p className="text-sm mb-3 text-gray-600">
                            {displayAddress(order.shippingAddress)}
                          </p>
                          <p className="mb-2">
                            <span className="font-semibold text-gray-700">
                              Payment Mode:
                            </span>{" "}
                            <span className="text-gray-600">
                              {order.paymentDetails.paymentMethod}
                            </span>
                          </p>
                          <p>
                            <span className="font-semibold text-gray-700">
                              Delivery Slot:
                            </span>{" "}
                            <span className="text-gray-600">
                              {getTimeSlotsForOrder(order.shippingAddress)}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap justify-end space-x-4 mt-6">
                      <button
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-300 flex items-center mb-2 sm:mb-0"
                        onClick={() => handleTrackOrder(order)}
                      >
                        <Truck className="mr-2" size={18} />
                        Track Order
                      </button>
                      <button
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-300 flex items-center mb-2 sm:mb-0"
                        onClick={openHelp}
                      >
                        <HelpCircle className="mr-2" size={18} />
                        Need Help
                      </button>
                      <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-300 flex items-center mb-2 sm:mb-0"
                         onClick={() => handleModifyOrder(order)}>
                        <Edit3 className="mr-2" size={18} />
                        Modify Order
                      </button>
                      {order.orderStatus !== "CANCELLED" &&
                        order.orderStatus !== "DELIVERED" && (
                          <button
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 mb-2 sm:mb-0"
                            onClick={() => {
                              setSelectedOrderId(order._id);
                              setIsModalOpen(true);
                            }}
                          >
                            Cancel Order
                          </button>
                        )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
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
            <p className="mb-6 text-gray-700">
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
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
              >
                Yes, cancel order
              </button>
            </div>
          </div>
        </div>
      )}

      {isHelpOpen && <HelpPopup onClose={closeHelp} orderNumber={15347849} />}
    </div>
  );
}
