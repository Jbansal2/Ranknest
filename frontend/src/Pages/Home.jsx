import React from 'react';
import '../index.css';
import Button from '../Components/Button';
import Buttons from '../Components/Buttons';
import ImageCom from '../Components/ImageCom'
import Why from '../Components/Why';
import Features from '../Components/Features';
import Footer from '../Components/Footer';
import LandingSection from '../Components/LandingSection';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="flex  flex-col  bg-black items-center p-4 sm:p-6 lg:p-8">
            {/* Hero Section */}
            <div className="text-center w-full  max-w-8xl mt-15 mx-auto">
                <div className="flex justify-center items-center pt-8 sm:pt-12 lg:pt-16">
                    <Button />
                </div>
                <div className="mt-8 sm:mt-12 lg:mt-16 mb-6 sm:mb-8">
                    <h1 className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight">
                        Welcome to Ranknest —
                        <span className="block sm:inline ml-0 sm:ml-2 mt-2 sm:mt-0">
                            Your Rank, Your Nest
                        </span>
                    </h1>
                </div>
                <p className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto mb-8 sm:mb-10 px-4">
                    Stay ahead with real-time, department-wise academic rankings, personal dashboards.
                </p>
                <div className="flex gap-3 justify-center  mb-12">
                    <Link to="/Ranklist" className="">
                        <Buttons title="Ranklist" />
                    </Link>
                    <Link to="/StudentProfile" className="">
                        <Buttons title="Profile" />
                    </Link>
                </div>
                
                <div>
                    <ImageCom />
                </div>
                <div className="mb-12 sm:mb-16 px-4">
                    <Why />
                    <p className="text-zinc-400 mt-4 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                        Personalized panel with academic scores, analytics, and rank updates.
                    </p>
                </div>
                <div className="flex justify-center items-center mb-12 sm:mb-16 px-4">
                    <Features />
                </div>
                <div className="mt-12 sm:mt-16 lg:mt-20 border border-zinc-600 sm:border-none lg:border-none rounded-lg sm:rounded-none w-full p-4 sm:p-6 lg:p-8 flex justify-center items-center mb-12 sm:mb-16">
                    <LandingSection />
                </div>
                <div className="w-full">
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default Home;