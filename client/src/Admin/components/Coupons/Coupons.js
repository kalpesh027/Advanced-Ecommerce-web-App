import React, { useState,useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag, faPercentage, faCalendarAlt, faDollarSign, faTimes,faUser,faEnvelope,faComment } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { createCoupon, fetchCoupons, deleteCoupon, updateCoupon } from "../../../Redux/Coupons/couponSlice";
import { ToastContainer, toast } from 'react-toastify';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import EditIcon from '@mui/icons-material/Edit';



const ModalForm = ({ isOpen, coupon, onClose, discountType}) => {
    const dispatch = useDispatch();
    const [updatediscountType, setDiscountType] = useState(discountType || 'percentage');

    const defaultCoupon = {
        code: '',
        discountType: 'percentage',
        discountValue: '',
        expirationDate: ''
    };
    const [updateform, setupdateForm] = useState({
        code: coupon ? coupon.code : defaultCoupon.code,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setupdateForm({ ...updateform, [name]: value });
    };

    const handleSubmit = (coupon,e) => {
        e.preventDefault();
        // console.log("this is form: ",form);
        dispatch(updateCoupon({id: coupon._id , couponData:updateform })).then((response) => {
        if (response.error) {
            toast.error('Failed to update coupon');
        } else {
            toast.success('Coupon updated successfully');
            dispatch(fetchCoupons());
            setupdateForm({});
        }
        });
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
          <div className="flex justify-between items-center border-b pb-3">
            <h2 className="text-2xl font-bold">Edit Coupon</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
            </button>
          </div>
          <div className="mb-4 mt-3 flex items-center">
            <div className="mr-3 text-blue-500">
              <FontAwesomeIcon icon={faTag} />
            </div>
            <input
              type="text"
              name="code"
              placeholder={coupon.code}
              onChange={ (e) => handleChange(e)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4 flex items-center">
            <div className="mr-3 text-blue-500">
              <FontAwesomeIcon icon={faDollarSign} />
            </div>
            <select
              name="discountType"
              value={updatediscountType}
              onChange={(e) => setDiscountType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </div>
          <div className="mb-4 flex items-center">
            <div className="mr-3 text-blue-500">
              <FontAwesomeIcon icon={updatediscountType === "percentage" ? faPercentage : faDollarSign} />
            </div>
            <input
              type="number"
              name="discountValue"
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder={updatediscountType === "percentage" ? coupon.discountValue+" (%)" : coupon.discountValue+" Amount"}
            />
          </div>
          <div className="mb-4 flex items-center">
            <div className="mr-3 text-blue-500">
              <FontAwesomeIcon icon={faCalendarAlt} />
            </div>
            <input
              type="date"
              name="expirationDate"
              placeholder={coupon.expirationDate}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <button type="submit" onClick={(e) => handleSubmit(coupon,e)} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md">Save Changes</button>
          {/* <button type="submit"  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md">Save Changes</button> */}
        </div>
      </div>
    );
  };




export default function CouponPage() {
    const dispatch = useDispatch();
    const [discountType, setDiscountType] = useState("percentage");
    const { coupons, status } = useSelector((state) => state.coupons);
    const [isModalOpen, setModalOpen] = useState(false);
    const [editCoupon, setEditCoupon] = useState(null);


    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const [form, setForm] = useState({
        // code: '',
        discountType: discountType,
        // discountValue: '',
        // expirationDate: '',
        // usageLimit: '',
        // usageCount: '',
      });

    useEffect(() => {
        setForm((prevForm) => ({
            ...prevForm,
            discountType: discountType,
        }));
    }, [discountType]);


    useEffect(() => {
        dispatch(fetchCoupons());
    }, [dispatch]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log("this is form: ",form);
        dispatch(createCoupon(form)).then((response) => {
        if (response.error) {
            toast.error('Failed to create coupon');
        } else {
            toast.success('Coupon created successfully');
            dispatch(fetchCoupons());
            setForm({
                discountType: discountType,
            });

        }
        });
    };

    const handleDiscountTypeChange = (e) => {
        const newDiscountType = e.target.value;
        setDiscountType(newDiscountType);
        console.log("discountType", newDiscountType);
    };


    const handleDelete = (couponId, event) => {
        event.preventDefault();
        dispatch(deleteCoupon(couponId)).then((response) => {
            if (response.error) {
                toast.error('Failed to delete Coupon');
              } else {
                toast.success('Coupon deleted successfully');
                dispatch(fetchCoupons());
              }
            });
    };

    const handleEdit = (coupon,e) => {
        e.preventDefault();
        openModal();
        setEditCoupon(coupon);  

    }

    
    const couponsArray = Array.isArray(coupons) ? coupons : [];
    console.log("COUPONSARRAY: ", couponsArray);

    return (
        <div className="flex flex-col lg:flex-row justify-center items-start m-10">
            {/* Existing Coupons */}
            <div className="w-full lg:w-1/2 pr-0 lg:pr-4 mb-8 lg:mb-0">
                <h2 className="text-lg font-bold mb-4">Active Coupons</h2>
                <div className="bg-green-100 p-8 rounded-lg shadow-md">
                    {status === "succeeded" ? (
                         couponsArray.map((coupon) => (
                            <div key={coupon._id} className="mb-4 p-2 bg-white rounded-lg items-center hover:scale-[1.02] transition duration-300">
                            <div className="flex justify-between p-4 bg-white rounded-lg items-center border-2 border-dashed border-gray-500">
                                <div className="flex items-center">
                                    <div className="mr-3 text-blue-500">
                                        <LocalOfferIcon/>
                                    </div>
                                    <div>
                                        <p className="text-gray-800 font-medium">{coupon.code}: {coupon.discountType === "percentage" ? `${coupon.discountValue}% off` : `${coupon.discountValue} off`}</p>
                                        <p className="text-gray-600">Expires on {new Date(coupon.expirationDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex">
                                    <div className="mr-3 text-green-300 hover:text-green-500" onClick={(e) => handleEdit(coupon,e)}>
                                        <EditIcon />
                                    </div>
                                    <div className="mr-3 text-red-300 hover:text-red-500" onClick={(e) => handleDelete(coupon._id,e)}>
                                        <RemoveCircleIcon />
                                    </div>
                                </div>
                                
                            </div>
                            </div>

                        ))
                    ) : (
                        <p>No coupons available.</p>
                    )}
                    <ModalForm 
                        coupon = {editCoupon}
                        isOpen={isModalOpen}
                        onClose={closeModal}
                        handleChange = {handleChange}
                        discountType = {discountType}
                        setDiscountType = {setDiscountType}
                        handleSubmit = {handleSubmit}
                        
                    />
                    </div>
                </div>
            
            {/* This form is to Create Coupons */}
            <div className="w-full lg:w-1/2 pl-0 lg:pl-4">
                <h2 className="text-lg font-bold mb-4">Create New Coupon</h2>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <div className="mb-4 flex items-center">
                        <div className="mr-3 text-blue-500">
                            <FontAwesomeIcon icon={faTag} />
                        </div>
                        <input type="text" name="code" placeholder="Coupon Code" onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" />
                    </div>
                    <div className="mb-4 flex items-center">
                        <div className="mr-3 text-blue-500">
                            <FontAwesomeIcon icon={faDollarSign} />
                        </div>
                        <select
                            value={discountType}
                            name="discountType"
                            onChange={handleDiscountTypeChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="percentage">Percentage</option>
                            <option value="fixed">Fixed Amount</option>
                        </select>
                    </div>
                    <div className="mb-4 flex items-center">
                        <div className="mr-3 text-blue-500">
                            <FontAwesomeIcon icon={discountType === "percentage" ? faPercentage : faDollarSign} />
                        </div>
                        <input
                            type="number"
                            name="discountValue"
                            placeholder={discountType === "percentage" ? "Discount (%)" : "Discount Amount"}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div className="mb-4 flex items-center">
                        <div className="mr-3 text-blue-500">
                            <FontAwesomeIcon icon={faCalendarAlt} />
                        </div>
                        <input type="date" name="expirationDate" placeholder="Expiration Date" onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" />
                    </div>
                    <button type="submit" onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md">Create Coupon</button>
                </div>
            </div>
        </div>
    );
}
