import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

const ProfilePage = ({ design = 1 }) => {
  const auth = getAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const getInitials = (first, last) => {
    if (!first && !last) return "??";
    return `${first?.[0] || ""}${last?.[0] || ""}`.toUpperCase();
  };

  const formatDate = (timestamp) => {
    if (!timestamp?.seconds) return "N/A";
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      setUser(currentUser);

      try {
        // Fetch user profile
        const userDocRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserData({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            address: data.address || "",
          });
        }

        // Fetch orders
        const ordersQuery = query(
          collection(db, "Orders"),
          where("userId", "==", currentUser.uid)
        );
        const ordersSnap = await getDocs(ordersQuery);
        let ordersList = ordersSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        ordersList.sort((a, b) => {
          const dateA = a.createdAt?.seconds || 0;
          const dateB = b.createdAt?.seconds || 0;
          return dateB - dateA;
        });

        setOrders(ordersList);
      } catch (error) {
        console.error("Error fetching profile/orders:", error);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  // Loading design
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#f9f9f9]">
          <div className="w-12 h-12 border-4 border-[#071d49] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-[#071d49] font-semibold">
            Loading your profile...
          </p>
        </div>
        <Footer />
      </>
    );
  }

  // If no user
  if (!user) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-[#071d49] px-4">
          <h1 className="text-3xl font-bold mb-4">You're not logged in</h1>
          <p className="mb-6 text-lg text-center">
            Please log in to view your profile and orders.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-white text-[#071d49] font-semibold rounded-lg shadow hover:opacity-90 transition"
          >
            Go to Login
          </button>
        </div>
        <Footer />
      </>
    );
  }

  const { firstName, lastName, address } = userData || {};
  const initials = getInitials(firstName, lastName);

  const sharedOrdersList =
    orders.length === 0 ? (
      <p className="text-gray-500">No orders found.</p>
    ) : (
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border border-[#071d49]/30 rounded-lg p-4 bg-white hover:border-[#ffd100] hover:shadow-md transition"
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold text-[#071d49]">
                Order #{order.id}
              </span>
              <span className="text-sm text-gray-500">
                {formatDate(order.createdAt)}
              </span>
            </div>
            <p className="mt-1 text-[#071d49]">
              Total: <strong>{order.total || 0} EGP</strong>
            </p>
            <p className="text-sm text-gray-500">
              Status: {order.status || "pending"}
            </p>
          </div>
        ))}
      </div>
    );

  const avatar = user?.photoURL ? (
    <img
      src={user.photoURL}
      alt="Profile"
      className="w-24 h-24 rounded-full border-4 border-[#ffd100] object-cover"
    />
  ) : (
    <div className="w-24 h-24 flex items-center justify-center rounded-full bg-[#071d49] text-white text-2xl font-bold border-4 border-[#ffd100]">
      {initials}
    </div>
  );

  const buttons = (
    <div className="mt-8 flex flex-col gap-3">
      <button
        onClick={() => navigate("/edit-profile")}
        className="w-full py-2 rounded-lg bg-gradient-to-r from-[#071d49] to-[#ffd100] text-white font-semibold hover:opacity-90 transition"
      >
        Edit Profile
      </button>
      <button
        onClick={() => {
          auth.signOut();
          navigate("/login");
        }}
        className="w-full py-2 rounded-lg bg-gradient-to-r from-[#071d49] to-[#ffd100] text-white font-semibold hover:opacity-90 transition"
      >
        Logout
      </button>
    </div>
  );

  const layouts = {
    1: (
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-3xl border border-[#071d49]/30">
        <div className="flex flex-col items-center gap-3">
          {avatar}
          <h2 className="text-2xl font-bold text-[#071d49]">
            {firstName} {lastName}
          </h2>
          <p className="text-gray-600">{user?.email || ""}</p>
          <p className="text-gray-600">{address || ""}</p>
        </div>
        <div className="mt-8">
          <h3 className="text-lg font-bold text-[#071d49] border-b pb-2 mb-4">
            My Orders
          </h3>
          {sharedOrdersList}
        </div>
        {buttons}
      </div>
    ),
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center p-4">
        {layouts[design]}
      </div>
      <Footer />
    </>
  );
};

export default ProfilePage;
