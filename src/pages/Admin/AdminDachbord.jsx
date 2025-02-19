import React, { useState } from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { FaBars, FaTimes } from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import statistics from "@/fakeData/states";
import Orders from "./Orders";
import Product from "./Product";
import Categories from "./Categories";
import ManageAccount from "./ManageAcount";
import ManageSeller from "./ManageSaller";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("profits");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Calculate total statistics
  const totalProfits = Math.floor(
    Object.values(statistics).reduce((sum, month) => sum + month.thisYear, 0) /
      1000
  ); // Convert to thousands for display

  const totalOrders = 326;
  const totalProducts = 1278;
  const totalCategories = 14;

  // Prepare data for charts
  const months = Object.keys(statistics).map(
    (month) => month.charAt(0).toUpperCase() + month.slice(1)
  );
  const thisYearData = Object.values(statistics).map(
    (month) => month.thisYear / 1000
  ); // Convert to thousands
  const lastYearData = Object.values(statistics).map(
    (month) => month.lastYear / 1000
  ); // Convert to thousands

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value}k`,
        },
      },
    },
  };

  const barChartData = {
    labels: months,
    datasets: [
      {
        label: "This Year",
        data: thisYearData,
        backgroundColor: "rgba(59, 130, 246, 0.8)", // Blue
      },
      {
        label: "Last Year",
        data: lastYearData,
        backgroundColor: "rgba(147, 197, 253, 0.8)", // Light blue
      },
    ],
  };

  const lineChartData = {
    labels: months,
    datasets: [
      {
        label: "This Year",
        data: thisYearData,
        borderColor: "rgb(59, 130, 246)", // Blue
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
      },
      {
        label: "Last Year",
        data: lastYearData,
        borderColor: "rgb(147, 197, 253)", // Light blue
        backgroundColor: "rgba(147, 197, 253, 0.1)",
        tension: 0.4,
      },
    ],
  };

  const doughnutData = {
    labels: ["Products", "Orders", "Growth"],
    datasets: [
      {
        data: [45, 30, 25],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)", // Blue
          "rgba(147, 197, 253, 0.8)", // Light blue
          "rgba(191, 219, 254, 0.8)", // Lighter blue
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile Toggle Button */}
      <div className="lg:hidden w-full bg-white p-4 sticky top-0 z-30 shadow-md">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="flex items-center space-x-2 text-gray-600"
        >
          {isSidebarOpen ? <FaTimes /> : <FaBars />}
          <span>Menu</span>
        </button>
      </div>

      <div className="flex flex-1">
        {/* Sidebar - updated with sticky positioning */}
        <div
          className={`
            fixed lg:sticky top-0 left-0 h-screen overflow-y-auto
            bg-white shadow-lg
            lg:w-64 w-64 
            transform transition-transform duration-300 ease-in-out
            lg:translate-x-0 z-20
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-4 mb-8 p-6">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div>
                <h2 className="font-semibold">Youssef</h2>
                <p className="text-sm text-gray-600">Youssef@Gmail.Com</p>
              </div>
            </div>

            <nav className="space-y-2 p-6">
              {[
                "profits",
                "orders",
                "products",
                "categories",
                "Account",
                "Seller",
              ].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg capitalize transition-colors ${
                    activeTab === tab
                      ? "bg-gray-100 font-semibold"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeTab === "profits" && (
            <div className="space-y-6">
              <div className="grid lg:grid-cols-4 grig-cols-1 sm:grid-cols-2 gap-4">
                <StatCard title="Total Profits" value={`$${totalProfits}k`} />
                <StatCard title="Total Orders" value={totalOrders} />
                <StatCard title="Total Products" value={totalProducts} />
                <StatCard title="Categories" value={totalCategories} />
              </div>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm h-96">
                  <Line data={lineChartData} options={chartOptions} />
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm h-96 ">
                  <Doughnut data={doughnutData} />
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm h-96 md:col-span-2">
                  <Bar data={barChartData} options={chartOptions} />
                </div>
              </div>
            </div>
          )}
          {activeTab === "orders" && <Orders />}
          {activeTab === "Account" && <ManageAccount />}
          {activeTab === "Seller" && <ManageSeller />}
          {activeTab === "products" && <Product />}
          {activeTab === "categories" && <Categories />}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-gray-600 mb-2">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
