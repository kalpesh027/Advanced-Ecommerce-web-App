// profileAddress.js

import React, { useState, useEffect } from "react";
import axiosInstance from "../../../axiosConfig";
import { RiDeleteBin7Fill } from "react-icons/ri";

const addressCardClasses = "bg-white p-4 rounded-lg shadow-md border-[1px] border-gray-300 hover:shadow-lg transition duration-300";
const buttonClasses = "text-muted-foreground hover:text-foreground transition duration-300";

const INPUT_CLASS =
  "mt-1 block w-full p-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-white text-zinc-900 dark:text-black";
const LABEL_CLASS =
  "block text-sm font-medium text-black";

const AddressCard = ({ type, name, phone, address }) => {
  return (
    <div className={addressCardClasses}>
      <div className="flex justify-between items-center">
        <div>
          <span className="bg-green-200 text-secondary-foreground px-2 py-1 rounded-md text-xs">{type}</span>
          <h3 className="text-md font-semibold text-foreground mt-2">{name}</h3>
          <p className="text-muted-foreground">{phone}</p>
          <p className="text-muted-foreground">{address}</p>
        </div>
        <button className={buttonClasses}>
          <img aria-hidden="true" alt="more-options" src="https://openui.fly.dev/openui/24x24.svg?text=⋮" />
        </button>
      </div>
    </div>
  );
};

