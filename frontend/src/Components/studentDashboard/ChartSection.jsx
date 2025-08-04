import React from "react";
import { Bar } from "react-chartjs-2";
import annotationPlugin from "chartjs-plugin-annotation";
import { BarChart3, TrendingUp } from "lucide-react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    LineController,
    BarController,  
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    LineController, 
    BarController,  
    Title,
    Tooltip,
    Legend,
    Filler,
    annotationPlugin
);

const ChartSection = ({ activeTab, chartData }) => {
    const hasData = chartData?.labels && chartData.labels.length > 0;
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        backgroundColor: '#000000',
        scales: {
            x: {
                title: {
                    display: true,
                    text: activeTab === "OVERALL" ? "Semester" : "Subject",
                    color: "#ffffff",
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                },
                ticks: { 
                    color: "#e4e4e7", 
                    font: { 
                        size: activeTab === "OVERALL" ? 12 : 10,
                        weight: '500'
                    }
                },
                grid: { 
                    color: "rgba(255, 255, 255, 0.1)",
                    borderColor: "rgba(255, 255, 255, 0.2)"
                },
                border: {
                    color: "rgba(255, 255, 255, 0.3)"
                }
            },
            y: {
                title: {
                    display: true,
                    text: activeTab === "OVERALL" ? "Value" : "Marks",
                    color: "#ffffff",
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                },
                beginAtZero: true,
                max: 100,
                ticks: { 
                    color: "#e4e4e7",
                    font: {
                        weight: '500'
                    }
                },
                grid: { 
                    color: "rgba(255, 255, 255, 0.1)",
                    borderColor: "rgba(255, 255, 255, 0.2)"
                },
                border: {
                    color: "rgba(255, 255, 255, 0.3)"
                }
            },
        },
        plugins: {
            legend: { 
                display: true, 
                position: "top", 
                labels: { 
                    color: "#ffffff",
                    font: {
                        size: 12,
                        weight: '600'
                    },
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: 'rect'
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                titleColor: '#ffffff',
                bodyColor: '#e4e4e7',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                borderWidth: 1,
                cornerRadius: 8,
                padding: 12,
                callbacks: {
                    label: (context) => {
                        const datasetLabel = context.dataset.label || "";
                        const value = context.raw;
                        const subject = chartData.subjectDetails?.[context.dataIndex] || {};
                        return [
                            `${datasetLabel}: ${value}${datasetLabel === "Percentage" ? "%" : ""}`,
                            `Total: ${subject.marks || subject.total_marks || 0}`,
                            `Credits: ${subject.credits || 0}`,
                            `Grade: ${subject.grade || "N/A"}`,
                            `Subject: ${subject.name || subject.subject_name || "Unknown"}`,
                        ];
                    },
                },
            },
            annotation: {
                annotations: chartData?.annotations?.map((annotation) => ({
                    type: "label",
                    xValue: annotation.xValue,
                    yValue: annotation.yValue,
                    content: annotation.content,
                    backgroundColor: annotation.backgroundColor || 'rgba(255, 255, 255, 0.9)',
                    color: annotation.color || '#000000',
                    position: annotation.position,
                    font: { size: 12, weight: 'bold' },
                    padding: 8,
                    borderRadius: 6,
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    borderWidth: 1
                })) || [],
            },
        },
    };

    return (
        <div className="group relative bg-black border-2 border-zinc-800 rounded-xl overflow-hidden transition-all duration-300 hover:border-white/30 hover:shadow-2xl hover:shadow-white/10">
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative z-10 bg-zinc-900/50 border-b border-zinc-800 p-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-zinc-800 border border-zinc-700 rounded-lg group-hover:bg-white/10 transition-colors duration-300">
                        {hasData ? (
                            <BarChart3 className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors duration-300" />
                        ) : (
                            <TrendingUp className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors duration-300" />
                        )}
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-white transition-colors duration-300">
                        {activeTab === "OVERALL" ? "Overall Performance Trends" : `${activeTab} Performance`}
                    </h3>
                </div>
            </div>
            <div className="relative z-10 p-6" style={{ height: "300px" }}>
                {hasData ? (
                    <div className="h-full w-full">
                        <Bar
                            data={chartData}
                            options={chartOptions}
                            height={300}
                        />
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="p-4 bg-zinc-900 border border-zinc-700 rounded-full mb-4">
                            <TrendingUp className="w-8 h-8 text-zinc-500" />
                        </div>
                        <p className="text-zinc-400 text-lg font-medium mb-2">
                            No Data Available
                        </p>
                        <p className="text-zinc-500 text-sm">
                            No {activeTab === "OVERALL" ? "semester" : "subject"} data available for {activeTab}.
                        </p>
                    </div>
                )}
            </div>
            <div className="absolute inset-0 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10"></div>
        </div>
    );
};

export default ChartSection;