import React from "react";
import { Link, Navigate, Route, Routes, useParams } from "react-router-dom";
import { ArrowRight, Edit3, Eye, Plus, Trash2 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import AdminSidebar from "../../components/admin/AdminSidebar";
import DashboardStats from "../../components/admin/DashboardStats";
import RecentOrders from "../../components/admin/RecentOrders";
import OrderStatusUpdateForm from "../../components/admin/OrderStatusUpdateForm";
import ProductForm from "../../components/admin/ProductForm";
import { useOrders } from "../../contexts/OrderContext";
import { useProducts } from "../../contexts/ProductContext";
import { Order, OrderStatus } from "../../types";

type AdminReview = {
  id: string | number;
  userName: string;
  userEmail?: string;
  productName: string;
  productSlug?: string;
  rating: number;
  comment: string;
  createdAt: string;
};

type SupportTicket = {
  id: string | number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: string;
  priority: string;
  source: string;
  createdAt: string;
  updatedAt: string;
};

type StoreSettingsData = {
  store: Record<string, any>;
  payment: Record<string, any>;
  email: Record<string, any>;
  catalog: Record<string, any>;
  customers: Record<string, any>;
  orders: Record<string, any>;
  support: { total: number; byStatus: Record<string, number> };
  content: { termsUpdatedAt?: string | null; termsPreview?: string; heroSlides?: any[] };
};

const adminFetch = async <T,>(path: string, options: RequestInit = {}): Promise<T> => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  if (!apiUrl) {
    throw new Error("VITE_API_URL is not configured for the frontend.");
  }
  if (!token) {
    throw new Error("Admin login token is missing. Please log in again.");
  }

  let response: Response;
  try {
    response = await fetch(`${apiUrl}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });
  } catch {
    throw new Error(`Cannot reach backend at ${apiUrl}. Start or restart the Django server.`);
  }

  const rawText = await response.text();
  let data: any = null;
  try {
    data = rawText ? JSON.parse(rawText) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    const looksLikeHtml = /^\s*<!doctype html|^\s*<html/i.test(rawText);
    const fallback =
      looksLikeHtml && response.status === 404
        ? `Backend route not found: ${path}. Restart/update the Django server behind ${apiUrl}.`
        :
      response.status === 401 || response.status === 403
        ? "Admin access denied. Log out and log in with an admin account."
        : `Request failed with HTTP ${response.status}.`;
    throw new Error(data?.detail || data?.message || (looksLikeHtml ? fallback : rawText) || fallback);
  }
  return data;
};

const PageHeader: React.FC<{
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}> = ({ eyebrow, title, description, action }) => (
  <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div>
      {eyebrow && <p className="caption">{eyebrow}</p>}
      <h1 className="mt-1 text-2xl font-semibold tracking-tight text-text sm:text-3xl">{title}</h1>
      {description && <p className="mt-2 max-w-2xl text-sm text-muted">{description}</p>}
    </div>
    {action}
  </div>
);

const TableCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="card overflow-hidden">
    <div className="overflow-x-auto">{children}</div>
  </div>
);

const EmptyRow: React.FC<{ colSpan: number; message: string }> = ({ colSpan, message }) => (
  <tr>
    <td colSpan={colSpan} className="px-5 py-10 text-center text-sm text-muted">
      {message}
    </td>
  </tr>
);

const tableHeadClass = "px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest text-muted";
const tableCellClass = "whitespace-nowrap px-5 py-4 text-sm";

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "pending":
      return "border-yellow-200 bg-yellow-50 text-yellow-700";
    case "processing":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "shipped":
      return "border-purple-200 bg-purple-50 text-purple-700";
    case "out_for_delivery":
      return "border-orange-200 bg-orange-50 text-orange-700";
    case "delivered":
      return "border-green-200 bg-green-50 text-green-700";
    case "cancelled":
      return "border-red-200 bg-red-50 text-red-700";
    case "returned":
      return "border-line bg-surface-muted text-muted";
    case "open":
      return "border-yellow-200 bg-yellow-50 text-yellow-700";
    case "in_progress":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "resolved":
      return "border-green-200 bg-green-50 text-green-700";
    case "closed":
      return "border-line bg-surface-muted text-muted";
    default:
      return "border-line bg-surface-muted text-muted";
  }
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => (
  <span className={`badge border ${getStatusBadgeClass(status)}`}>
    {status.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
  </span>
);

const DashboardOverview: React.FC = () => {
  const { orders } = useOrders();
  const { products } = useProducts();

  React.useEffect(() => {
    document.title = "Admin Dashboard | CrystalReadymade";
  }, []);

  const recentActivity = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const topProducts = [...products]
    .sort((a, b) => b.ratings - a.ratings)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Overview"
        title="Dashboard"
        description="A quick read on orders, revenue, customers, and product movement."
      />

      <DashboardStats />
      <RecentOrders />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <section className="card p-5">
          <div className="mb-4">
            <p className="caption">Catalog</p>
            <h2 className="mt-1 text-lg font-semibold text-text">Popular Products</h2>
          </div>
          <ul className="space-y-3">
            {topProducts.map(product => (
              <li key={product.id} className="flex items-center gap-4 rounded-xl border border-line bg-surface px-3 py-3">
                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-surface-muted">
                  <img
                    src={product.images?.[0] || "/placeholder.png"}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-text">{product.name}</p>
                  <p className="truncate text-sm text-muted">{product.category}</p>
                </div>
                <div className="text-sm font-semibold text-text">Rs. {product.salePrice || product.price}</div>
              </li>
            ))}
            {topProducts.length === 0 && (
              <li className="rounded-xl border border-line bg-surface-muted px-4 py-6 text-center text-sm text-muted">
                No products found.
              </li>
            )}
          </ul>
        </section>

        <section className="card p-5">
          <div className="mb-4">
            <p className="caption">Activity</p>
            <h2 className="mt-1 text-lg font-semibold text-text">Recent Activity</h2>
          </div>
          <ul className="space-y-3">
            {recentActivity.map(order => (
              <li key={order.id} className="flex gap-3 rounded-xl border border-line bg-surface px-3 py-3">
                <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-brand" />
                <div>
                  <p className="text-sm text-text">
                    New order <span className="font-semibold">#{String(order.id).slice(-8)}</span> placed by {order.userId}
                  </p>
                  <p className="mt-1 text-xs text-muted">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
              </li>
            ))}
            {recentActivity.length === 0 && (
              <li className="rounded-xl border border-line bg-surface-muted px-4 py-6 text-center text-sm text-muted">
                No recent activity.
              </li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
};

const EditProductWrapper: React.FC<{ onSubmit: (product: any) => void }> = ({ onSubmit }) => {
  const { productId } = useParams();
  const { products } = useProducts();
  const productToEdit = products.find(p => String(p.id) === String(productId));

  if (!productToEdit) {
    return <div className="card p-8 text-center text-sm text-muted">Loading product data or product not found...</div>;
  }

  return (
    <div className="card p-5 sm:p-6">
      <PageHeader eyebrow="Catalog" title="Edit Product" description={productToEdit.name} />
      <ProductForm product={productToEdit} onSubmit={onSubmit} />
    </div>
  );
};

const ProductsManagement: React.FC = () => {
  const { products, deleteProduct } = useProducts();

  React.useEffect(() => {
    document.title = "Products Management | CrystalReadymade";
  }, []);

  const handleProductSubmit = (product: any) => {
    console.log("Product saved successfully:", product);
    window.location.href = "/admin/products";
  };

  return (
    <div>
      <PageHeader
        eyebrow="Catalog"
        title="Products"
        description="Manage product listings, prices, categories, and stock status."
        action={
          <Link to="/admin/products/new" className="btn btn-primary">
            <Plus size={18} className="mr-2" />
            Add Product
          </Link>
        }
      />

      <Routes>
        <Route
          path="/"
          element={
            <TableCard>
              <table className="min-w-full divide-y divide-line">
                <thead className="bg-surface-muted">
                  <tr>
                    {["Product", "Price", "Category", "Stock", "Actions"].map(heading => (
                      <th key={heading} scope="col" className={tableHeadClass}>
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-line bg-surface">
                  {products.map(product => (
                    <tr key={product.id} className="transition-colors hover:bg-surface-muted/60">
                      <td className={tableCellClass}>
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-surface-muted">
                            <img
                              src={product.images?.[0] || "/placeholder.png"}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="max-w-xs truncate font-semibold text-text">{product.name}</div>
                            <div className="text-muted">{product.brand}</div>
                          </div>
                        </div>
                      </td>
                      <td className={tableCellClass}>
                        <div className="font-semibold text-text">Rs. {product.salePrice || product.price}</div>
                        {product.salePrice && <div className="text-muted line-through">Rs. {product.price}</div>}
                      </td>
                      <td className={`${tableCellClass} text-muted`}>{product.category}</td>
                      <td className={tableCellClass}>
                        {product.quantity > 0 ? (
                          <span className="badge border border-green-200 bg-green-50 text-green-700">
                            In Stock ({product.quantity})
                          </span>
                        ) : (
                          <span className="badge border border-red-200 bg-red-50 text-red-700">Out of Stock</span>
                        )}
                      </td>
                      <td className={tableCellClass}>
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/admin/products/edit/${product.id}`}
                            className="btn btn-secondary px-3 py-2"
                            title="Edit product"
                          >
                            <Edit3 size={16} />
                          </Link>
                          <button
                            className="btn btn-secondary px-3 py-2 text-red-600 hover:text-red-700"
                            title="Delete product"
                            onClick={() => {
                              if (confirm("Are you sure you want to delete this product?")) {
                                deleteProduct(product.id);
                              }
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && <EmptyRow colSpan={5} message="No products found." />}
                </tbody>
              </table>
            </TableCard>
          }
        />
        <Route
          path="/new"
          element={
            <div className="card p-5 sm:p-6">
              <PageHeader eyebrow="Catalog" title="Add New Product" />
              <ProductForm onSubmit={handleProductSubmit} />
            </div>
          }
        />
        <Route path="/edit/:productId" element={<EditProductWrapper onSubmit={handleProductSubmit} />} />
      </Routes>
    </div>
  );
};

