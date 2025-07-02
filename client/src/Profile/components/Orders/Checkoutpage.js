import React, { useEffect, useState } from "react";
import { FcHome } from "react-icons/fc";
import axiosInstance from "../../../axiosConfig";
import axios from "axios";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { fetchCart, updateCartPriceSummary } from "../../../Redux/Cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { IoShieldCheckmark } from "react-icons/io5";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { placeOrder } from "../../../Redux/Order/orderSlice";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import paymentlogo from "./paymentlogo.png";
import logoImage from "../../../logo.png";
import {
  createPaymentOrder,
  verifyPayment,
} from "../../../Redux/Payment/paymentSlice";
import Navbar from "../../../customer/Components/Navbar/Navbar";

const INPUT_CLASS =
  "mt-1 block w-full p-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-white text-zinc-900 dark:text-black";
const LABEL_CLASS = "block text-sm font-medium text-black";

const Checkout = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const [details, setDetails] = useState({});
  const dispatch = useDispatch();
  const { items, pricesummary, status, error } = useSelector((state) => state.cart);
  const [address, setAddress] = useState([]);
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
  const [deliveryModeChecked, setDeliveryModeChecked] = useState(false);
  const [savedAddressChecked, setSavedAddressChecked] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);


  console.log("i", items)
  // console.log("p", pricesummary)


  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([dispatch(fetchCart()), getAddress()]);
      } catch (error) {
        console.log("Error in fetching data:", error);
      }
    };
    fetchData();
  }, [dispatch]);

  const getAddress = async () => {
    try {
      const resp = await axiosInstance.get("/address/getAddressforUser");
      setAddress(resp.data.data);
    } catch (error) {
      console.log("Error in fetching addresses:", error);
    }
  };

  const handleLogoClick = () => {
    navigate("/");
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
      console.log("Error in deletion:", error);
    }
  };
  console.log("CartItems", items);
  const [cityError, setCityError] = useState(null);
  const [pincodeError, setPincodeError] = useState(null);
  const [isDeliverable, setIsDeliverable] = useState(null);

  // const [isDeliverableaddress, setisDeliverableaddress] = useState(null);

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
          const response = await axiosInstance.post(
            "/timelocation/checkaddress",
            {
              city,
              pincode,
            }
          );
          console.log("check address", response)

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
          console.log("Error checking address:", error);
          setIsDeliverable(false);
          setCityError("City or pincode is not deliverable.");
        }

      } else {
        // Reset deliverability state if inputs are incomplete
        setIsDeliverable(null);
        setCityError(null); // Optionally reset error state
      }
    }
  };

  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!isDeliverable) {
      alert("The address you entered is not deliverable.");
      return;
    }

    setLoading(true); // Set loading state to true

    try {
      const resp = await axiosInstance.post("/address/addAddress", formData);
      if (resp.status === 200) getAddress();
      alert(resp.data.message);
    } catch (error) {
      console.log("Error in creation:", error);
    }
    handleCloseForm();
  };

  const handleOpenForm = () => setIsFormOpen(true);
  const handleCloseForm = () => setIsFormOpen(false);

  const buttonClass = (enabled) =>
    enabled
      ? "bg-blue-500 text-primary-foreground w-full py-2 rounded-lg text-white "
      : "bg-gray-400 text-gray-200 w-full py-2 rounded-lg cursor-not-allowed";

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const res = await loadRazorpayScript();

    if (!res) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      return;
    }

    try {
      const order = await dispatch(
        createPaymentOrder({
          amount: items[1].totalDiscountedPrice,
          currency: "INR",
        })
      ).unwrap();

      const options = {
        key: "rzp_test_yWMvyDcDnYXnV6",
        image: paymentlogo,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
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
            toast.success("Payment verified successfully");

            // Get selected address
            const selectedAddress = address.find(
              (addr) => addr._id === savedAddressChecked
            );
            if (!selectedAddress) {
              console.log("Selected address not found");
              return;
            }

            // Prepare order data
            const orderData = {
              shippingAddress: selectedAddress,
              paymentDetails: {
                paymentMethod: "Online Payment",
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,

              },
            };

            // Place the order
            await dispatch(placeOrder(orderData));
            toast.success("Order placed successfully");
            navigate("/paymentsuccess");
          } catch (error) {
            console.log("Failed to place order:", error);
            toast.error("Failed to place order");
          }
        },
        prefill: {
          name: formData.fullName,
          email: "your-email@example.com",
          contact: formData.mobile,
        },
        notes: {
          address: `${formData.houseNumber}, ${formData.area}, ${formData.streetAddress}, ${formData.state} - ${formData.zipCode}`,
        },
        theme: {
          color: "#FFAC1C",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      dispatch(updateCartPriceSummary({
        totalDiscountedPrice: 0,
        discount: 0,
        totalActualPrice: 0 // Add this line if you want to include totalActualPrice
      }));
    } catch (error) {
      console.log("Error creating order:", error);
      toast.error("Error creating order. Please try again.");
    }
  };

  const handleOrder = () => {
    // do something
    const selectedAddress = address.find(
      (addr) => addr._id === savedAddressChecked
    );
    if (!selectedAddress) {
      console.log("Selected address not found");
      return;
    }

    const orderData = {
      shippingAddress: selectedAddress,
      paymentDetails: { paymentMethod: "COD" },
      // totalPrice: pricesummary.totalActualPrice,
      // discount: pricesummary.discount,
      // totalDiscountedPrice: pricesummary.totalDiscountedPrice,
    };

    try {
      dispatch(placeOrder(orderData));

      toast.success("Order placed successfully");
      navigate("/paymentsuccess");
    } catch (error) {
      console.log("Failed to place order:", error);
      toast.error("Failed to place order");
    }
  };

  // console.log(items[1].discount)

  return (
    <section className="bg-[#f1f3f6] flex items-center lg:h-[100vh] justify-center">
      <div
        className="flex items-center cursor-pointer w-full top-0 fixed bg-orange-500 px-7 py-1 shadow-md"
        onClick={handleLogoClick}
      >
        <img
          src={paymentlogo}
          alt="Logo"
          className="h-14 w-14" // Adjust the size as needed
          crossOrigin="anonymous"
        />
        <p className="font-bold text-white lg:text-2xl text-lg">
          Apala<span className="text-gray-600">Bajar</span>
        </p>
      </div>
      <div className="flex flex-col mt-10  gap-[22px] bg-transparent overflow-auto min-h-max lg:flex-row justify-between p-4">
        <div className="w-full bg-white rounded-md lg:w-[70vw]">
          <form className=" p-5 shadow-md min-h-full rounded-md">
            <div className="border rounded-md shadow-md mb-4 ">
              <div className="flex items-center  mb-4">
                <h2 className="text-lg font-bold uppercase text-white px-4 p-2 w-full bg-orange-500 rounded-md">
                  Select a delivery mode
                </h2>
              </div>
              <div className=" color-orange-500 rounded-lg p-4 flex items-center mb-4">
                <input
                  type="radio"
                  required
                  name="delivery_mode"
                  className="mr-2"
                  checked={deliveryModeChecked}
                  onChange={() => setDeliveryModeChecked(!deliveryModeChecked)}
                />
                <FcHome className="text-xl mr-1" />
                <span>Home Delivery</span>
                <span className="ml-2 bg-secondary text-secondary-foreground px-2 py-1 rounded line-through">
                  Flat ₹29
                </span>
                <span className="ml-2 text-green-600">₹0</span>
              </div>
            </div>

            <div className=" max-h-60 overflow-y-auto rounded-lg shadow-md mb-4 ">
              <h2 className="text-lg rounded-md font-bold mb-4 p-2 px-4 w-full text-white uppercase bg-orange-500">
                Saved addresses
              </h2>

              {address && address.length > 0 ? (
                address.map((add) => (
                  <div
                    key={add._id}
                    className=" rounded-lg p-4 flex items-center mb-4"
                  >
                    <input
                      type="radio"
                      required
                      name="saved_address"
                      className="mr-6 bg-white"
                      checked={savedAddressChecked === add._id}
                      onChange={() => setSavedAddressChecked(add._id)}
                    />
                    <div id={add._id} className="flex-1">
                      <p className="font-semibold">{add.fullName}</p>
                      <p className="text-muted-foreground">
                        {add.houseNumber}, {add.landMark}, {add.area} {add.city}{" "}
                        - {add.zipCode}, landmark: {add.landMark}, {add.state}{" "}
                        Mob No: {add.mobile}
                      </p>
                    </div>

                    <RiDeleteBin7Fill
                      className="hover:bg-red-300 text-4xl  p-2 rounded-full"
                      onClick={() => handleDelete(add._id)}
                    />
                  </div>
                ))
              ) : (
                <div className="border rounded-lg p-4 flex items-center mb-4">
                  Add address
                </div>
              )}
            </div>
            <button
              type="button"
              className="flex items-center bg-blue-500 text-gray-200 font-semibold px-2 py-2 rounded-lg"
              onClick={handleOpenForm}
            >
              + Add New Address
            </button>
          </form>
        </div>
        {items && items[1] ? (
          <>
            <div className="max-w-sm mx-auto h-fit bg-card text-card-foreground bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">PRICE SUMMARY</h2>
              <div className="mb-2 flex justify-between">
                <span>
                  Price ({items[1].totalItem} items)
                  <button
                    className="border-none focus:none mx-5 text-blue-600"
                    onClick={() => setOpen(!open)}
                  >
                    View
                  </button>
                </span>
                <span className="text-green-500 font-bold">
                  ₹{items[1].totalPrice}
                </span>
              </div>
              <div className="mb-2 flex justify-between">
                <span>Discount</span>
                <span>- ₹{items[1].discount}</span>
              </div>
              <div className="mb-2 flex justify-between">
                <span>Delivery charge</span>
                <div className="space-x-3">
                  <span className="text-red-500">Free</span>
                  <span className="text-green-500 line-through">₹20</span>
                </div>
              </div>
              <div className="mb-2 flex justify-between">
                <span>Applied Coupon of</span>
                <span className="text-green-500">
                  ₹{items[1].couponPrice}
                </span>
              </div>
              <div className="mb-2 flex justify-between">
                <span>Your Savings</span>
                <span className="text-orange-500">

                  ₹{items[1].discount + items[1].couponPrice + 20}

                </span>
              </div>
              <hr className="my-4 border-muted" />
              <div className="mb-1 font-semibold flex justify-between">
                <span className="font-bold text-xl">Total Amount</span>

                <span className="font-bold text-xl">₹{items[1].totalDiscountedPrice}</span>


              </div>
              <div className="text-xs pb-3">
                You will save ₹{items[1].discount} on this order
              </div>
              <div className="mt-4 flex-col lg:flex-row justify-center flex-wrap items-center space-y-4">
                <button
                  className={buttonClass(
                    deliveryModeChecked && savedAddressChecked
                  )}
                  disabled={!deliveryModeChecked || !savedAddressChecked}
                  onClick={handleOrder}
                >
                  PAY ON DELIVERY (COD)
                </button>
                <div className="text-center text-muted-foreground mb-2">OR</div>
                <button
                  className={buttonClass(
                    deliveryModeChecked && savedAddressChecked
                  )}
                  disabled={!deliveryModeChecked || !savedAddressChecked}
                  onClick={handlePayment}
                >
                  PAY NOW (PREPAID)
                </button>
              </div>
              <div className="mt-6 flex px-4 items-center text-muted-foreground text-sm">
                <IoShieldCheckmark className="mr-2 text-gray-500 text-4xl" />
                <span className="text-xs font-bold text-gray-500">
                  Safe and Secure Payments. Easy returns. 100% Authentic
                  products.
                </span>
              </div>
            </div>
          </>
        ) : (
          <div>Loading...</div>
        )}

        {/*-------------------- code for view carts product------------------------- */}

        <Dialog open={open} onClose={setOpen} className="relative z-10">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
          />

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <DialogPanel
                  transition
                  className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
                >
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <DialogTitle className="text-lg font-medium text-gray-900">
                          Shopping cart
                        </DialogTitle>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                          >
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Close panel</span>X
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          <ul
                            role="list"
                            className="-my-6 divide-y divide-gray-200"
                          >
                            {items &&
                              items.length > 0 &&
                              Array.isArray(items[0]) &&
                              items[0].map((product) => {
                                // Declare the imageUrl before returning JSX
                                const imageUrl = Array.isArray(
                                  product.product.imageUrl
                                )
                                  ? product.product.imageUrl[0] // Use the first image if it's an array
                                  : product.product.imageUrl; // Use the single image if it's a string

                                return (
                                  <li
                                    key={product.product._id}
                                    className="flex py-6"
                                  >
                                    {/* Image Container */}
                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                      <img
                                        alt={product.product.title}
                                        src={imageUrl} // Use the imageUrl variable
                                        className="h-full w-full object-cover object-center"
                                      />
                                    </div>

                                    {/* Product Details */}
                                    <div className="ml-4 flex flex-1 flex-col">
                                      <div>
                                        <div className="flex justify-between text-base font-medium text-gray-900">
                                          <h3>{product.product.title}</h3>
                                          <p className="ml-4 line-through">
                                            ₹{product.product.price}
                                          </p>
                                          <p className="ml-4">
                                            ₹{product.product.discountedPrice}
                                          </p>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-500">
                                          {product.color ? product.color : null}
                                        </p>
                                      </div>
                                      <div className="flex flex-1 items-end justify-between text-sm">
                                        <p className="text-gray-500">
                                          Qty {product.quantity}
                                        </p>
                                      </div>
                                    </div>
                                  </li>
                                );
                              })}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogPanel>
              </div>
            </div>
          </div>
        </Dialog>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
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
                  <p className="text-green-500">
                    Delivery is available for this city and pincode!
                  </p>
                )}
                {(cityError || pincodeError) && (
                  <p className="text-red-500">{cityError}</p>
                )}

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
                {isDeliverable && isDeliverable !== null && (
                  <p className="text-green-500">Address is deliverable.</p>
                )}
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

export default Checkout;
