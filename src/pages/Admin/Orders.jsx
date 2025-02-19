import React, { useState } from "react";
import orders1 from "@/fakeData/orders";
import Pagination from "@/components/ui/Pagination";

export default function Orders() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = orders1.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(orders1.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-medium mb-8">Orders</h1>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentItems.map((order, index) => (
          <OrderCard key={index} order={order} />
        ))}
      </div>

      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

function OrderCard({ order }) {
  return (
    <div className="bg-white rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div>
          <p className="text-gray-900">{order.customer}</p>
          <p className="text-sm text-gray-500">
            order {order.id} / {order.type}
          </p>
        </div>
      </div>

      {/* Date & Time */}
      <div className="flex justify-between text-sm text-gray-500 mb-6">
        <span>{order.date}</span>
        <span>{order.time}</span>
      </div>

      {/* Order Items Table */}
      <div className="space-y-3">
        {/* Table Header */}
        <div className="grid grid-cols-3 text-sm text-gray-500">
          <span>items</span>
          <span className="text-center">qty</span>
          <span className="text-right">price</span>
        </div>

        {/* Table Body */}
        {order.items.map((item, index) => (
          <div key={index} className="grid grid-cols-3 text-sm">
            <span className="text-gray-900">{item.name}</span>
            <span className="text-center text-gray-500">{item.qty}</span>
            <span className="text-right text-gray-900">{item.price}$</span>
          </div>
        ))}

        {/* Total */}
        <div className="grid grid-cols-2 text-sm pt-3 border-t mt-3">
          <span className="font-medium">total</span>
          <span className="text-right font-medium">${order.total}</span>
        </div>
      </div>
    </div>
  );
}
