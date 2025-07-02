import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cancelOrder, fetchAllOrdersAdmin, fetchOrders } from '../../../Redux/Order/orderSlice';
import { fetchAllAddresses } from '../../../Redux/address/AddressSlice';
import Trackorder from './trackorder';
import Updateorder from './OrderUpdate';
import OrderDetailsPopup from './OrderDetailsPopup';
import { toast } from "react-toastify";
import {
  X
} from "lucide-react";

const sharedClasses = {
  primaryButton: 'bg-primary border-[2px] border-gray-600 text-primary-foreground px-4 py-2 rounded-lg flex items-center',
  tableCell: 'p-4 text-left',
  actionButton: 'text-blue-500 px-2',
  editButton: 'text-green-500',
  deleteButton: 'text-red-500 px-2',
  dropdownButton: 'bg-gray-200 p-2 rounded-md cursor-pointer hover:bg-gray-300',
  addressContainer: 'border p-4 mt-2 rounded shadow-md',

};

const OrdersTable = () => {
  const dispatch = useDispatch();
  const { adminOrders, status, error } = useSelector((state) => state.orders);
  const { addresses } = useSelector((state) => state.addresses);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [addressSearchTerm, setAddressSearchTerm] = useState('');
  const [showAddresses, setShowAddresses] = useState(false);
  const [istrackOpen, setistrackOpen] = useState(false);
  const [trackOrder, settrackOrder] = useState(null);
  const [isCancleModalOpen, setisCancleModalOpen] = useState(true)
  const [selectedOrderId, setSelectedOrderId] = useState(null);



  useEffect(() => {
    dispatch(fetchAllOrdersAdmin());
    dispatch(fetchAllAddresses());
  }, [dispatch]);

  const handleProductClick = (order) => {
    setIsPopupOpen(true);
    setSelectedOrder(order);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedOrder(null);
  };

  const statusStyles = {
    pending: 'text-yellow-500 font-semibold',
    delivered: 'text-green-500 font-semibold',
    cancelled: 'text-red-500 font-semibold',
  };

  const getStatusClass = (status) => statusStyles[status.toLowerCase()] || '';

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const sortedOrders = [...adminOrders].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

  const filteredOrders = sortedOrders.filter(order =>
    order._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log("all orders = ", sortedOrders)


  // Slice the filtered orders for pagination
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  // Calculate total pages
  const totalPages = Math.ceil(filteredOrders.length / pageSize);

  // const paginatedOrders = sortedOrders
  //   .filter(order => order._id.toLowerCase().includes(searchTerm.toLowerCase()))
  //   .slice(startIndex, endIndex);

  // const totalPages = Math.ceil(sortedOrders.length / pageSize);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleTrack = (order) => {
    setistrackOpen(true);
    settrackOrder(order);
  }

  const handlecloseTrack = () => {
    setistrackOpen(false);
    settrackOrder(null);
    dispatch(fetchAllOrdersAdmin());
  }

  const [isUpdateOrderOpen, setIsUpdateOrderOpen] = useState(false);

  const handleEditOrder = (order) => {
    setIsPopupOpen(false);
    setSelectedOrder(order);
    setIsUpdateOrderOpen(true);
  };

  const handleeditorderClose = () => {
    setIsUpdateOrderOpen(false);
    setSelectedOrder(null);
  };

  const handleCloseUpdateOrder = () => {
    setIsUpdateOrderOpen(false);
    setSelectedOrder(null);
    dispatch(fetchAllOrdersAdmin()); // Refresh the orders after updating
  };

  const handleCancelOrder = async () => {
    if (!selectedOrderId) return;
    try {
      await dispatch(cancelOrder({ orderId: selectedOrderId })).unwrap()
      toast.success("Order cancelled successfully");
      await dispatch(fetchAllOrdersAdmin());
      setisCancleModalOpen(false);
      setSelectedOrderId(null);
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel the order");
    }
  };


  const filteredAddresses = addresses
    .flatMap(userWithAddress => userWithAddress.address)
    .filter(address =>
      address.fullName.toLowerCase().includes(addressSearchTerm.toLowerCase())
    );

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4 bg-white mx-5 my-8 rounded-lg text-card-foreground">
      {/* Orders Table */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Order List</h1>
        {/* <button className={sharedClasses.primaryButton}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 17l4 4 4-4m-4-5v9" />
          </svg>
          Export all orders
        </button> */}
      </div>
      <div className="mb-5 flex flex-col md:flex-row md:justify-between items-start">
        <input
          type="text"
          placeholder="Search by Order ID..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="border rounded p-2 w-full md:w-1/3 mb-2 md:mb-0"
        />
        {/* <button onClick={() => setSortByTime(!sortByTime)} className={`ml-2 p-2 rounded ${sortByTime ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
          Sort by Min Time
        </button> */}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr className="bg-gray-300 text-secondary-foreground">
              <th className={sharedClasses.tableCell}>Order ID</th>
              <th className={sharedClasses.tableCell}>User Name</th>
              <th className={sharedClasses.tableCell}>Price</th>
              <th className={sharedClasses.tableCell}>Quantity</th>
              <th className={sharedClasses.tableCell}>Payment</th>
              <th className={sharedClasses.tableCell}>Status</th>
              <th className={sharedClasses.tableCell}>Address</th>
              <th className={sharedClasses.tableCell}>Action</th>
            </tr>
          </thead>

          <tbody>
            {paginatedOrders.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4">No orders found</td>
              </tr>
            ) : (
              paginatedOrders.map((order) => (
                <tr key={order._id} className="border-t hover:bg-gray-100 transition duration-200">
                  <td className='p-4 text-left font-semibold hover:text-blue-500 cursor-pointer' onClick={() => handleProductClick(order)}>{order._id}</td>
                  <td className={sharedClasses.tableCell}>{order.user ? order.user.userName : 'Unknown'}</td>
                  <td className={sharedClasses.tableCell}>₹ {order.totalPrice}</td>
                  <td className={sharedClasses.tableCell}>{order.orderItems.length}</td>
                  <td className={sharedClasses.tableCell}>{order.paymentDetails.paymentMethod}</td>
                  <td className={`${sharedClasses.tableCell} ${getStatusClass(order.orderStatus)}`}>{order.orderStatus}</td>
                  <td className={sharedClasses.tableCell}>
                    {order.shippingAddress || 'N/A'}
                  </td>
                  <td className={sharedClasses.tableCell}>
                    {/* <button onClick={() => handleTrack(order)} className={sharedClasses.actionButton}>Track</button>
                    <button className={sharedClasses.editButton}>Edit</button>
                    <button className={sharedClasses.deleteButton}>Delete</button> */}


                    <button
                      onClick={() => handleTrack(order)} className="bg-transparent border border-transparent text-blue-500 px-4 py-2 rounded hover:bg-blue-500 hover:text-white transition duration-300" >
                      Track </button>
                    {order.orderStatus !== "CANCELLED" &&
                      order.orderStatus !== "DELIVERED" && (
                        <button onClick={() => handleEditOrder(order)} className="bg-transparent text-green-500 px-4 py-2 rounded hover:bg-green-500 hover:text-white transition duration-300"  > Edit </button>
                      )}
                    {order.orderStatus !== "CANCELLED" &&
                      order.orderStatus !== "DELIVERED" && (
                        <button
                          className="bg-transparent text-red-500 px-4 py-2 rounded hover:bg-red-500 hover:text-white transition duration-300"
                          onClick={() => {
                            setSelectedOrderId(order._id);
                            setisCancleModalOpen(true);
                          }}
                        >
                          Delete
                        </button>
                      )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

      </div>
      <div className="flex justify-between items-center mt-12">
        <span className='text-xs'>Showing {paginatedOrders.length} of {adminOrders.length} entries</span>
        <div className="flex space-x-2">
          <button
            className="px-3 py-1 border rounded-lg"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              className={`px-3 py-1 border rounded-lg ${currentPage === index + 1 ? 'bg-primary text-primary-foreground' : ''}`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            className="px-3 py-1 border rounded-lg"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>


      {isCancleModalOpen && selectedOrderId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Cancel Order
              </h2>
              <button
                onClick={() => setisCancleModalOpen(false)}
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
                onClick={() => setisCancleModalOpen(false)}
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

      {isPopupOpen && selectedOrder && (
        <OrderDetailsPopup order={selectedOrder} onClose={handleClosePopup} />
      )}

      {/* {isUpdateOrderOpen && selectedOrder && (
        <Updateorder
          order={selectedOrder}
          userAddresses={addresses}
          onOrderUpdated={handleCloseUpdateOrder}
        />
      )} */}


      {isUpdateOrderOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Update Order
              </h2>
              <button
                onClick={handleeditorderClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <Updateorder
              order={selectedOrder}
              userAddresses={addresses}
              onOrderUpdated={handleCloseUpdateOrder}
            />
          </div>
        </div>
      )}


      {/* Address Section */}
      <div className="mt-8">
        <div className={`${sharedClasses.dropdownButton} flex items-center justify-between`} onClick={() => setShowAddresses(!showAddresses)}>
          <span>{showAddresses ? 'Hide Addresses' : 'Show Addresses'}</span>
          <span className="ml-2">{showAddresses ? '▼' : '►'}</span> {/* Arrow indicator */}
        </div>
        {showAddresses && (
          <div className="mt-4">
            <input
              type="text"
              placeholder="Search by Full Name..."
              value={addressSearchTerm}
              onChange={e => setAddressSearchTerm(e.target.value)}
              className="border rounded-md p-2 w-full mb-4 shadow-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {filteredAddresses.length === 0 ? (
              <p className="text-center text-gray-500">No addresses found.</p>
            ) : (
              filteredAddresses.map((address) => (
                <div key={address._id} className={`${sharedClasses.addressContainer} bg-gray-100 hover:shadow-lg transition-shadow duration-200 p-4 rounded-lg border border-gray-200`}>
                  <h2 className="font-semibold text-lg">{address.fullName}</h2>
                  <p className="text-sm text-gray-600">Address: {address.streetAddress}, {address.city}, {address.state}</p>
                  <p className="text-sm text-gray-600">Area: {address.area}</p>
                  <p className="text-sm text-gray-600">Mobile: {address.mobile}</p>
                  <p className="text-sm text-gray-600">Zip Code: {address.zipCode}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      {istrackOpen && (<Trackorder order={trackOrder} onclose={handlecloseTrack} />)}
    </div>
  );
};

export default OrdersTable;