const STATUS_ORDER = ["pending", "processing", "shipped", "out_for_delivery", "delivered"];

const OrdersManagement: React.FC = () => {
  const { orders, updateOrderStatus, batchUpdateOrderStatus } = useOrders();
  const [selectedOrders, setSelectedOrders] = React.useState<Set<string>>(new Set());
  const [isUpdating, setIsUpdating] = React.useState(false);

  React.useEffect(() => {
    document.title = "Orders Management | CrystalReadymade";
  }, []);

  const toggleOrderSelection = (orderId: string) => {
    const newSelection = new Set(selectedOrders);
    if (newSelection.has(orderId)) {
      newSelection.delete(orderId);
    } else {
      newSelection.add(orderId);
    }
    setSelectedOrders(newSelection);
  };

  const selectAll = () => {
    setSelectedOrders(selectedOrders.size === orders.length ? new Set() : new Set(orders.map(o => o.id)));
  };

  const handleBatchUpdate = async (status: OrderStatus) => {
    setIsUpdating(true);
    await batchUpdateOrderStatus(Array.from(selectedOrders), status);
    setSelectedOrders(new Set());
    setIsUpdating(false);
  };

  const quickNextStatus = async (orderId: string, currentStatus: string) => {
    const currentIndex = STATUS_ORDER.indexOf(currentStatus);
    if (currentIndex >= 0 && currentIndex < STATUS_ORDER.length - 1) {
      setIsUpdating(true);
      await updateOrderStatus(orderId, STATUS_ORDER[currentIndex + 1] as OrderStatus);
      setIsUpdating(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Fulfillment"
        title="Orders"
        description="Review orders and move selected shipments through their next status."
        action={
          selectedOrders.size > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="chip">{selectedOrders.size} selected</span>
              <select
                className="select min-w-56"
                onChange={e => {
                  if (e.target.value) handleBatchUpdate(e.target.value as OrderStatus);
                  e.target.value = "";
                }}
                disabled={isUpdating}
              >
                <option value="">Batch update status...</option>
                <option value="processing">Mark as Processing</option>
                <option value="shipped">Mark as Shipped</option>
                <option value="out_for_delivery">Mark as Out for Delivery</option>
                <option value="delivered">Mark as Delivered</option>
                <option value="cancelled">Cancel Orders</option>
              </select>
            </div>
          )
        }
      />

      <Routes>
        <Route
          path="/"
          element={
            <TableCard>
              <table className="min-w-full divide-y divide-line">
                <thead className="bg-surface-muted">
                  <tr>
                    <th scope="col" className={`${tableHeadClass} w-10`}>
                      <input
                        type="checkbox"
                        checked={selectedOrders.size > 0 && selectedOrders.size === orders.length}
                        onChange={selectAll}
                        className="rounded border-line text-brand focus:ring-brand"
                      />
                    </th>
                    {["Order ID", "Customer", "Date", "Status", "Total", "Actions"].map(heading => (
                      <th key={heading} scope="col" className={tableHeadClass}>
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-line bg-surface">
                  {orders.map((order: Order) => (
                    <tr
                      key={order.id}
                      className={`transition-colors hover:bg-surface-muted/60 ${selectedOrders.has(order.id) ? "bg-pink-50" : ""}`}
                    >
                      <td className={tableCellClass}>
                        <input
                          type="checkbox"
                          checked={selectedOrders.has(order.id)}
                          onChange={() => toggleOrderSelection(order.id)}
                          className="rounded border-line text-brand focus:ring-brand"
                        />
                      </td>
                      <td className={`${tableCellClass} font-semibold text-text`}>#{String(order.id).slice(-8)}</td>
                      <td className={`${tableCellClass} text-muted`}>{order.userId}</td>
                      <td className={`${tableCellClass} text-muted`}>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className={tableCellClass}>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={order.status} />
                          {STATUS_ORDER.includes(order.status as string) && order.status !== "delivered" && (
                            <button
                              onClick={() => quickNextStatus(order.id, order.status)}
                              disabled={isUpdating}
                              className="btn btn-secondary px-3 py-2 text-xs"
                              title="Advance status"
                            >
                              Next
                              <ArrowRight size={14} className="ml-1" />
                            </button>
                          )}
                        </div>
                      </td>
                      <td className={`${tableCellClass} font-semibold text-text`}>Rs. {order.total.toFixed(2)}</td>
                      <td className={tableCellClass}>
                        <Link to={`/admin/orders/${order.id}`} className="btn btn-secondary px-3 py-2" title="View order">
                          <Eye size={16} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && <EmptyRow colSpan={7} message="No orders found." />}
                </tbody>
              </table>
            </TableCard>
          }
        />
        <Route path="/:orderId" element={<OrderDetails />} />
      </Routes>
    </div>
  );
};

const OrderDetails: React.FC = () => {
  const { orderId } = useParams();
  const { orders, updateOrderStatus } = useOrders();
  const order = orders.find(o => String(o.id) === String(orderId));

  if (!order) {
    return <div className="card p-8 text-center text-sm text-muted">Order not found.</div>;
  }

  return (
    <div className="card p-5 sm:p-6">
      <PageHeader
        eyebrow="Fulfillment"
        title={`Order #${String(order.id).slice(-8)}`}
        description={`Current status: ${order.status.replace(/_/g, " ")}`}
      />
      <OrderStatusUpdateForm orderId={order.id} currentStatus={order.status} onUpdate={updateOrderStatus} />
    </div>
  );
};

const ReturnOrdersManagement: React.FC = () => {
  const { orders } = useOrders();
  const [selectedOrders, setSelectedOrders] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    document.title = "Return Orders | CrystalReadymade";
  }, []);

  const returnOrders = orders.filter(o => (o.status as string) === "returned");

  const toggleOrderSelection = (orderId: string) => {
    const newSelection = new Set(selectedOrders);
    if (newSelection.has(orderId)) {
      newSelection.delete(orderId);
    } else {
      newSelection.add(orderId);
    }
    setSelectedOrders(newSelection);
  };

  const selectAll = () => {
    setSelectedOrders(selectedOrders.size === returnOrders.length ? new Set() : new Set(returnOrders.map(o => o.id)));
  };

  return (
    <div>
      <PageHeader eyebrow="Fulfillment" title="Return Orders" description="Track orders that have entered the return workflow." />
      <TableCard>
        <table className="min-w-full divide-y divide-line">
          <thead className="bg-surface-muted">
            <tr>
              <th scope="col" className={`${tableHeadClass} w-10`}>
                <input
                  type="checkbox"
                  checked={selectedOrders.size > 0 && selectedOrders.size === returnOrders.length}
                  onChange={selectAll}
                  className="rounded border-line text-brand focus:ring-brand"
                />
              </th>
              {["Order ID", "Customer", "Date", "Status", "Total", "Actions"].map(heading => (
                <th key={heading} scope="col" className={tableHeadClass}>
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line bg-surface">
            {returnOrders.map((order: Order) => (
              <tr key={order.id} className={`transition-colors hover:bg-surface-muted/60 ${selectedOrders.has(order.id) ? "bg-pink-50" : ""}`}>
                <td className={tableCellClass}>
                  <input
                    type="checkbox"
                    checked={selectedOrders.has(order.id)}
                    onChange={() => toggleOrderSelection(order.id)}
                    className="rounded border-line text-brand focus:ring-brand"
                  />
                </td>
                <td className={`${tableCellClass} font-semibold text-text`}>#{String(order.id).slice(-8)}</td>
                <td className={`${tableCellClass} text-muted`}>{order.userId}</td>
                <td className={`${tableCellClass} text-muted`}>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className={tableCellClass}>
                  <StatusBadge status="returned" />
                </td>
                <td className={`${tableCellClass} font-semibold text-text`}>Rs. {order.total.toFixed(2)}</td>
                <td className={tableCellClass}>
                  <Link to={`/admin/orders/${order.id}`} className="btn btn-secondary px-3 py-2" title="View order">
                    <Eye size={16} />
                  </Link>
                </td>
              </tr>
            ))}
            {returnOrders.length === 0 && <EmptyRow colSpan={7} message="No return orders found." />}
          </tbody>
        </table>
      </TableCard>
    </div>
  );
};

const CustomersManagement: React.FC = () => {
  const [users, setUsers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    document.title = "Customers Management | CrystalReadymade";

    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
        const response = await fetch(`${apiUrl}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          setUsers(await response.json());
        }
      } catch (error) {
        console.error("Error fetching users", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <PageHeader eyebrow="People" title="Customers" description="View registered customers and administrative accounts." />
      <TableCard>
        {loading ? (
          <div className="px-5 py-10 text-center text-sm text-muted">Loading customers...</div>
        ) : (
          <table className="min-w-full divide-y divide-line">
            <thead className="bg-surface-muted">
              <tr>
                {["Name", "Email", "Phone", "Role"].map(heading => (
                  <th key={heading} scope="col" className={tableHeadClass}>
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line bg-surface">
              {users.map(user => (
                <tr key={user.id} className="transition-colors hover:bg-surface-muted/60">
                  <td className={`${tableCellClass} font-semibold text-text`}>{user.name}</td>
                  <td className={`${tableCellClass} text-muted`}>{user.email || "N/A"}</td>
                  <td className={`${tableCellClass} text-muted`}>{user.phone || "N/A"}</td>
                  <td className={tableCellClass}>
                    <span className={`badge border ${user.role === "admin" ? "border-purple-200 bg-purple-50 text-purple-700" : "border-green-200 bg-green-50 text-green-700"}`}>
                      {user.role}
                    </span>
                  </td>
                </tr>
              ))}
              {users.length === 0 && <EmptyRow colSpan={4} message="No customers found." />}
            </tbody>
          </table>
        )}
      </TableCard>
    </div>
  );
};

const SupportTicketsManagement: React.FC = () => {
  const [tickets, setTickets] = React.useState<SupportTicket[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    document.title = "Support Tickets | CrystalReadymade";

    const fetchTickets = async () => {
      try {
        setTickets(await adminFetch<SupportTicket[]>("/api/admin/support-tickets"));
      } catch (err: any) {
        setError(err.message || "Failed to load support tickets");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const updateTicketStatus = async (ticketId: string | number, nextStatus: string) => {
    const updated = await adminFetch<SupportTicket>(`/api/admin/support-tickets/${ticketId}`, {
      method: "PATCH",
      body: JSON.stringify({ status: nextStatus }),
    });
    setTickets(prev => prev.map(ticket => String(ticket.id) === String(ticketId) ? updated : ticket));
  };

  return (
    <div>
      <PageHeader
        eyebrow="Customer Support"
        title="Support Tickets"
        description="Track customer issues, order questions, and service requests from one place."
      />
      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-4">
        {["open", "in_progress", "resolved", "closed"].map(status => (
          <div key={status} className="card p-4">
            <p className="caption">{status.replace(/_/g, " ")}</p>
            <p className="mt-2 text-2xl font-semibold text-text">
              {tickets.filter(ticket => ticket.status === status).length}
            </p>
          </div>
        ))}
      </div>
      <TableCard>
        {loading ? (
          <div className="px-5 py-10 text-center text-sm text-muted">Loading support tickets...</div>
        ) : error ? (
          <div className="px-5 py-10 text-center text-sm text-red-600">{error}</div>
        ) : (
          <table className="min-w-full divide-y divide-line">
            <thead className="bg-surface-muted">
              <tr>
                {["Subject", "Customer", "Priority", "Status", "Source", "Created", "Update"].map(heading => (
                  <th key={heading} scope="col" className={tableHeadClass}>
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line bg-surface">
              {tickets.map(ticket => (
                <tr key={ticket.id} className="align-top transition-colors hover:bg-surface-muted/60">
                  <td className="px-5 py-4 text-sm">
                    <p className="font-semibold text-text">{ticket.subject}</p>
                    <p className="mt-1 max-w-md text-muted">{ticket.message}</p>
                  </td>
                  <td className="px-5 py-4 text-sm">
                    <p className="font-semibold text-text">{ticket.name}</p>
                    <p className="text-muted">{ticket.email}</p>
                    {ticket.phone && <p className="text-muted">{ticket.phone}</p>}
                  </td>
                  <td className={tableCellClass}>
                    <span className="badge border border-line bg-surface-muted text-muted">
                      {ticket.priority}
                    </span>
                  </td>
                  <td className={tableCellClass}>
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td className={`${tableCellClass} text-muted`}>{ticket.source}</td>
                  <td className={`${tableCellClass} text-muted`}>
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </td>
                  <td className={tableCellClass}>
                    <select
                      className="select min-w-40"
                      value={ticket.status}
                      onChange={e => updateTicketStatus(ticket.id, e.target.value)}
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                </tr>
              ))}
              {tickets.length === 0 && <EmptyRow colSpan={7} message="No support tickets found." />}
            </tbody>
          </table>
        )}
      </TableCard>
    </div>
  );
};

const ReviewsManagement: React.FC = () => {
  const [reviews, setReviews] = React.useState<AdminReview[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    document.title = "Reviews | CrystalReadymade";

    const fetchReviews = async () => {
      try {
        setReviews(await adminFetch<AdminReview[]>("/api/admin/reviews"));
      } catch (err: any) {
        setError(err.message || "Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length
    : 0;

  return (
    <div>
      <PageHeader
        eyebrow="Customer Support"
        title="Reviews"
        description="Browse recent product feedback and customer ratings."
      />
      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="card p-4">
          <p className="caption">Total Reviews</p>
          <p className="mt-2 text-2xl font-semibold text-text">{reviews.length}</p>
        </div>
        <div className="card p-4">
          <p className="caption">Average Rating</p>
          <p className="mt-2 text-2xl font-semibold text-text">{averageRating.toFixed(1)} / 5</p>
        </div>
        <div className="card p-4">
          <p className="caption">Five Star Reviews</p>
          <p className="mt-2 text-2xl font-semibold text-text">
            {reviews.filter(review => Number(review.rating) >= 5).length}
          </p>
        </div>
      </div>
      <TableCard>
        {loading ? (
          <div className="px-5 py-10 text-center text-sm text-muted">Loading reviews...</div>
        ) : error ? (
          <div className="px-5 py-10 text-center text-sm text-red-600">{error}</div>
        ) : (
          <table className="min-w-full divide-y divide-line">
            <thead className="bg-surface-muted">
              <tr>
                {["Product", "Customer", "Rating", "Comment", "Date"].map(heading => (
                  <th key={heading} scope="col" className={tableHeadClass}>
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line bg-surface">
              {reviews.map(review => (
                <tr key={review.id} className="align-top transition-colors hover:bg-surface-muted/60">
                  <td className={`${tableCellClass} font-semibold text-text`}>
                    {review.productSlug ? (
                      <Link to={`/product/${review.productSlug}`} className="hover:text-brand">
                        {review.productName}
                      </Link>
                    ) : review.productName}
                  </td>
                  <td className="px-5 py-4 text-sm">
                    <p className="font-medium text-text">{review.userName}</p>
                    {review.userEmail && <p className="text-muted">{review.userEmail}</p>}
                  </td>
                  <td className={tableCellClass}>
                    <span className="badge border border-yellow-200 bg-yellow-50 text-yellow-700">
                      {Number(review.rating).toFixed(1)} / 5
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-muted">
                    <span className="line-clamp-3 max-w-lg">{review.comment || "No comment"}</span>
                  </td>
                  <td className={`${tableCellClass} text-muted`}>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {reviews.length === 0 && <EmptyRow colSpan={5} message="No reviews found." />}
            </tbody>
          </table>
        )}
      </TableCard>
    </div>
  );
};

const StoreSettings: React.FC = () => {
  const [settingsData, setSettingsData] = React.useState<StoreSettingsData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    document.title = "Store Settings | CrystalReadymade";

    const fetchSettings = async () => {
      try {
        setSettingsData(await adminFetch<StoreSettingsData>("/api/admin/store-settings"));
      } catch (err: any) {
        setError(err.message || "Failed to load store settings");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const MetricCard: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="rounded-xl border border-line bg-surface px-4 py-3">
      <p className="caption">{label}</p>
      <p className="mt-2 text-xl font-semibold text-text">{value}</p>
    </div>
  );

  if (loading) {
    return <div className="card p-8 text-center text-sm text-muted">Loading store settings...</div>;
  }

  if (error || !settingsData) {
    return <div className="card p-8 text-center text-sm text-red-600">{error || "Store settings unavailable."}</div>;
  }

  return (
    <div>
      <PageHeader
        eyebrow="Settings"
        title="Store Settings"
        description="Review storefront configuration and operational preferences."
      />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <section className="card p-5">
          <p className="caption">Storefront</p>
          <h2 className="mt-1 text-lg font-semibold text-text">Brand Details</h2>
          <div className="mt-5 space-y-4">
            <div>
              <label className="label" htmlFor="store-name">Store Name</label>
              <input id="store-name" className="input mt-2" value={settingsData.store.name || ""} readOnly />
            </div>
            <div>
              <label className="label" htmlFor="support-email">Support Email</label>
              <input id="support-email" className="input mt-2" value={settingsData.store.supportEmail || ""} readOnly />
            </div>
            <div>
              <label className="label" htmlFor="store-phone">Phone</label>
              <input id="store-phone" className="input mt-2" value={settingsData.store.phone || ""} readOnly />
            </div>
            <div>
              <label className="label" htmlFor="store-location">Location</label>
              <input id="store-location" className="input mt-2" value={settingsData.store.location || ""} readOnly />
            </div>
          </div>
        </section>

        <section className="card p-5">
          <p className="caption">Operations</p>
          <h2 className="mt-1 text-lg font-semibold text-text">Order Defaults</h2>
          <div className="mt-5 space-y-4">
            <div>
              <label className="label" htmlFor="currency">Currency</label>
              <input id="currency" className="input mt-2" value={settingsData.store.currency || "INR"} readOnly />
            </div>
            <div>
              <label className="label" htmlFor="payment-provider">Payment Provider</label>
              <input id="payment-provider" className="input mt-2" value={settingsData.payment.provider || "Razorpay"} readOnly />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <MetricCard label="Payment Configured" value={settingsData.payment.configured ? "Yes" : "No"} />
              <MetricCard label="Email Configured" value={settingsData.email.configured ? "Yes" : "No"} />
            </div>
          </div>
        </section>

        <section className="card p-5">
          <p className="caption">Catalog</p>
          <h2 className="mt-1 text-lg font-semibold text-text">Catalog Sources</h2>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <MetricCard label="Products" value={settingsData.catalog.products} />
            <MetricCard label="Categories" value={settingsData.catalog.categories} />
            <MetricCard label="Brands" value={settingsData.catalog.brands} />
            <MetricCard label="Hero Slides" value={settingsData.catalog.heroSlides} />
          </div>
        </section>

        <section className="card p-5">
          <p className="caption">Operations</p>
          <h2 className="mt-1 text-lg font-semibold text-text">Live Counts</h2>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <MetricCard label="Customers" value={settingsData.customers.total} />
            <MetricCard label="Admins" value={settingsData.customers.admins} />
            <MetricCard label="Orders" value={settingsData.orders.total} />
            <MetricCard label="Support Tickets" value={settingsData.support.total} />
          </div>
        </section>

        <section className="card p-5 xl:col-span-2">
          <p className="caption">Content</p>
          <h2 className="mt-1 text-lg font-semibold text-text">Published Content Sources</h2>
          <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-line bg-surface px-4 py-4">
              <p className="text-sm font-semibold text-text">Terms</p>
              <p className="mt-1 text-xs text-muted">
                Updated: {settingsData.content.termsUpdatedAt ? new Date(settingsData.content.termsUpdatedAt).toLocaleString() : "Not published"}
              </p>
              <p className="mt-3 text-sm text-muted">{settingsData.content.termsPreview || "No terms content found."}</p>
            </div>
            <div className="rounded-xl border border-line bg-surface px-4 py-4">
              <p className="text-sm font-semibold text-text">Hero Slides</p>
              <div className="mt-3 space-y-3">
                {(settingsData.content.heroSlides || []).map(slide => (
                  <div key={slide.id} className="rounded-lg bg-surface-muted px-3 py-2">
                    <p className="text-sm font-medium text-text">{slide.title}</p>
                    <p className="text-xs text-muted">{slide.subtitle}</p>
                  </div>
                ))}
                {(settingsData.content.heroSlides || []).length === 0 && (
                  <p className="text-sm text-muted">No hero slides found.</p>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const Analytics: React.FC = () => {
  const { orders } = useOrders();

  React.useEffect(() => {
    document.title = "Analytics | CrystalReadymade";
  }, []);

  const totalRevenue = orders.filter(o => o.status !== "cancelled").reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === "pending").length;
  const completedOrders = orders.filter(o => o.status === "delivered").length;

  return (
    <div>
      <PageHeader eyebrow="Insights" title="Analytics" description="Snapshot metrics for revenue and fulfillment health." />
      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="card p-5">
          <p className="text-sm font-medium text-muted">Total Revenue</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-green-600">Rs. {totalRevenue.toFixed(2)}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm font-medium text-muted">Completed Orders</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-blue-600">{completedOrders}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm font-medium text-muted">Pending Orders</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-yellow-600">{pendingOrders}</p>
        </div>
      </div>
      <div className="card p-6">
        <p className="text-sm text-muted">Advanced analytics and charts will be implemented in a future update.</p>
      </div>
    </div>
  );
};

const AdminDashboardPage: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="container mx-auto px-4 py-8 sm:py-10">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[14rem_minmax(0,1fr)] xl:grid-cols-[17rem_minmax(0,1fr)]">
          <AdminSidebar />
          <main className="min-w-0">
            <Routes>
              <Route path="/" element={<DashboardOverview />} />
              <Route path="/products/*" element={<ProductsManagement />} />
              <Route path="/orders/*" element={<OrdersManagement />} />
              <Route path="/returns/*" element={<ReturnOrdersManagement />} />
              <Route path="/customers" element={<CustomersManagement />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/support-tickets" element={<SupportTicketsManagement />} />
              <Route path="/reviews" element={<ReviewsManagement />} />
              <Route path="/settings" element={<StoreSettings />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
