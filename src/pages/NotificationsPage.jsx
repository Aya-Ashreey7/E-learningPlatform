import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { Bell, Clock, AlertTriangle, RefreshCw } from "lucide-react";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Track authentication state
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubAuth;
  }, []);

  const fetchNotifications = () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      // Only where clause — avoids composite index requirement
      const q = query(
        collection(db, "notifications"),
        where("userId", "==", user.uid)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          let notifs = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Local sort by createdAt (desc)
          notifs.sort((a, b) => {
            const dateA = a.createdAt?.toDate
              ? a.createdAt.toDate()
              : new Date(0);
            const dateB = b.createdAt?.toDate
              ? b.createdAt.toDate()
              : new Date(0);
            return dateB - dateA;
          });

          setNotifications(notifs);
          setLoading(false);
        },
        (err) => {
          console.error("Error fetching notifications:", err);
          setError("Failed to load notifications. Please try again.");
          setLoading(false);
        }
      );

      return unsubscribe;
    } catch (err) {
      console.error(err);
      setError("Unexpected error occurred.");
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsub = fetchNotifications();
    return () => unsub && unsub();
  }, [user]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="p-6 bg-[#f9f9f9] min-h-screen animate-pulse">
        <h1 className="text-2xl font-bold text-[#071d49] flex items-center gap-2 mb-6">
          <Bell className="w-6 h-6 text-[#071d49]" /> Notifications
        </h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-md shadow border border-[#071d49]/20"
            >
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-4">
        <AlertTriangle className="text-red-500 w-12 h-12 mb-3" />
        <p className="text-[#071d49] font-medium">{error}</p>
        <button
          onClick={fetchNotifications}
          className="mt-4 flex items-center gap-2 bg-[#071d49] text-white px-4 py-2 rounded-md hover:bg-[#ffd100] hover:text-[#071d49] transition"
        >
          <RefreshCw size={16} /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#f9f9f9] min-h-screen animate-fade-in">
      <h1 className="text-2xl font-bold text-[#071d49] flex items-center gap-2 mb-6">
        <Bell className="w-6 h-6 text-[#071d49]" /> Notifications
      </h1>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 text-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
            alt="No notifications"
            className="w-32 h-32 mb-4 opacity-90"
          />
          <h2 className="text-lg font-semibold text-[#071d49]">
            No Notifications
          </h2>
          <p className="text-gray-500 mt-1 max-w-xs">
            You’re all caught up! We’ll let you know when there’s something new.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className="bg-white p-4 rounded-md shadow border border-[#071d49]/20 hover:border-[#ffd100] hover:shadow-md transition-all duration-300 animate-slide-up"
            >
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-[#071d49] text-lg">
                  {notif.title || `Notification #${notif.id}`}
                </h2>
                {notif.status && (
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${
                      notif.status === "Delivered"
                        ? "bg-green-100 text-green-600"
                        : notif.status === "Pending"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {notif.status}
                  </span>
                )}
              </div>
              <p className="text-[#071d49]/80 mt-2">
                {notif.message || "You have a new notification."}
              </p>
              <div className="flex items-center text-gray-400 text-sm mt-3">
                <Clock className="w-4 h-4 mr-1" />
                {notif.createdAt?.toDate
                  ? notif.createdAt.toDate().toLocaleString()
                  : "Just now"}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-in-out both;
        }
        .animate-slide-up {
          animation: slideUp 0.4s ease-out both;
        }
      `}</style>
    </div>
  );
};

export default NotificationsPage;
