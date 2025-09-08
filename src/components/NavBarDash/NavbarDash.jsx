import { FiLogOut } from "react-icons/fi";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";

export default function NavbarDash() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="bg-[#071d49] w-full flex justify-between items-center p-4 shadow-md">
      <p className="text-white text-lg font-semibold"> Scientific Center</p>
      <div className="text-white text-lg flex items-center gap-4">
        <p>Welcome Admin</p>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-[#ffd100] hover:bg-yellow-400 text-[#071d49] font-semibold rounded 
          px-3 py-1 transition duration-200 cursor-pointer"
        >
          Logout
          <FiLogOut className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
