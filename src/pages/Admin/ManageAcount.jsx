import React, { useState } from "react";
import acounts from "../../fakeData/acounts.js";
import Pagination from "@/components/ui/Pagination";

// Account Filters Component
function AccountFilters({
  searchTerm,
  setSearchTerm,
  typeFilter,
  setTypeFilter,
}) {
  return (
    <div className="mb-6 flex flex-col sm:flex-row gap-4">
      <input
        type="text"
        placeholder="Search accounts..."
        className="px-4 py-2 border rounded-lg"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select
        value={typeFilter}
        onChange={(e) => setTypeFilter(e.target.value)}
        className="px-4 py-2 border rounded-lg"
      >
        <option value="all">All Types</option>
        <option value="customer">Customer</option>
        <option value="seller">Seller</option>
      </select>
    </div>
  );
}

// Status Badge Component
function StatusBadge({ status }) {
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        status === "active"
          ? "bg-green-100 text-green-800"
          : "bg-red-100 text-red-800"
      }`}
    >
      {status}
    </span>
  );
}

// Account Actions Component
function AccountActions({ onDelete, onStatusToggle, status }) {
  return (
    <div className="flex space-x-3">
      <button
        onClick={onStatusToggle}
        className="text-blue-600 hover:text-blue-800"
      >
        Toggle Status
      </button>
      <button onClick={onDelete} className="text-red-600 hover:text-red-800">
        Delete
      </button>
    </div>
  );
}

// Account Table Component
function AccountTable({ accounts, handleDeleteAccount, handleStatusToggle }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {accounts.map((account) => (
            <tr key={account.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {account.name}
                    </div>
                    <div className="text-sm text-gray-500">{account.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {account.type}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={account.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <AccountActions
                  onDelete={() => handleDeleteAccount(account.id)}
                  onStatusToggle={() => handleStatusToggle(account.id)}
                  status={account.status}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Main Component
export default function ManageAccount() {
  const [accounts, setAccounts] = useState(acounts);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const handleDeleteAccount = (id) => {
    setAccounts(accounts.filter((account) => account.id !== id));
  };

  const handleStatusToggle = (id) => {
    setAccounts(
      accounts.map((account) =>
        account.id === id
          ? {
              ...account,
              status: account.status === "active" ? "inactive" : "active",
            }
          : account
      )
    );
  };

  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch =
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || account.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAccounts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold mb-6">Manage Accounts</h1>

        <AccountFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
        />

        <AccountTable
          accounts={currentItems}
          handleDeleteAccount={handleDeleteAccount}
          handleStatusToggle={handleStatusToggle}
        />

        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredAccounts.length / itemsPerPage)}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
