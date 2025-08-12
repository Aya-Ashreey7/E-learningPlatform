import { FiLogOut } from "react-icons/fi";

export default function NavbarDash() {
  return (
    <>
      <div className="bg-[#071d49] w-full flex justify-between items-center p-4 shadow-md">
        <p className="text-white text-lg font-semibold">SCCD Admin</p>
        <div className="text-white text-lg flex items-center gap-4">
          {/* اغيرها بي اسم الشخص الي بالاكونت  */}
          <p>Welcome Admin</p>
          <button
            className="flex items-center gap-2 bg-[#ffd100] hover:bg-yellow-400 text-[#071d49] font-semibold rounded 
        px-3 py-1 transition duration-200"
          >
            Logout
            <FiLogOut className="w-5 h-5" />
          </button>{" "}
        </div>
      </div>
    </>
  );
}
