import React from "react";



const Tabs = ({ tabs, activeTab, setActiveTab }) => {
    return (
        <div className="mt-6 sm:mt-10">
            <div className="bg-black border-2 border-zinc-800 rounded-xl p-2 shadow-2xl">
                {/* Mobile Scrollbar Hidden + Horizontal Scroll */}
                <div className="overflow-x-auto scrollbar-hide -mx-2 px-2">
                    <div className="flex space-x-2 min-w-max sm:min-w-fit">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`
 relative px-4 sm:px-8 py-2 sm:py-4 whitespace-nowrap rounded-lg
 text-sm sm:text-base font-bold transition-all duration-300 group
${activeTab === tab
                                        ? "bg-white text-black shadow-lg scale-105"
                                        : "text-zinc-400 hover:text-white hover:bg-zinc-900"}
 `}
                            >
                                {/* Inactive hover animation */}
                                {activeTab !== tab && (
                                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                                )}

                                <span className="relative z-10">{tab}</span>

                                {/* Active underline */}
                                {activeTab === tab && (
                                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-black rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Gradient line below tabs */}
            <div className="mt-1 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent"></div>
        </div>
    );
};

export default Tabs;
