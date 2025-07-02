import { useDispatch, useSelector } from 'react-redux';
import React from 'react';
import { useEffect, useState } from 'react';
import { fetchProducts } from '../../../Redux/Product/productSlice';
import SelectedProduct from './SelectedProduct'; 
import { ToastContainer, toast } from 'react-toastify';
import { createAdvertisement, fetchAdvertisements, deleteAdvertisement } from '../../../Redux/Advertisements/advertisementSlice';
import { MdOutlinePublish } from "react-icons/md";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { pink } from '@mui/material/colors';
import HeroSection from './HeroSection';
import { BiPencil } from 'react-icons/bi';
import axiosInstance from '../../../axiosConfig';




const cardClasses = ' p-4 rounded-lg shadow-lg flex-1 lg:w-[250px] h-[100px] hover:border-2 hover:border-black  bg-gradient-to-b from-cyan-300 to-blue-300 ';
const activecardClasses = ' p-4 rounded-lg shadow-lg flex-1 lg:w-[250px] h-[100px] border-2 border-black   bg-gradient-to-b from-cyan-400 to-blue-400 ';
const iconClasses = 'rounded-full p-2';
const textClasses = ' font-bold text-card-foreground';
const valueClasses = ' font-bold text-card-foreground';
const changeClasses = 'flex items-center space-x-1';
const buttonClasses = 'relative px-4 py-2 bg-gray-100 text-black rounded-md hover:bg-gray-300 hover:text-white transition duration-300';

const CardComponent = ({ isActive, onClick, title, value, content, iconBgColor }) => {
    return (
        <div className={isActive? activecardClasses : cardClasses } onClick={onClick}>
            <div className="flex items-center space-x-2 mb-2 ">
                <div className={textClasses}>{title}</div>
            </div>
            <div className={valueClasses}>{value}</div>

            <div className="mt-2">
                {content}

            </div>

        </div>
    );
};




