import { Link } from 'react-router-dom';
import Navbar from "../Navbar/Navbar.js";
import CheckIcon from '@mui/icons-material/Check';
import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect, useRef } from 'react';
import { fetchOrders } from '../../../Redux/Order/orderSlice';
import logo from "./logo.png"
import moment from "moment"
import { jwtDecode } from 'jwt-decode';
import { fetchUserById, updateUser } from './../../../Redux/User/userSlice.js';
import { useNavigate } from "react-router-dom";
import { ReactToPrint } from "react-to-print";

const PaymentSuccess = () => {
  const componentRef = useRef();

  const dispatch = useDispatch();
  const { orders, status, error } = useSelector((state) => state.orders || {});
  const { currentUser } = useSelector((state) => state.user);

  console.log("user", currentUser)

  const navigate = useNavigate();


  const [firstname, setFirstname] = useState("User")
  const [lastname, setLastname] = useState("")

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    console.log("token", token)

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;
        const userRole = decodedToken.role;
        setFirstname(decodedToken.firstName);
        setLastname(decodedToken.lastName);

        console.log("userRole", userRole)
        console.log("name1", firstname)
        console.log("name2", lastname)
        if (userRole !== 'CUSTOMER') {
          navigate('/forbidden'); // Redirect to Forbidden page if the user is not an ADMIN
        } else {
          dispatch(fetchUserById(userId)); // Fetch user data if the role is ADMIN
        }
      } catch (error) {
        console.error('Invalid token:', error);


      }
    }
  }, []);


  const [toggle, setToggle] = useState(false);
  let display = () => {
    setToggle((preState) => !preState);
  };

  useEffect(() => {
    dispatch(fetchOrders())
      .then((response) => {
        console.log('Fetch Orders Response:', response);
      })
      .catch((error) => {
        console.error('Error fetching orders:', error);
      });
  }, [dispatch]);


  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }




  const latestOrder = orders[orders.length - 1];
  console.log('Latest Order:', latestOrder);

  const date = moment(latestOrder && latestOrder.updatedAt).format("DD/MM/YYYY")
  console.log("date", date)


  return (
    <>
      <Navbar />
      {
        toggle ?
          (
            <div className=' min-h-[83vh]   w[100vw] mt-6  '>
              <div className='border-2 border-gray-300 w-[100vw] sm:w-[80vw] mx-auto h-auto   drop-shadow-lg' ref={componentRef}>
                {/* logo img  */}
                <div className='w-full bg-orange-600 py-2 '>
                  <div className=' flex justify-center'>
                    <img src={logo} alt="" className='h-14 w-18   mx-2' />
                    {/* <h1 className=' text-white   text-center  font-extrabold text-4xl mx-2' >Aapla Bajar</h1> */}

                  </div>
                  <p className="text-center text-white">
                    Panchayat Samiti Road, Shrigonda, Tal-Shrigonda, Dist-A.Nagar
                    <br /> Ph:5133145125
                  </p>


                </div>

                {/* user Details */}
                <div className='w-[80vw] sm:w-[56vw] mx-auto '>
                  <div className='flex justify-between'>
                    {/* login user Name */}
                    <p className='font-semibold text-lg py-3'>Name: <span className='font-normal'>{firstname} {lastname}</span></p>

                    {/* order created date */}
                    <p className='font-semibold text-lg py-3'>Date: <span className='font-normal'>{date}</span></p>
                  </div>

                  {/* order ID */}
                  <p className='font-semibold text-lg py-3'>Bill ID: <span className='font-normal'>{latestOrder && latestOrder._id}</span></p>
                </div>


                {/* product Details */}
                <table className='w-[80vw] sm:w-[56vw] mx-auto border-separate border-spacing-y-4 border-t-2 border-gray-500  '>
                  <tr>
                    <th className='text-center'>Sr No.</th>
                    <th className='text-center sm:w-[30vw]'>Product Name</th>
                    <th className='text-center'>Quantity</th>
                    <th className='text-center'>Product Price</th>
                    <th className='text-center'>Discount</th>
                  </tr>

                  {/* use Map function here to display all products */}
                  {/* Product data come from latest Order */}

                  {latestOrder && latestOrder.orderItems && latestOrder.orderItems.map((item, index) => (
                    <tr className='border-spacing-y-1.5'>
                      {/* index + 1 */}
                      <td className='text-center '>{index + 1}.</td>

                      {/* product Name */}
                      <td className='text-center'>{item.product.title}</td>

                      {/* product quantity  */}
                      <td className='text-center'>{item.quantity}</td>

                      {/* product totalprice*/}
                      <td className='text-center'>₹{(item.product.discountedPrice) * item.quantity}</td>

                      {/* product totalprice - discountedprice */}
                      <td className='text-center'>₹{(item.product.price - item.product.discountedPrice)}</td>
                    </tr>
                  ))}


                </table>

                <div className='w-[90vw] sm:w-[56vw] mx-auto  border-t-2 border-gray-500  flex justify-between mb-6 py-4 items-center'>
                  <div className=' items-center mx-8'>
                    <p className='text-center font-semibold text-lg'>Total:</p>
                  </div>

                  <div className=' flex justify-between'>

                    <p className='mr-10 sm:mr-[6vw] '>₹{latestOrder && latestOrder.totalDiscountedPrice}</p>


                    <p className='mr-6 sm:mr-[2vw] '>₹{latestOrder && latestOrder.discount + latestOrder.couponPrice + 20}</p>
                  </div>
                </div>
              </div>

              <div className='flex justify-around w-auto sm:w-[30vw] my-10 mx-auto'>
                <button className=' block  px-4 py-2 bg-red-600 text-lg font-semibold text-white rounded-lg' onClick={display}>Back</button>

                <ReactToPrint
                  trigger={() => {
                    return (
                      <button className=' block px-4 py-2 bg-green-400 text-lg font-semibold text-white rounded-lg' >Print Bill</button>

                    );
                  }}
                  content={() => componentRef.current}
                  documentTitle="new document"
                  pageStyle="print"
                />
              </div>
            </div>
          )
          :
          (
            <div className="flex flex-col md:flex-row justify-between items-stretch p-6 font-sans bg-gray-50">
              <div className="md:w-3/5 flex flex-col justify-between">
                <div className="bg-white p-6 rounded-lg shadow-md mb-6 flex flex-col justify-between h-full">
                  <div className="text-center flex-grow space-y-8">
                    <div className="flex justify-center mb-4">
                      <div className="bg-green-500 rounded-full p-4 shadow-lg flex items-center justify-center">
                        <CheckIcon className="text-white" fontSize="large" />
                      </div>
                    </div>
                    <h2 className="text-black-600 text-2xl font-semibold mb-4">
                      Order #{latestOrder && latestOrder._id} is created successfully
                    </h2>
                    <div className="mb-4">
                      <Link to="/myprofile/my-orders" className="text-green-600 hover:underline">
                        View Order
                      </Link>
                      <span className="mx-2">or</span>
                      <Link to="/" className="text-green-600 hover:underline">
                        Continue Shopping
                      </Link>
                    </div>
                    <p className="mt-4 bg-[#E6F9E6] bg-opacity-95 text-[#32cd32] text-xl p-2 px-8 rounded-xl shadow-md inline-block mb-2">
                      You Just Saved <span className="text-[#4f7942]">₹{latestOrder && latestOrder.discount + latestOrder.couponPrice + 20}</span> on Delivery Fee!
                    </p>
                    <p className="text-gray-600 mt-2">
                      You can add or remove items from this order once it is confirmed.
                    </p>

                    <div>
                      <button className='px-4 py-2 bg-[#7df37d] text-lg font-semibold text-white rounded-lg' onClick={display}>View Bill</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:w-1/3 bg-white p-6 mt-6 md:mt-0 rounded-lg shadow-md flex flex-col justify-between">
                <h3 className="text-lg font-semibold mb-4 text-center">Payment Details</h3>

                <table className="w-full mb-4">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 font-medium text-black">Total Amount:</td>
                      <td className="py-2 text-green-600 font-semibold">₹{latestOrder && latestOrder.totalPrice}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-gray-700">Cart Total:</td>
                      <td className="py-2 text-black-600 font-semibold">₹{latestOrder && latestOrder.totalDiscountedPrice
                      }</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-gray-700">Delivery Charge:</td>
                      <td className="py-2 text-black-600 font-semibold">
                        <div className="space-x-3">
                          <span className="text-red-500">Free</span>
                          <span className="text-green-500 line-through">₹20</span>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium text-orange-600">Your Savings:</td>
                      <td className="py-2 text-orange-600 font-semibold">₹{latestOrder && latestOrder.discount + latestOrder.couponPrice + 20}</td>
                    </tr>
                  </tbody>
                </table>
                <div className="text-sm text-gray-500 p-2  inline-block bg-blue-100 rounded">
                  Tax of ₹{0} has been included in the total amount.
                </div>
              </div>
            </div>
          )
      }



    </>
  );
};

export default PaymentSuccess;