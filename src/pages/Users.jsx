import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout/DashboardLayout";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [userDelet, setUserDelet] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const querySnapshot = await getDocs(collection(db, "users"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(data);
    }
    fetchUser();
  }, []);

  const handelDeleteClick = (userId) => {
    setUserDelet(userId);
  };

  const confirmDelete = async () => {
    if (userDelet) {
      await deleteDoc(doc(db, "users", userDelet));
      setUsers((prev) => prev.filter((user) => user.id !== userDelet));
      toast.success("User deleted successfully");
      setUserDelet(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 min-h-screen  bg-[#fff]">
        <h2 className="text-2xl font-bold text-[#071d49] pb-4">Users</h2>
        <div>
          <table className="min-w-[1200px] bg-white border border-gray-300 rounded-lg shadow-md text-center">
            <thead className="bg-[#ffd100] text-[#071d49]">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Full Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 border-t border-gray-200"
                >
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">
                    {`${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                      "N/A"}
                  </td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handelDeleteClick(user.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* المودال */}
        {userDelet && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg text-center">
              <h3 className="text-lg font-bold mb-4">Are you sure?</h3>
              <p className="mb-6 text-gray-600">
                Once deleted, this user cannot be restored.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={confirmDelete}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setUserDelet(null)}
                  className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <ToastContainer position="top-right" />
      </div>
    </DashboardLayout>
  );
}
