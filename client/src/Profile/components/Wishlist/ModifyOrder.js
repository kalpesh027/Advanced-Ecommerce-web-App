import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../../axiosConfig";
import { toast } from "react-toastify";

const ModifyOrderForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { order } = location.state; // The passed order object

  const [addressData, setAddressData] = useState({
    houseNumber: "",
    streetAddress: "",
    area: "",
    landmark: "",
    city: "",
    district: "",
    state: "",
    zipCode: "",
    mobile: "",
    extraMobile: "",
  });

  // Fetch the address by ID using the order's address ID
  useEffect(() => {
    console.log(order,"Selected Order");
    if (order && order.shippingAddress) {
      fetchAddressById(order.shippingAddress);
    }
  }, [order]);

  // Function to fetch the address by its ID
  const fetchAddressById = async (addressId) => {
    try {
      const response = await axiosInstance.get(`/address/addressbyId/${addressId}`);
      const addressData = response.data.data;
      
      if (addressData) {
        setAddressData({
          houseNumber: addressData.houseNumber || "",
          streetAddress: addressData.streetAddress || "",
          area: addressData.area || "",
          landmark: addressData.landmark || "",
          city: addressData.city || "",
          district: addressData.district || "",
          state: addressData.state || "",
          zipCode: addressData.zipCode || "",
          mobile: addressData.mobile || "",
          extraMobile: addressData.extraMobile || "",
        });
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      toast.error("Failed to fetch address details");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (order && order.shippingAddress) {
        // Update existing address
        const response = await axiosInstance.put(`/address/updateAddress/${order.shippingAddress}`, addressData);
        toast.success("Address updated successfully");
      } else {
        // Create new address
        const response = await axiosInstance.post("/address/addAddress", addressData);
        toast.success("New address created successfully");
      }

      navigate("/myprofile/my-orders"); // Redirect to the orders page
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error("Failed to update address");
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddressData({ ...addressData, [name]: value });
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-md">
      <h2 className="text-2xl font-bold mb-4">Modify Shipping Address</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="houseNumber" className="block font-semibold">
              House Number
            </label>
            <input
              type="text"
              id="houseNumber"
              name="houseNumber"
              value={addressData.houseNumber}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="streetAddress" className="block font-semibold">
              Street Address
            </label>
            <input
              type="text"
              id="streetAddress"
              name="streetAddress"
              value={addressData.streetAddress}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="area" className="block font-semibold">
              Area
            </label>
            <input
              type="text"
              id="area"
              name="area"
              value={addressData.area}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="landmark" className="block font-semibold">
              Landmark
            </label>
            <input
              type="text"
              id="landmark"
              name="landmark"
              value={addressData.landmark}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block font-semibold">
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={addressData.city}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="district" className="block font-semibold">
              District
            </label>
            <input
              type="text"
              id="district"
              name="district"
              value={addressData.district}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="state" className="block font-semibold">
              State
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={addressData.state}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="zipCode" className="block font-semibold">
              Zip Code
            </label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={addressData.zipCode}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="mobile" className="block font-semibold">
              Mobile Number
            </label>
            <input
              type="text"
              id="mobile"
              name="mobile"
              value={addressData.mobile}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="extraMobile" className="block font-semibold">
              Extra Mobile (Optional)
            </label>
            <input
              type="text"
              id="extraMobile"
              name="extraMobile"
              value={addressData.extraMobile}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-300"
        >
          Update Address
        </button>
      </form>
    </div>
  );
};

export default ModifyOrderForm;