const ProfileAddress = () => {
  const [address, setAddress] = useState([]);
  const [savedAddressChecked, setSavedAddressChecked] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);


  const [formData, setFormData] = useState({
    fullName: "",
    houseNumber: "",
    landMark: "",
    area: "",
    city: "",
    state: "",
    zipCode: "",
    district: "",
    mobile: "",
    streetAddress: "",
  });

  const handleOpenForm = () => setIsFormOpen(true);
  const handleCloseForm = () => setIsFormOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isDeliverable) {
      alert("The address you entered is not deliverable.");
      return;
    }

    try {
      const resp =await axiosInstance.post(
        "/address/addAddress",
        formData
      );
      if (resp.status === 200) getAddress();
      alert(resp.data.message);
    } catch (error) {
      console.error("Error in creation:", error);
    }
    handleCloseForm();
  };


  const handleDelete = async (id) => {
    try {
      const resp = await axiosInstance.delete(
        `/address/deleteAddress/?addressId=${id}`
      );
      if (resp.status === 200) {
        setAddress(address.filter((add) => add._id !== id));
      }
    } catch (error) {
      console.error("Error in deletion:", error);
    }
  };


  const [cityError, setCityError] = useState(null);
  const [pincodeError, setPincodeError] = useState(null);
  const [isDeliverable, setIsDeliverable] = useState(null);

  const handleChange = async (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));

    // Only check address if both city and zipCode are filled
    if (id === "city" || id === "zipCode") {
      const city = id === "city" ? value : formData.city;
      const pincode = id === "zipCode" ? value : formData.zipCode;

      // Check if both fields are filled before making the API call
      if (city && pincode) {
        try {
          const response = await axiosInstance.post("/timelocation/checkaddress", {
            city,
            pincode,
          });

          const isDeliverable = response.data.status;

          if (isDeliverable) {
            setCityError(null); // Clear any previous error
            setPincodeError(null); // Clear any previous error
            setIsDeliverable(true);
          } else {
            setCityError("City or pincode is not deliverable.");
            setPincodeError(null); // Optionally clear this since we have a combined message
            setIsDeliverable(false);
          }

          setIsDeliverable(isDeliverable);
        } catch (error) {
          console.error("Error checking address:", error);
          setCityError("City or pincode is not deliverable.");
          setIsDeliverable(false);
        }
      }
    } else {
      // Reset deliverability state if inputs are incomplete
      setIsDeliverable(null);
      setCityError(null); // Optionally reset error state
    }
  }



  const getAddress = async () => {
    try {
      const resp = await axiosInstance.get("/address/getAddressforUser");
      setAddress(resp.data.data);
    } catch (error) {
      console.error("Error in fetching addresses:", error);
    }
  };

  useEffect(() => {
    getAddress();
  }, []);

  return (
    <section>
    <div className="p-4">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-foreground">Manage Addresses</h2>
          <button 
          type="button"
           onClick={handleOpenForm}
          className="bg-primary border-blue-500 border-[2px] text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/80 hover:font-semibold transition duration-300">
            + Add a New Address
          </button>
        </div>
        

<div>
  {address && address.length > 0 ? (
    address
    .slice()
    .reverse()
    .map((add) => (
      <div key={add._id} className="border rounded-lg p-4 flex items-start mb-4 shadow-md hover:shadow-lg transition-shadow duration-200">
        <input
          type="radio"
          required
          name="saved_address"
          className="mr-2 h-5 w-5 accent-blue-600"
          checked={savedAddressChecked === add._id}
          onChange={() => setSavedAddressChecked(add._id)}
        />
        <div id={add._id} className="flex-1">
          <p className="font-semibold text-lg">{add.fullName}</p>
          <p className="text-gray-700">
            {add.houseNumber}, {add.landMark}, {add.area}
          </p>
          <p className="text-gray-700">
            {add.city} - {add.zipCode}
          </p>
          <p className="text-gray-700">
            Landmark: {add.landMark} , {add.state}
          </p>
          <p className="text-gray-700">
            Mob No: {add.mobile}
          </p>
        </div>

        <RiDeleteBin7Fill
          className="hover:bg-red-300 text-4xl p-2 rounded-full transition-colors duration-200 cursor-pointer"
          onClick={() => handleDelete(add._id)}
        />
      </div>
      ))
    ) : (
      <div className="border rounded-lg p-4 flex items-center mb-4">Add address</div>
    )
  }
        </div>
      </div>
      <div>

      </div>
    </div>
    {isFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-300 p-6 rounded-lg shadow-lg w-full max-w-lg h-[80%] overflow-y-auto scroll">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-black">
                Add Address
              </h2>
              <button
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                onClick={handleCloseForm}
              >
                <img
                  aria-hidden="true"
                  alt="close"
                  src="https://openui.fly.dev/openui/24x24.svg?text=✖️"
                />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="fullName" className={LABEL_CLASS}>
                    Full Name*
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    className={INPUT_CLASS}
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="city" className={LABEL_CLASS}>
                    City*
                  </label>
                  <input
                    type="text"
                    id="city"
                    className={INPUT_CLASS}
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="zipCode" className={LABEL_CLASS}>
                    zipCode*
                  </label>
                  <input
                    type="number"
                    id="zipCode"
                    className={INPUT_CLASS}
                    value={formData.zipCode}
                    onChange={handleChange}
                    required
                  />
                </div>
                {isDeliverable === true && (
                  <p className="text-green-500">Delivery is available for this city and pincode!</p>
                )}
                {(cityError || pincodeError) && <p className="text-red-500">{cityError}</p>}

                <div>
                  <label htmlFor="area" className={LABEL_CLASS}>
                    Area*
                  </label>
                  <input
                    type="text"
                    id="area"
                    className={INPUT_CLASS}
                    value={formData.area}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="streetAddress" className={LABEL_CLASS}>
                    streetAddress*
                  </label>
                  <input
                    type="text"
                    id="streetAddress"
                    className={INPUT_CLASS}
                    value={formData.streetAddress}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="houseNumber" className={LABEL_CLASS}>
                    houseNumber / Apartment Number*
                  </label>
                  <input
                    type="text"
                    id="houseNumber"
                    className={INPUT_CLASS}
                    value={formData.houseNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="landMark" className={LABEL_CLASS}>
                   landMark
                  </label>
                  <input
                    type="text"
                    id="landMark"
                    className={INPUT_CLASS}
                    value={formData.landMark}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="district" className={LABEL_CLASS}>
                    District*
                  </label>
                  <input
                    type="text"
                    id="district"
                    className={INPUT_CLASS}
                    value={formData.district}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="state" className={LABEL_CLASS}>
                    State*
                  </label>
                  <input
                    type="text"
                    id="state"
                    className={INPUT_CLASS}
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="mobile" className={LABEL_CLASS}>
                    Contact Number*
                  </label>
                  <input
                    type="number"
                    id="mobile"
                    className={INPUT_CLASS}
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg"
                  onClick={handleCloseForm}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-primary-foreground px-4 py-2 rounded-lg"
              
               >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>


  );
};

export default ProfileAddress;
