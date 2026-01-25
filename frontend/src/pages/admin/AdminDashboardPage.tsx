import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import AdminSidebar from "../../components/admin/AdminSidebar";
import DashboardStats from "../../components/admin/DashboardStats";
import RecentOrders from "../../components/admin/RecentOrders";
import OrderStatusUpdateForm from "../../components/admin/OrderStatusUpdateForm";
import ProductForm from "../../components/admin/ProductForm";
import { useOrders } from "../../contexts/OrderContext";
import { useProducts } from "../../contexts/ProductContext";
import { Order, Product } from "../../types";


// Dashboard Overview
const DashboardOverview: React.FC = () => {

  React.useEffect(() => {
    document.title = "Admin Dashboard | CrystalReadymade";
  }, []);



  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Stats */}
      <DashboardStats />

      {/* Recent Orders */}
      <RecentOrders />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Popular Products</h2>
          {/* Product stats would go here */}
          <p className="text-gray-500">
            Detailed analytics available in the Analytics section.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          {/* Activity log would go here */}
          <ul className="space-y-3">
            <li className="flex">
              <span className="text-pink-600 mr-2">•</span>
              <div>
                <p className="text-gray-700">New order #1003 received</p>
                <p className="text-xs text-gray-500">5 minutes ago</p>
              </div>
            </li>
            <li className="flex">
              <span className="text-green-600 mr-2">•</span>
              <div>
                <p className="text-gray-700">Order #1002 updated to Shipped</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </li>
            <li className="flex">
              <span className="text-purple-600 mr-2">•</span>
              <div>
                <p className="text-gray-700">
                  New product added: Crystal Table Lamp
                </p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Products Management
const ProductsManagement: React.FC = () => {
  
  const { products, deleteProduct } = useProducts();

  React.useEffect(() => {
    document.title = "Products Management | CrystalReadymade";
  }, []);

  // Mock function to handle product update/create
  const handleProductSubmit = (product: any) => {
    console.log("Submitting product:", product);
    // In a real app, this would make an API call to save the product
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <a
          href="/admin/products/new"
          className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors"
        >
          Add New Product
        </a>
      </div>

      <Routes>
        <Route
          path="/"
          element={
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Product
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Price
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Category
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Stock
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 rounded-md overflow-hidden">
                              {/* Add a check for product.images to prevent the error */}
                              <img
                                src={
                                  product.images && product.images.length > 0
                                    ? product.images[0]
                                    : "/path/to/default-image.jpg"
                                } // Fallback to a default image if no images exist
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {product.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {product.brand}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            ${product.salePrice || product.price}
                          </div>
                          {product.salePrice && (
                            <div className="text-sm text-gray-500 line-through">
                              ${product.price}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {product.category}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {product.stock ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              In Stock ({product.quantity})
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-pink-100 text-red-800">
                              Out of Stock
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <a
                            href={`/admin/products/edit/${product.id}`}
                            className="text-pink-600 hover:text-pink-900 mr-3"
                          >
                            Edit
                          </a>
                          <button
                            className="text-red-600 hover:text-red-900"
                            onClick={() => {
                              if (
                                confirm(
                                  "Are you sure you want to delete this product?"
                                )
                              ) {
                                deleteProduct(product.id);
                              }
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          }
        />
        <Route
          path="/new"
          element={
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Add New Product</h2>
              <ProductForm onSubmit={handleProductSubmit} />
            </div>
          }
        />
        <Route
          path="/edit/:productId"
          element={
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Edit Product</h2>
              <ProductForm
                product={products[0]} // This would be the actual product fetched by ID
                onSubmit={handleProductSubmit}
              />
            </div>
          }
        />
      </Routes>
    </div>
  );
};

// Orders Management
const OrdersManagement: React.FC = () => {
  const { orders, updateOrderStatus } = useOrders();

  React.useEffect(() => {
    document.title = "Orders Management | CrystalReadymade";
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
      </div>

      <Routes>
        <Route
          path="/"
          element={
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Order ID
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Customer
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Total
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order: Order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{order.id.slice(-8)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.userId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              order.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.status === "processing"
                                ? "bg-pink-100 text-pink-800"
                                : order.status === "shipped"
                                ? "bg-purple-100 text-purple-800"
                                : order.status === "delivered"
                                ? "bg-green-100 text-green-800"
                                : order.status === "cancelled"
                                ? "bg-pink-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${order.total.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <a
                            href={`/admin/orders/${order.id}`}
                            className="text-pink-600 hover:text-pink-900"
                          >
                            View
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          }
        />
        <Route
          path="/:orderId"
          element={
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Order Details</h2>
              {/* This would show full order details and allow status updates */}
              <OrderStatusUpdateForm
                orderId={orders[0].id}
                currentStatus={orders[0].status}
                onUpdate={updateOrderStatus}
              />
            </div>
          }
        />
      </Routes>
    </div>
  );
};

// Customers Management
const CustomersManagement: React.FC = () => {
  React.useEffect(() => {
    document.title = "Customers Management | CrystalReadymade";
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Customers</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500">
          Customer management functionality will be implemented in a future
          update.
        </p>
      </div>
    </div>
  );
};

// Analytics
const Analytics: React.FC = () => {
  React.useEffect(() => {
    document.title = "Analytics | CrystalReadymade";
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Analytics</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500">
          Analytics functionality will be implemented in a future update.
        </p>
      </div>
    </div>
  );
};

// Main Admin Dashboard Page
const AdminDashboardPage: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <AdminSidebar />
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <Routes>
              <Route path="/" element={<DashboardOverview />} />
              <Route path="/products/*" element={<ProductsManagement />} />
              <Route path="/orders/*" element={<OrdersManagement />} />
              <Route path="/customers" element={<CustomersManagement />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
