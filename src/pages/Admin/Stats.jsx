import React from "react";

export default function Stats() {
  const totalOrders = 326;
  const totalProducts = 1278;
  const totalCategories = 14;
  const totalProfits = 1880;
  return (
    <div className="flex-1 p-8">
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Profits" value={`$${totalProfits}k`} />
        <StatCard title="Orders" value={totalOrders} />
        <StatCard title="Products" value={totalProducts} />
        <StatCard title="Categories" value={totalCategories} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm h-[400px]">
          <Bar options={chartOptions} data={barChartData} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm h-[400px]">
          <Line options={chartOptions} data={lineChartData} />
        </div>
      </div>

      {/* Doughnut Chart */}
      <div className="mt-6 bg-white p-6 rounded-xl shadow-sm w-full lg:w-1/3 h-[400px]">
        <Doughnut
          data={doughnutData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
          }}
        />
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-xl ">
      <h3 className="text-gray-600 mb-2">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
