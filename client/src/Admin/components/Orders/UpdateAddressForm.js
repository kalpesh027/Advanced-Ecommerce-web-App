import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../axiosConfig';

const UpdateAddressForm = ({ addressId, onAddressUpdated, onAddressCreated }) => {
  console.log("addrss id ",addressId)
  const [addressData, setAddressData] = useState({
    fullName: '',
    houseNumber: '',
    landMark: '',
    streetAddress: '',
    area: '',
    city: '',
    state: '',
    zipCode: '',
    district: '',
    mobile: '',
    extraMobile: ''
  });

  // Fetch the existing address by ID (if updating an existing address)
  const fetchAddress = async () => {
    const response = await axiosInstance.get(`/address/addressbyId/${addressId}`)
    console.log("user adrress",response)
    setAddressData(response.data.data)
   
  };
  useEffect(() => {
    fetchAddress();
  }, [addressId]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddressData({ ...addressData, [name]: value });
  };

  // Handle address form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("address data",addressData)
    try {
      // const response = await axiosInstance.put(`/address/updateAddress/${addressId}`,addressData )
      const response = await axiosInstance.post(`/address/addAddress`,addressData )
      if (response.status === 201) {
        alert('Address created successfully.');
        onAddressCreated(response.data.data); // Pass the new address data back to parent
        setAddressData({}); // Reset form
      }     
    } catch (error) {
      console.error('Error updating address:', error);
      alert('Error updating address.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="fullName" value={addressData.fullName} onChange={handleChange} placeholder="Full Name" />
      <input type="text" name="houseNumber" value={addressData.houseNumber} onChange={handleChange} placeholder="House Number" />
      <input type="text" name="landMark" value={addressData.landMark} onChange={handleChange} placeholder="Landmark" />
      <input type="text" name="streetAddress" value={addressData.streetAddress} onChange={handleChange} placeholder="Street Address" />
      <input type="text" name="area" value={addressData.area} onChange={handleChange} placeholder="Area" />
      <input type="text" name="city" value={addressData.city} onChange={handleChange} placeholder="City" />
      <input type="text" name="state" value={addressData.state} onChange={handleChange} placeholder="State" />
      <input type="text" name="zipCode" value={addressData.zipCode} onChange={handleChange} placeholder="Zip Code" />
      <input type="text" name="district" value={addressData.district} onChange={handleChange} placeholder="District" />
      <input type="text" name="mobile" value={addressData.mobile} onChange={handleChange} placeholder="Mobile" />
      <input type="text" name="extraMobile" value={addressData.extraMobile} onChange={handleChange} placeholder="Extra Mobile" />
      <button type="submit">Update Address</button>
    </form>
  );
};

export default UpdateAddressForm;
