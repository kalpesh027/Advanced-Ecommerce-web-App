import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { addTimeLocation, deleteTimeLocation, fetchAllTimeLocations, updateTimeLocation } from '../../../Redux/Time_location/TimelocationSlice';
import moment from "moment";
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

const TimeLocation = () => {
  const dispatch = useDispatch();
  const locations = useSelector((state) => state.TimeLocation.locations);

  const loading = useSelector((state) => state.TimeLocation.loading);

  const [alladdresses, setallAddresses] = useState([]);
  const [pincode, setPinCode] = useState('');
  const [start, setstarttime] = useState('');
  const [end, setendtime] = useState('');
  const [day, setSelectedDay] = useState('');
  const [city, setCity] = useState('');
  const [area, setarea] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchAllTimeLocations());
  }, [dispatch]);

  useEffect(() => {
    setallAddresses(locations);
  }, [locations]);

  const handleAddOrUpdate = () => {
    if (pincode && start && end && day && city && area) {
      const newEntry = { area, pincode, start, end, day, city };

      const isStartEarlier = moment(start, 'HH:mm').isBefore(moment(end, 'HH:mm'));

      if (!isStartEarlier) {
        toast.error('Start time must be earlier than end time.');
        return;
      }

      if (editingIndex !== null) {
        dispatch(updateTimeLocation({ ...newEntry, id: alladdresses[editingIndex]._id }));
        toast.success('Address updated successfully!');
        setEditingIndex(null);
      } else {
        dispatch(addTimeLocation(newEntry));
        toast.success('Address added successfully!');
      }

      resetForm();
    } else {
      toast.warn('Please fill in all fields.');
    }
  };

  const resetForm = () => {
    setPinCode('');
    setstarttime('');
    setendtime('');
    setSelectedDay('');
    setCity('');
    setarea('');
  };

  const handleEdit = (index) => {
    const addressToEdit = alladdresses[index];
    setarea(addressToEdit.area);
    setPinCode(addressToEdit.pincode);
    setstarttime(addressToEdit.start);
    setendtime(addressToEdit.end);
    setSelectedDay(addressToEdit.day);
    setCity(addressToEdit.city);
    setEditingIndex(index);
  };

  const handleDelete = (id) => {
    dispatch(deleteTimeLocation(id));
    toast.success('Address deleted successfully!');
  };

  const filteredAddresses = alladdresses.filter(address =>
    address.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    address.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(address.pincode).includes(searchQuery)
  );

  return (
    <>
      <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6 text-orange-600">Add Address Details</h1>
        <div className="mb-4 flex">
          <button
            onClick={resetForm}
            className="bg-orange-400 text-white p-3 rounded w-15 hover:bg-orange-500 transition duration-300 mr-2"
          >
            Clear
          </button>
          {editingIndex !== null && (
            <button
              onClick={() => {
                resetForm();
                setEditingIndex(null);
              }}
              className="bg-red-600 text-white p-3 rounded w-15 hover:bg-red-700 transition duration-300"
            >
              Cancel
            </button>
          )}
        </div>

        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter City"
          className="border p-3 rounded w-full mb-4 shadow-md border-orange-400"
        />

        <input
          type="number"
          value={pincode}
          onChange={(e) => setPinCode(e.target.value)}
          placeholder="Pin Code"
          className="border p-3 rounded w-full mb-2 shadow-md border-orange-400"
        />
        <input
          type="text"
          value={area}
          onChange={(e) => setarea(e.target.value)}
          placeholder="Add area"
          className="border p-3 rounded w-full mb-2 shadow-md border-orange-400"
        />

        <select
          value={day}
          onChange={(e) => setSelectedDay(e.target.value)}
          className="border p-3 rounded w-full mb-2 shadow-md border-orange-400"
        >
          <option value="">Select Day</option>
          <option value="Today">Today</option>
          <option value="Tomorrow">Tomorrow</option>
        </select>

        <span className="text-gray-600">From : </span>
        <input
          type="time"
          value={start}
          onChange={(e) => setstarttime(e.target.value)}
          className="p-2 border border-orange-400 rounded-lg w-auto focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <span className="text-gray-600"> To : </span>
        <input
          type="time"
          value={end}
          onChange={(e) => setendtime(e.target.value)}
          className="p-2 border border-orange-400 rounded-lg w-auto focus:outline-none focus:ring-2 focus:ring-orange-500"
        />

        {/* Added spacing here */}
        <button
          onClick={handleAddOrUpdate}
          className="bg-orange-600 text-white p-3 mt-4 rounded w-full hover:bg-orange-700 transition duration-300 mb-4"
        >
          {editingIndex !== null ? "Update Address" : "Add Address"}
        </button>

        <div className="mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by City, Area or Pincode"
            className="border p-3 rounded w-full mb-4 shadow-md border-orange-400"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAddresses.map((address, index) => {
            const starttime = moment(address.start, 'hh:mm').format('h:mm A');
            const endtime = moment(address.end, 'hh:mm').format('h:mm A');
            return (
              <div key={index} className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300 border border-orange-400">
                <p className="text-gray-700">City: <span className="font-semibold">{address.city}</span></p>
                <p className="font-bold text-lg mb-2">Area: {address.area}</p>
                <p className="text-gray-700">Pin Code: <span className="font-semibold">{address.pincode}</span></p>
                <p className="text-gray-700">Time Slot: <span className="font-semibold">{starttime} - {endtime}</span></p>
                <p className="text-gray-700">Day: <span className="font-semibold">{address.day}</span></p>

                <button onClick={() => handleEdit(index)} className="bg-yellow-500 text-white p-1 rounded mr-2">Edit</button>
                <button onClick={() => handleDelete(address._id)} className="bg-red-500 text-white p-1 rounded">Delete</button>
              </div>
            )
          })}
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default TimeLocation;
