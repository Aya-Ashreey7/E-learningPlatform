import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout/DashboardLayout";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function MessageDashboard() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "messages"));
        const msgs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(msgs);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
      setLoading(false);
    };
    fetchMessages();
  }, []);

  const formatDate = (timestamp) => {
    return timestamp?.toDate().toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen -translate-y-12">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-[#071d49]"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 min-h-screen bg-gray-50">
        <h2 className="text-3xl font-bold text-[#202124] pb-3 mb-6">
          Messages from Users
        </h2>

        {messages.length === 0 ? (
          <p className="text-gray-500 text-lg">No messages yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition duration-300 border border-gray-200"
              >
                <h3 className="text-[#1a73e8] font-bold text-lg mb-1 border-b border-gray-200 pb-1">
                  {msg.name}
                </h3>
                <p className="text-gray-900 text-base mb-1">{msg.comment}</p>
                <p className="text-gray-700 text-sm mb-1">
                  <span className="font-medium">Email:</span> {msg.email}
                </p>
                <p className="text-gray-500 text-sm">
                  <span className="font-medium">Sent:</span>{" "}
                  {formatDate(msg.createdAt)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
