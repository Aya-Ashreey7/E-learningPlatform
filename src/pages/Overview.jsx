import {
  FiBookOpen,
  FiUsers,
  FiCalendar,
  FiMessageSquare,
} from "react-icons/fi";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { FaBookOpen } from "react-icons/fa";
import { HiOutlineClock } from "react-icons/hi";

import DashboardLayout from "../components/DashboardLayout/DashboardLayout";
import LineChartComponent from "../components/Charts/LineChartComponent";
import BarChartComponent from "../components/Charts/BarChartComponent";
import PieChartComponent from "../components/Charts/PieChartComponent";
import PaymentChartComponent from "../components/Charts/PaymentChartComponent";
import { useEffect, useState } from "react";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../firebase";

export default function Overview() {
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [latestCourses, setLatestCourses] = useState([]);
  const [latestUsers, setLatestUsers] = useState([]);
  const [latestOrders, setLatestOrders] = useState([]);
  const [lastFeedbacks, setLastFeedbacks] = useState([]);

  // firebase
  useEffect(() => {
    const totalCourseDoc = onSnapshot(collection(db, "Courses"), (snapshot) => {
      setTotalCourses(snapshot.size);
    });
    const totalUsersDoc = onSnapshot(collection(db, "users"), (snapshot) => {
      setTotalUsers(snapshot.size);
    });
    const totalBookingDoc = onSnapshot(collection(db, "Orders"), (snapshot) => {
      setTotalBookings(snapshot.size);
    });

    const latestCoursesQuery = query(
      collection(db, "Courses"),
      orderBy("createdAt", "desc"),
      limit(3)
    );

    const unsubscribeLatest = onSnapshot(latestCoursesQuery, (snapshot) => {
      const courses = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLatestCourses(courses);
    });

    const latestUsersQuery = query(
      collection(db, "users"),
      orderBy("createdAt", "desc"),
      limit(3)
    );
    const unsubscribeLatestUsers = onSnapshot(latestUsersQuery, (snapshot) => {
      const users = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLatestUsers(users);
    });

    const latestOrdersQuery = query(
      collection(db, "Orders"),
      orderBy("createdAt", "desc"),
      limit(3)
    );
    const unsubscribeLatestOrders = onSnapshot(
      latestOrdersQuery,
      (snapshot) => {
        const orders = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLatestOrders(orders);
      }
    );

    const latestFeedbacksQuery = query(
      collection(db, "feedbacks"),
      orderBy("createdAt", "desc"),
      limit(3)
    );
    const unsubscribeLatestFeedbacks = onSnapshot(
      latestFeedbacksQuery,
      (snapshot) => {
        const feedbacks = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLastFeedbacks(feedbacks);
      }
    );
    return () => {
      totalCourseDoc();
      totalUsersDoc();
      totalBookingDoc();
      unsubscribeLatest();
      unsubscribeLatestUsers();
      unsubscribeLatestOrders();
      unsubscribeLatestFeedbacks();
    };
  }, []);

  return (
    <DashboardLayout>
      {/* Top cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6">
        <div className="bg-white text-[#071d49] rounded-xl p-4 shadow flex items-center min-w-[220px]">
          <div className="bg-[#ffd100] rounded-full p-3 mr-4 flex items-center justify-center">
            <FiBookOpen className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Total Courses</h3>
            <p className="text-2xl font-bold mt-1">{totalCourses}</p>
          </div>
        </div>

        <div className="bg-white text-[#071d49] rounded-xl p-4 shadow flex items-center min-w-[220px]">
          <div className="bg-[#ffd100] rounded-full p-3 mr-4 flex items-center justify-center">
            <FiUsers className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Total Users</h3>
            <p className="text-2xl font-bold mt-1">{totalUsers}</p>
          </div>
        </div>

        <div className="bg-white text-[#071d49] rounded-xl p-4 shadow flex items-center min-w-[220px]">
          <div className="bg-[#ffd100] rounded-full p-3 mr-4 flex items-center justify-center">
            <FiCalendar className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Total Bookings</h3>
            <p className="text-2xl font-bold mt-1">{totalBookings}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <div className="bg-white text-[#071d49] rounded-xl p-4 shadow">
          <h3 className="text-lg font-semibold mb-2">User Growth Over Time</h3>
          <LineChartComponent />
        </div>
        <div className="bg-white text-[#071d49] rounded-xl p-4 shadow">
          <h3 className="text-lg font-semibold mb-2">Bookings Per Month</h3>
          <BarChartComponent />
        </div>
        <div className="bg-white text-[#071d49] rounded-xl p-4 shadow">
          <h3 className="text-lg font-semibold mb-2">
            Course Distribution by Category
          </h3>
          <PieChartComponent />
        </div>
        <div className="bg-white text-[#071d49] rounded-xl p-4 shadow">
          <h3 className="text-lg font-semibold mb-2">Payment Methods Used</h3>
          <PaymentChartComponent />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="p-6">
        <div className="bg-white text-[#071d49] rounded-xl p-4 shadow">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <HiOutlineClock className="text-[#071d49]" /> Recent Activity
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <FaBookOpen className="text-indigo-600" /> Latest Courses
              </h4>
              <ul className="space-y-1 text-sm text-gray-700">
                {latestCourses.map((course) => (
                  <li key={course.id}>{course.title}</li>
                ))}
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <BsFillPersonPlusFill className="text-green-600" /> New Users
              </h4>
              <ul className="space-y-1 text-sm text-gray-700">
                {latestUsers.map((user) => (
                  <li key={user.id}>{`${user.firstName} ${user.lastName} `}</li>
                ))}
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <FiCalendar className="text-yellow-600" /> Recent Bookings
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                {latestOrders.map((order) => {
                  const createdAt = order.createdAt?.toDate
                    ? order.createdAt.toDate()
                    : null;
                  return (
                    <li
                      key={order.id}
                      className="border-b border-gray-200 pb-2"
                    >
                      <span className="font-semibold text-[#071d49]">
                        {order?.address?.fullName ||
                          order.customerName ||
                          "Unknown"}
                      </span>{" "}
                      ordered:{" "}
                      {order.cartItems && order.cartItems.length > 0
                        ? order.cartItems
                            .map((item) => `${item.title} (x${item.quantity})`)
                            .join(", ")
                        : "No courses"}{" "}
                      —{" "}
                      <span className="font-medium">
                        Total: {order.total} EGP
                      </span>
                      {createdAt && (
                        <div className="text-xs text-gray-500">
                          {createdAt.toLocaleDateString()}{" "}
                          {createdAt.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <FiMessageSquare className="text-purple-600" /> Latest Reviews
              </h4>
              <ul className="space-y-3 text-sm text-gray-700">
                {lastFeedbacks.map((feedback) => {
                  const createdAt = feedback.createdAt?.toDate
                    ? feedback.createdAt.toDate()
                    : null;

                  return (
                    <li
                      key={feedback.id}
                      className="p-3 border border-gray-200 rounded-lg bg-gray-50"
                    >
                      <p className="italic text-gray-800">
                        “{feedback.message}”
                      </p>
                      <div className="flex justify-between items-center mt-2 text-xs text-gray-600">
                        <span className="font-semibold text-[#071d49]">
                          — {feedback.userName}
                        </span>
                        {createdAt && (
                          <span className="text-gray-400">
                            {createdAt.toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
