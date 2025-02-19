import React, { useState } from "react";
import categoriesa from "../../fakeData/categories.js";
import Pagination from "@/components/ui/Pagination";

// Category Header Component
function CategoryHeader({ onAddNew }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-semibold">Categories</h1>
      <button
        onClick={onAddNew}
        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
      >
        Add New Category
      </button>
    </div>
  );
}

// Category Actions Component
function CategoryActions({ onEdit, onDelete }) {
  return (
    <div className="flex space-x-3">
      <button onClick={onEdit} className="text-blue-600 hover:text-blue-800">
        Edit
      </button>
      <button onClick={onDelete} className="text-red-600 hover:text-red-800">
        Delete
      </button>
    </div>
  );
}

// Category Table Component
function CategoryTable({
  categories,
  onEdit,
  onDelete,
  currentPage,
  itemsPerPage,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {["Name", "Description", "Status", "Products", "Actions"].map(
              (header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {categories.map((category) => (
            <tr key={category.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={category.icon}
                      alt=""
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {category.name}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">
                  {category.description}
                </div>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    category.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {category.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">
                  {category.productsCount}
                </div>
              </td>
              <td className="px-6 py-4">
                <CategoryActions
                  onEdit={() => onEdit(category)}
                  onDelete={() => onDelete(category.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Edit Modal Component
function EditModal({ isOpen, category, onClose, onSubmit }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">
          {category.id ? "Edit Category" : "Add New Category"}
        </h2>
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Form fields */}
        </form>
      </div>
    </div>
  );
}

// Main Categories Component
export default function Categories() {
  const [categories, setCategories] = useState(categoriesa);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddCategory = (e) => {
    e.preventDefault();
    const id = categories.length + 1;
    setCategories([
      ...categories,
      { ...editingCategory, id, status: "active", productsCount: 0 },
    ]);
    setEditingCategory(null);
    setIsEditModalOpen(false);
  };

  const handleStatusToggle = (id) => {
    setCategories(
      categories.map((category) =>
        category.id === id
          ? {
              ...category,
              status: category.status === "active" ? "inactive" : "active",
            }
          : category
      )
    );
  };

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter((category) => category.id !== id));
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setIsEditModalOpen(true);
  };

  const handleUpdateCategory = (e) => {
    e.preventDefault();
    setCategories(
      categories.map((cat) =>
        cat.id === editingCategory.id ? editingCategory : cat
      )
    );
    setIsEditModalOpen(false);
    setEditingCategory(null);
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCategories.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CategoryHeader
          onAddNew={() => {
            setEditingCategory({});
            setIsEditModalOpen(true);
          }}
        />

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
          />
        </div>

        <CategoryTable
          categories={currentItems}
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
        />

        <EditModal
          isOpen={isEditModalOpen}
          category={editingCategory}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory}
        />

        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