const Advertisements = () => {
    const dispatch = useDispatch();
    const { products, status } = useSelector((state) => state.products);
    const { advertisements, status: adsstatus } = useSelector((state) => state.advertisements || {});



    const [activeTab, setActiveTab] = useState('Section 0');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [ads, setAds] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [savedProducts, setSavedProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [savedAdvertisements, setSavedAdvertisements] = useState([{"image":null}]);
    // const [publishedAdvertisements, setPublishedAdvertisements] = useState([]);

    const [sectionTitle, setsectionTitle] = useState('');
    const [editTitle, setEditTitle] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [sectionTitleId, setSectionTitleId] = useState(null);
    


    const openModal = () => {
        setEditTitle(true);
    };

    const closeModal = () => {
        setEditTitle(false);
    };

    const saveTitle = (newTitle) => {
        setsectionTitle(newTitle);
    };



    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchAdvertisements());
        console.log("these are advts: ", advertisements);
    }, [dispatch]);



    const SectionTabs = [
        'Section 0', 
        'Section 1', 
        'Section 2', 
        'Section 3',
        'Section 4'
    ]

    const sectionAds = {
        'Section 1': {'MAX_ADS': 4},
        'Section 2': {'MAX_ADS': 4},
        'Section 3': {'MAX_ADS': 2},
        'Section 4': {'MAX_ADS': 2}
    };

  
    const handleTabClick = (title) => {
        setActiveTab(title);
        const filteredAds = savedProducts.filter(ad => ad.section === title);
        setAds(filteredAds);
        console.log("this is active tab value: ",activeTab);
    };

    useEffect(() => {
        
        if (status === 'succeeded') {
            if (searchTerm) {
                setFilteredProducts(
                    products.filter((product) =>
                        product.title.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                );
            } else {
                setFilteredProducts([]);
            }
        }
    }, [searchTerm,products,status]);

    // console.log("prooo ", products);
    // console.log("filtereddd :", filteredProducts);

    const handleProductSelect = (product) => {
        console.log("product selected: ", product);
        setSelectedProduct({
            product: product._id,
            title: product.title,
            imageUrl: product.imageUrl,
            section: activeTab
        });
        setIsModalOpen(true);
        setFilteredProducts([]);
        setSearchTerm(product.title);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectedProduct({ ...selectedProduct, [name]: value });
    };

    const handleFileChange = (savedAdvertisement, e) => {
        e.preventDefault();
        const file = e.target.files[0];
        const name = e.target.name; 
        savedAdvertisement[name] = file;
    };


    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('savedSelectedProducts')) || [];
        setSavedAdvertisements(saved);
        console.log("these are savedproducts: ",saved);
    }, []);

    const handleSave = () => {
        const selecProduct = selectedProduct;
        const updatedAdvertisements = [ ...savedAdvertisements, selecProduct];
        localStorage.setItem('savedSelectedProducts', JSON.stringify(updatedAdvertisements));
        setSavedAdvertisements(updatedAdvertisements);
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    const handlemodalclose =() => {
        setIsModalOpen(false);
    }

    const handleDelete = (Product,event) => {
        console.log("inside handleDelte");
        event.preventDefault();
        const SAds = JSON.parse(localStorage.getItem('savedSelectedProducts')) || [];
        const updateddAds = SAds.filter(ad => ad.product !== Product.product);
        console.log("inside handleDelte updateads");

        localStorage.setItem('savedSelectedProducts', JSON.stringify(updateddAds));
        setSavedAdvertisements(updateddAds);
        console.log("inside handleDelte setads");

    };


    const handlePublish = (savedAdvertisement, event) => {
        event.preventDefault();
        const publishformData = new FormData();
        for (const key in savedAdvertisement) {
            publishformData.append(key, savedAdvertisement[key]);
        }
        console.log("publishformData",publishformData.entries());
        // for (let pair of publishformData.entries()) {
        //     console.log(pair[0] + ': ' + pair[1]);
        // }

        dispatch(createAdvertisement(publishformData)).then((response) => {
          if (response.error) {
            toast.error('Failed to publish Advertisement');
          } else {
            toast.success('Advertisement created successfully');
            const savedAds = JSON.parse(localStorage.getItem('savedSelectedProducts')) || [];
            const updatedAds = savedAds.filter(ad => ad.product !== savedAdvertisement.product);
            console.log("updatedAds_after publish: ",updatedAds);
            localStorage.setItem('savedSelectedProducts', JSON.stringify(updatedAds));

            setSavedAdvertisements(updatedAds);
            dispatch(fetchProducts());
            dispatch(fetchAdvertisements());
          }
        });
    };

    const handleDeleteAdvertisement = (publishedAdvertisementId, event) => {
        event.preventDefault();
        dispatch(deleteAdvertisement(publishedAdvertisementId)).then((response) => {
            if (response.error) {
                toast.error('Failed to delete Advertisement');
              } else {
                toast.success('Advertisement deleted successfully');
                dispatch(fetchAdvertisements());
              }
            });

    };

    useEffect(() => {
        const fetchSectionTitles = async () => {
            try {
                const response = await axiosInstance.get('/advertisementSectionTitle/view');
                
                if (response.status === 200) {
                    const titles = response.data.data; 

                    const filteredTitle = titles.find(title => title.section === activeTab);
                    console.log("titles: ",titles);
                    console.log("filteredTitle: ",filteredTitle);

                    if (filteredTitle) {
                        setsectionTitle(filteredTitle.title);
                        setSectionTitleId(filteredTitle._id);
                    }
                    else{
                        setsectionTitle('');
                        setSectionTitleId('');
                    }
                }
            } catch (error) {
                console.error('Error fetching section titles:', error);
            } finally {
            }
        };

        if (activeTab) {
            fetchSectionTitles();
        }
    }, [activeTab]);

    const EditTitleModal = ({ isOpen, onClose, title, onSave,sectionTitleId }) => {
        const [inputValue, setInputValue] = useState(title);

        useEffect(() => {
            setInputValue(title);  // Sync with prop updates
        }, [title]);

        const handleSave = async () => {
            if (!inputValue.trim()) {
                setInputValue(".");
            }
            console.log("sectionTitleId: ",sectionTitleId)
    
            try {
                let response;
                if (sectionTitleId) {
                    response = await axiosInstance.put(`/advertisementSectionTitle/update/${sectionTitleId}`, {
                        title: inputValue,
                        section: activeTab,  
                    });
                } else {
                    response = await axiosInstance.post('/advertisementSectionTitle/create', {
                        title: inputValue,
                        section: activeTab,  
                    });
                }
    
                if (response.status === 200 || response.status === 201) {
                    onSave(inputValue);
                    onClose(); 
                }
            } catch (error) {
                console.error('Error saving section title:', error);
            }
        };
    
        if (!isOpen) return null;
    
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-md w-96">
                    <h2 className="text-lg font-bold mb-4">Edit Title</h2>
                    <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter Section Title...."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                    <div className="flex justify-end mt-4">
                        <button 
                            onClick={onClose} 
                            className="px-4 py-2 mr-2 bg-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-400">
                            Cancel
                        </button>
                        <button 
                            onClick={handleSave} 
                            className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600">
                            Save
                        </button>
                    </div>
                </div>
            </div>
        );
    };
    

    return (
        <div className="mx-auto bg-[#eff4f8]  pt-16 w-fit">
            <ToastContainer />

            <div className="flex pl-3 pr-3 flex-wrap gap-4">
                {SectionTabs.map((SectionTab) => (
                    <CardComponent
                        key={SectionTab.id}
                        title={SectionTab}
                        content="Stats for Ads"
                        isActive={activeTab === SectionTab}
                        onClick={() => handleTabClick(SectionTab)}
                    />
                ))}
            </div>
            { activeTab !== "Section 0" ? (

            

            <div className="m-10 mt-8 ml-0 pl-3 mr-0 w-auto  md:grid max-md:flex max-md:flex-col max-md:flex-col-reverse md:grid-cols-2 gap-20">
                <div>
                    <div className='bg-white p-4 mb-2 rounded-md'>
                        <div className='flex justify-start'>
                            <h1 className="text-lg font-bold">Section Title</h1>
                        </div>
                        <div>
                            <div className='border m-2 ml-0 bg-orange-100 border-solid p-2  w-fit rounded-md border-orange-600 text-zinc font-semibold' >{sectionTitle}</div>
                            <button onClick={openModal} className="flex items-center p-2 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600">
                                <BiPencil className="h-5 w-5 mr-2" />
                                Edit Title
                            </button>
                        </div>
                        

                        <EditTitleModal 
                            isOpen={editTitle} 
                            onClose={closeModal} 
                            title={sectionTitle} 
                            onSave={saveTitle} 
                            sectionTitleId={sectionTitleId}
                        />
                    </div>
                    <h1 className="text-lg font-bold">Saved Ads</h1>
                    
                    {savedAdvertisements.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {savedAdvertisements
                            .filter(savedAdvertisement => savedAdvertisement.section == activeTab)
                            .map((savedAdvertisement) => (
                                <li key={savedAdvertisement.id} className="py-4 flex rounded-lg bg-white p-2  items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <img src={savedAdvertisement.imageUrl} alt={savedAdvertisement.title} className="w-20 h-20 object-cover rounded-md" />
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-800">{savedAdvertisement.title}</h3>
                                            <p className="mt-2 text-sm text-gray-600">{savedAdvertisement.description}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <input
                                            type="file"
                                            name="image"
                                            onChange={(e) => handleFileChange(savedAdvertisement,e)}
                                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                        />
                                    </div>
                                    
                                    <div className="flex space-x-3">
                                        <button  onClick={(e) => handlePublish(savedAdvertisement, e)} ><CloudUploadIcon  color="success" fontSize="large"/></button>
                                        <button onClick={(e) => handleDelete(savedAdvertisement, e)}><DeleteIcon sx={{ color: pink[500] }} fontSize="large" /></button>
                                        <button ><EditNoteIcon fontSize="large" /></button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No saved Ads available for this section.</p>
                    )}
                    <h2 className="text-lg font-semibold mb-4 mt-8">Published Ads</h2>
                    {adsstatus === 'succeeded' &&
                        (advertisements.length > 0 ? (
                            <ul className="divide-y grid grid-cols-1 gap-2 divide-gray-200">
                                {advertisements
                                .filter(publishedAdvertisement => publishedAdvertisement.section == activeTab)
                                .map((publishedAdvertisement) => (
                                    <li key={publishedAdvertisement.id} className="p-4  rounded-lg bg-white flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <img src={publishedAdvertisement.imageUrl} alt={publishedAdvertisement.title} className="w-20 h-20 object-cover rounded-md" />
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-800">{publishedAdvertisement.title}</h3>
                                                <p className="mt-2 text-sm text-gray-600">{publishedAdvertisement.description}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex space-x-3">
                                            <button className="px-3 py-1 rounded-md bg-red-500 text-white hover:bg-red-600" onClick={(e) => handleDeleteAdvertisement(publishedAdvertisement._id, e)}>Delete</button>
                                            {/* <button className="px-3 py-1 rounded-md bg-green-500 text-white hover:bg-green-600">Edit</button> */}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No published ads available for this section.</p>
                        )) }
                </div>

                <div>
                    <h2 className="text-lg font-semibold mb-4">Search Product for Advertisement</h2>
                    <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        placeholder="Search product..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {status === 'loading' && <p>Loading products...</p>}
                    {status === 'failed' && <p>Error fetching products</p>}
                    {filteredProducts.length > 0 && (
                        <ul className="mt-4 max-h-60 overflow-y-auto divide-y divide-gray-200 bg-white rounded-md shadow-lg">
                            {filteredProducts.map((product) => (
                                <li
                                    key={product._id}
                                    className="flex items-center py-2 px-4 cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleProductSelect(product)}
                                >
                                    <img src={product.imageUrl} alt={product.title} className="w-12 h-12 object-cover rounded-full mr-4" />
                                    <div>
                                        <h3 className="text-lg font-semibold">{product.title}</h3>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                    {filteredProducts.length === 0 && searchTerm && (
                        <p className="mt-4 text-sm text-gray-500">No products found</p>
                    )}

                    {selectedProduct && (
                        <div className="mt-8">
                            {isModalOpen && (
                                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                                        <button
                                            className="absolute top-0 right-0 mt-4 mr-4 text-gray-600 hover:text-gray-900"
                                            onClick={() => setIsModalOpen(false)}
                                        >
                                            &times;
                                        </button>
                                        <SelectedProduct
                                            selectedProduct={selectedProduct}
                                            handleChange={handleChange}
                                            handleSave={handleSave}
                                            handlePublish={handlePublish}
                                            handlemodalclose = {handlemodalclose}
                                            handleFileChange = {handleFileChange}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                    )}
                </div>
            </div> )
            :
            ( 
                 <HeroSection 
                 advertisements={advertisements} 
                 status={adsstatus} 
                 searchstatus = {status}
                 filteredProducts = {filteredProducts}
                 searchTerm = {searchTerm}
                 setSearchTerm = {setSearchTerm}
                 activeTab={activeTab}
                 handleDeleteAdvertisement = {handleDeleteAdvertisement}
                 handleProductSelect = {handleProductSelect}
                 selectedProduct = {selectedProduct}
                 isModalOpen = {isModalOpen}
                 setIsModalOpen = {setIsModalOpen}
                 handleChange={handleChange}
                 handleSave = {handleSave}
                 handlePublish = {handlePublish}
                 handlemodalclose = {handlemodalclose}
                 SelectedProduct={SelectedProduct}
                 
                 />
            ) }
        </div>
    );
};

export default Advertisements;