import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout/DashboardLayout";
import { Eye, Check, X, MapPin, Phone, User, CreditCard, Package, Search, ChevronDown, Calendar, Download, } from "lucide-react";
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, addDoc, serverTimestamp, } from "firebase/firestore";
import toast from "react-hot-toast";
import BeatLoader from "react-spinners/BeatLoader";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [showOrderDetails, setShowOrderDetails] = useState(false);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        setLoading(true);
        const q = query(collection(db, "Orders"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const data = snapshot.docs.map((docSnap) => {
                    const d = docSnap.data();
                    let createdAtDate = null;
                    try {
                        if (d?.createdAt?.toDate) {
                            createdAtDate = d.createdAt.toDate();
                        } else if (d?.createdAt?.seconds) {
                            createdAtDate = new Date(d.createdAt.seconds * 1000);
                        } else if (typeof d?.createdAt === "string" || typeof d?.createdAt === "number") {
                            createdAtDate = new Date(d.createdAt);
                        } else {
                            createdAtDate = null;
                        }
                    } catch {
                        createdAtDate = null;
                    }
                    return { id: docSnap.id, ...d, createdAt: createdAtDate, };
                });

                setOrders(data);
                setLoading(false);
            },
            (err) => {
                console.error("Orders listener error:", err);
                toast.error("Failed to load orders.");
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        let filtered = orders;
        if (searchTerm) {
            const q = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (order) =>
                    (order?.address?.fullName || "")
                        .toLowerCase()
                        .includes(q) ||
                    (order?.customerName || "").toLowerCase().includes(q) ||
                    (order?.id || "").toLowerCase().includes(q) ||
                    (order?.address?.phone || "").includes(q)
            );
        }
        if (statusFilter !== "all") {
            filtered = filtered.filter((order) => order?.status === statusFilter);
        }

        setFilteredOrders(filtered);
    }, [orders, searchTerm, statusFilter]);


    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const ref = doc(db, "Orders", orderId);
            await updateDoc(ref, { status: newStatus });

            const order = orders.find((o) => o.id === orderId);
            if (!order) throw new Error("Order not found");
            await addDoc(collection(db, "Notifications"), {
                userId: order.userId,
                orderId,
                status: newStatus,
                message:
                    newStatus === "approved"
                        ? `Your order  has been approved ✅`
                        : `Your order  has been rejected ❌`,
                createdAt: serverTimestamp(),
                read: false,
            });
            toast.success(`Order set to ${newStatus} and notification sent.`);
            // await updateDoc(ref, { status: newStatus });
            // toast.success(`Order ${orderId} set to ${newStatus}.`);
        } catch (err) {
            console.error("Failed to update order status:", err);
            toast.error("Failed to update order status. Please try again.");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800 border-yellow-300";
            case "approved":
                return "bg-green-100 text-green-800 border-green-300";
            case "rejected":
                return "bg-red-100 text-red-800 border-red-300";
            default:
                return "bg-gray-100 text-gray-800 border-gray-300";
        }
    };

    const formatDate = (date) => {
        if (!date) return "—";
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };
    //   ============== Excel sheet saver ================
    const exportToExcel = () => {
        const exportData = filteredOrders.map((order, index) => ({
            "#": index + 1,
            Name: order?.address?.fullName || order.customerName || "N/A",
            Phone: order?.address?.phone || "N/A",
            Status: order?.status || "N/A",
            Total: order?.total || 0,
            Date: formatDate(order?.createdAt),
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });

        const fileData = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
        });

        saveAs(fileData, "Orders.xlsx");
    };




    const OrderDetailsModal = ({ order, onClose }) => {
        if (!order) return null;

        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-[#071d49]">
                        <h2 className="text-xl font-bold text-white">Order Details - {order.id}</h2>
                        <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="p-6 space-y-6 bg-white">
                        {/* Customer & Address */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-[#071d49] flex items-center gap-2">
                                    <User size={20} />
                                    Customer Information
                                </h3>
                                <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
                                    <div>
                                        <span className="text-gray-600 text-sm">Full Name:</span>
                                        <p className="text-[#071d49] font-medium">{order?.address?.fullName}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600 text-sm">Phone:</span>
                                        <p className="text-[#071d49] font-medium flex items-center gap-2">
                                            <Phone size={16} />
                                            {order?.address?.phone}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600 text-sm">User ID:</span>
                                        <p className="text-[#071d49] font-medium">{order.userId}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-[#071d49] flex items-center gap-2">
                                    <MapPin size={20} />
                                    Delivery Address
                                </h3>
                                <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
                                    <div>
                                        <span className="text-gray-600 text-sm">Address:</span>
                                        <p className="text-[#071d49] font-medium">{order?.address?.address}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600 text-sm">Area:</span>
                                        <p className="text-[#071d49] font-medium">{order?.address?.area}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600 text-sm">City:</span>
                                        <p className="text-[#071d49] font-medium">{order?.address?.city}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600 text-sm">Floor:</span>
                                        <p className="text-[#071d49] font-medium">{order?.address?.floor}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-[#071d49] flex items-center gap-2">
                                <Package size={20} />
                                Order Items ({order.cartItems?.length || 0})
                            </h3>
                            <div className="space-y-3">
                                {(order.cartItems || []).map((item, index) => (
                                    <div key={index} className="bg-gray-50 rounded-lg p-4 flex items-center gap-4 border border-gray-200">
                                        <img
                                            src={item.image || "/placeholder.svg"}
                                            alt={item.title}
                                            className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                                        />
                                        <div className="flex-1">
                                            <h4 className="text-[#071d49] font-medium">{item.title}</h4>
                                            <p className="text-gray-600 text-sm">{item.description}</p>
                                            <div className="flex items-center gap-4 mt-2">
                                                <span className="text-[#ffd100] font-bold bg-[#ffd100]/10 px-2 py-1 rounded">
                                                    ${item.price}
                                                </span>
                                                <span className="text-gray-600 text-sm">Qty: {item.quantity}</span>
                                                <span className="text-[#071d49] font-medium">${item.price * item.quantity}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment & Timeline */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-[#071d49] flex items-center gap-2">
                                    <CreditCard size={20} />
                                    Payment Details
                                </h3>
                                <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
                                    <div>
                                        <span className="text-gray-600 text-sm">Payment Method:</span>
                                        <p className="text-[#071d49] font-medium">{order.paymentMethod}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600 text-sm">Transaction ID:</span>
                                        <p className="text-[#071d49] font-medium">{order.transactionId || "N/A"}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600 text-sm">Total Amount:</span>
                                        <p className="text-[#ffd100] font-bold text-xl bg-[#ffd100]/10 px-3 py-2 rounded inline-block">
                                            ${order.total}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-[#071d49] flex items-center gap-2">
                                    <Calendar size={20} />
                                    Order Timeline
                                </h3>
                                <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
                                    <div>
                                        <span className="text-gray-600 text-sm">Order Date:</span>
                                        <p className="text-[#071d49] font-medium">{formatDate(order.createdAt)}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600 text-sm">Current Status:</span>
                                        <span
                                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)} ml-2`}
                                        >
                                            {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : "—"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions (approve / reject) */}
                        {order.status === "pending" && (
                            <div className="flex gap-4 pt-4 border-t border-gray-200">
                                <button
                                    onClick={() => {
                                        handleStatusChange(order.id, "approved");
                                        onClose();
                                    }}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
                                >
                                    <Check size={20} />
                                    Approve Order
                                </button>

                                <button
                                    onClick={() => {
                                        handleStatusChange(order.id, "rejected");
                                        onClose();
                                    }}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
                                >
                                    <X size={20} />
                                    Reject Order
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[#071d49]">Orders Management</h1>
                        <p className="text-gray-600 mt-1">Manage and track all customer orders</p>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-4">
                        <div className="bg-white rounded-lg p-4 border-2 border-[#071d49] shadow-lg">
                            <div className="text-[#ffd100] text-sm font-bold">Total Orders</div>
                            <div className="text-[#071d49] text-2xl font-bold text-center">{orders.length}</div>
                        </div>
                        <div className="bg-white rounded-lg p-4 border-2 border-[#071d49] shadow-lg">
                            <div className="text-[#ffd100] text-sm font-bold">Pending</div>
                            <div className="text-[#071d49] text-2xl font-bold text-center">
                                {orders.filter((o) => o.status === "pending").length}
                            </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 border-2 border-[#071d49] shadow-lg">
                            <div className="text-[#ffd100] text-sm font-bold">Approved</div>
                            <div className="text-[#071d49] text-2xl font-bold text-center">
                                {orders.filter((o) => o.status === "approved").length}
                            </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 border-2 border-[#071d49] shadow-lg">
                            <div className="text-[#ffd100] text-sm font-bold">Rejected</div>
                            <div className="text-[#071d49] text-2xl font-bold text-center">
                                {orders.filter((o) => o.status === "rejected").length}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg p-6 border-2 border-[#071d49] shadow-lg">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by name, phone, or order ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-[#071d49] placeholder-gray-500 focus:border-[#ffd100] focus:outline-none focus:ring-2 focus:ring-[#ffd100]/20 transition-all"
                            />
                        </div>

                        <div className="relative">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="appearance-none bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-3 pr-10 text-[#071d49] focus:border-[#ffd100] focus:outline-none focus:ring-2 focus:ring-[#ffd100]/20 transition-all font-medium"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        </div>

                        <button onClick={exportToExcel} variant="outlined"
                            className="flex items-center gap-2 bg-[#ffd100] text-[#071d49] px-6 py-3 rounded-lg font-bold hover:bg-[#ffd100]/90 transition-colors shadow-lg">
                            {<Download />}
                            Export Data
                        </button>

                    </div>
                </div>

                {/* Orders table */}
                <div className="bg-white rounded-lg border-2 border-[#071d49] shadow-lg overflow-hidden">
                    {loading ? (
                        <div className="p-2 text-center">
                            <BeatLoader size={12} color="#071d49" className=" d-flex mx-auto my-3" />

                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[#071d49]">
                                    <tr>
                                        <th className="text-left p-4 text-[#ffd100] font-bold">Customer</th>
                                        <th className="text-left p-4 text-[#ffd100] font-bold">Items</th>
                                        <th className="text-left p-4 text-[#ffd100] font-bold">Total</th>
                                        <th className="text-left p-4 text-[#ffd100] font-bold">Payment</th>
                                        <th className="text-left p-4 text-[#ffd100] font-bold">Status</th>
                                        <th className="text-left p-4 text-[#ffd100] font-bold">Date</th>
                                        <th className="text-left p-4 text-[#ffd100] font-bold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map((order, index) => (
                                        <tr
                                            key={order.id}
                                            className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                                        >

                                            <td className="p-4">
                                                <div>
                                                    <div className="text-[#071d49] font-bold">{order?.address?.fullName}</div>
                                                    <div className="text-gray-600 text-sm flex items-center gap-1">
                                                        <Phone size={12} />
                                                        {order?.address?.phone}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="text-[#071d49] font-medium">{(order.cartItems || []).length} items</div>
                                                <div className="text-gray-600 text-sm">
                                                    {(order.cartItems || []).slice(0, 2).map((item) => item.title).join(", ")}
                                                    {(order.cartItems || []).length > 2 && "..."}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-[#ffd100] font-bold text-lg bg-[#ffd100]/10 px-3 py-1 rounded">${order.total}</span>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-[#071d49] font-medium">{order.paymentMethod}</span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusColor(order.status)}`}>
                                                    {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : "—"}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-[#071d49] text-sm font-medium">{formatDate(order.createdAt)}</span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedOrder(order);
                                                            setShowOrderDetails(true);
                                                        }}
                                                        className="p-2 text-[#071d49] hover:text-[#ffd100] hover:bg-[#ffd100]/10 rounded-lg transition-colors border border-gray-200 hover:border-[#ffd100]"
                                                        title="View Details"
                                                    >
                                                        <Eye size={16} />
                                                    </button>

                                                    {order.status === "pending" && (
                                                        <>
                                                            <button
                                                                onClick={() => handleStatusChange(order.id, "approved")}
                                                                className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors border border-green-200 hover:border-green-300"
                                                                title="Approve"
                                                            >
                                                                <Check size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusChange(order.id, "rejected")}
                                                                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-red-200 hover:border-red-300"
                                                                title="Reject"
                                                            >
                                                                <X size={16} />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Empty state */}
                            {filteredOrders.length === 0 && (
                                <div className="text-center py-12">
                                    <Package className="mx-auto text-gray-300 mb-4" size={48} />
                                    <h3 className="text-[#071d49] text-lg font-bold mb-2">No orders found</h3>
                                    <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Order Details Modal */}
            {showOrderDetails && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={() => {
                        setShowOrderDetails(false);
                        setSelectedOrder(null);
                    }}
                />
            )}
        </DashboardLayout>
    );
}
