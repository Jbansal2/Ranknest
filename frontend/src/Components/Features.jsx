import React from 'react';


const Features = () => {
    const data = [
        {
            title: "Real-time Updates",
            description: "Get instant updates on your academic performance and rank.",
            icon: <i className="ri-notification-badge-line"></i>,
            color: "text-blue-500"
        },
        {
            title: "Personalized Dashboard",
            description: "Access a customized dashboard with your scores and analytics.",
            icon: <i className="ri-dashboard-line"></i>,
            color: "text-green-500"
        },
        {
            title: "Department-wise Rankings",
            description: "View your rank compared to peers in your department.",
            icon: <i className="ri-trophy-fill"></i>,
            color: "text-yellow-500"
        },
    ];

    return (
        <div className="flex bg-black flex-col sm:flex-row justify-center gap-4 sm:gap-7 w-full max-w-[95%] sm:max-w-[90%] md:max-w-[90%]">
            {data.map((feature, index) => (
                <div
                    key={index}
                    className=" border-1 border-zinc-700 mt-5 text-left p-4 sm:p-5 rounded text-white shadow-lg flex flex-col transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
                >
                    <div>
                        <div className={`text-2xl sm:text-3xl mb-3 text-center ${feature.color}`}>{feature.icon}</div>
                        <h3 className="text-lg sm:text-xl font-semibold mb-2 text-center">{feature.title}</h3>
                        <p className="text-zinc-300 text-sm sm:text-base text-center">{feature.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Features;