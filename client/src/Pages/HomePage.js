// export default HomePage;
import Navbar from "../customer/Components/Navbar/Navbar.js";
import React, { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from "../customer/Components/footer/Footer";
import Slider from "react-slick";
import ProductComponent from "../customer/Components/Adverties/Adverties.js";
import FrozenSnacks from "../customer/Components/Products/Product.js";
import GadgetSection from "../customer/Components/Products/GadgetSection.js";
// import GadgetSection from '../customer/Components/Product/Products/GadgetSection.js';
import PopularBrand from "../customer/Components/Brand/Popularbrand.js";
import "./HomePage.css";

import TrendingProducts from "../customer/Components/Adverties/Tranding.js";
import HomePageAdvertisement from "../customer/Components/HomePageAdvertisement/HomePageAdvertisement.js";
import Maylike from "../customer/Components/Adverties/Maylike.js";

import { useDispatch, useSelector } from "react-redux";
import { fetchAdvertisements } from "../Redux/Advertisements/advertisementSlice.js";
import { Link } from "react-router-dom";
import AdvertisementFinal from "../customer/Components/Adverties/AdvertismentFinal.js";
import axiosInstance from "../axiosConfig.js";
import { useLocation } from "react-router-dom";

function HomePage() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 630);
  const [viewport, setViewport] = useState(window.innerWidth < 620);
  const [section0title, setSection0Title] = useState("");
  const [section1title, setSection1Title] = useState("");
  const [section2title, setSection2Title] = useState("");
  const [section3title, setSection3Title] = useState("");
  const [section4title, setSection4Title] = useState("");
  const [filteredAdvertisements, setFilteredAdvertisements] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 620;
      setIsMobile(isMobileView);
      setViewport(isMobileView);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial state

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const items = [
    {
      id: 0,
      href: "./product/1",
      src: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=2700/layout-engine/2022-05/Group-33704.jpg",
      alt: "Daily Needs",
    },
    {
      id: 1,
      href: "./product/2",
      src: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=2700/layout-engine/2022-05/Group-33704.jpg",
      alt: "Chocolates",
    },
  ];

  const dispatch = useDispatch();
  const { advertisements, status: adsstatus } = useSelector(
    (state) => state.advertisements || {}
  );

  useEffect(() => {
    dispatch(fetchAdvertisements());
  }, [dispatch]);

  useEffect(() => {
    if (adsstatus === "succeeded") {
      console.log("Fetched Advertisements:", advertisements);
      const filteredAds = advertisements.filter(
        (ad) => ad.section === "Section 0"
      );
      setFilteredAdvertisements(filteredAds);
      console.log("Filtered Advertisements for Section 0:", filteredAds);
    }
  }, [advertisements, adsstatus]);

  useEffect(() => {
    const fetchSectionTitles = async () => {
      try {
        const response = await axiosInstance.get(
          "/advertisementSectionTitle/view"
        );

        if (response.status === 200) {
          const titles = response.data.data;

          const Section0Title = titles.find(
            (title) => title.section === "Section 0"
          );
          const Section1Title = titles.find(
            (title) => title.section === "Section 1"
          );
          const Section2Title = titles.find(
            (title) => title.section === "Section 2"
          );
          const Section3Title = titles.find(
            (title) => title.section === "Section 3"
          );
          const Section4Title = titles.find(
            (title) => title.section === "Section 4"
          );

          console.log("titles: ", titles);
          console.log("Section0Title: ", Section0Title);
          console.log("Section1Title: ", Section1Title);
          console.log("Section2Title: ", Section2Title);
          console.log("Section3Title: ", Section3Title);
          console.log("Section4Title: ", Section4Title);

          Section0Title && setSection0Title(Section0Title.title);
          Section1Title && setSection1Title(Section1Title.title);
          Section2Title && setSection2Title(Section2Title.title);
          Section3Title && setSection3Title(Section3Title.title);
          Section4Title && setSection4Title(Section4Title.title);
        }
      } catch (error) {
        console.error("Error fetching section titles:", error);
      } finally {
      }
    };
    fetchSectionTitles();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 3000,
    autoplaySpeed: 2000,
    cssEase: "linear",
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col overflow-hidden bg-white">
        <div className="w-full flex justify-center items-center">
          <div className="w-7/8 overflow-hidden lg:m-1 lg:p-10 rounded-md">
            <Slider {...settings} className="rounded-md">
              {adsstatus === "loading" ? (
                <div className="w-full p-4 rounded-md">
                  <div className="flex items-center justify-center bg-gray-200 rounded-md h-[20vh] lg:h-[45vh] w-full">
                    <div class="flex justify-center items-center h-screen">
                      <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500"></div>
                    </div>
                  </div>
                </div>
              ) : filteredAdvertisements.length > 0 ? (
                filteredAdvertisements.map((publishedAdvertisement, index) => (
                  <div
                    className="w-full p-4 rounded-md"
                    key={publishedAdvertisement.id || index}
                  >
                    <div className="flex items-center justify-center bg-opacity-50 rounded-md h-1/2 w-full">
                      <img
                        src={publishedAdvertisement.imageUrl}
                        className="object-fill h-[20vh] lg:h-[45vh] w-full rounded-md"
                        alt={publishedAdvertisement.title || "Banner"}
                      />
                    </div>
                  </div>
                ))
              ) : (
                items.map((item, index) => (
                  <div className="w-full p-4 rounded-md" key={item.id || index}>
                    <div className="flex items-center justify-center bg-opacity-50 rounded-md w-full">
                      <img
                        src={item.src}
                        className="object-fill h-[20vh] lg:h-[45vh] w-full rounded-md"
                        alt={item.alt || "Skin Care"}
                      />
                    </div>
                  </div>
                ))
              )}
            </Slider>
          </div>
        </div>

        <div className="relative bg-white py-5 mt-5  mb-5">
          <TrendingProducts />
        </div>

        <GadgetSection
          section1title={section1title}
          section2title={section2title}
          advertisements={advertisements}
          status={adsstatus}
        />

        <div className="relative bg-white  py-5 mt-5  mb-5">
          <FrozenSnacks />
        </div>

        {/* <ProductComponent section3title={section3title} advertisements={advertisements} status={adsstatus} /> */}
        <HomePageAdvertisement
          section4title={section4title}
          advertisements={advertisements}
          status={adsstatus}
        />
        <AdvertisementFinal
          advertisements={advertisements}
          status={adsstatus}
        />
        <Maylike />
        <PopularBrand />
        <Footer />
      </div>
    </>
  );
}

export default HomePage;