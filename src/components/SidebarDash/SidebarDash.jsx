import {
  FiBarChart,
  FiShoppingBag,
  FiPlusSquare,
  FiEdit2,
  FiUsers,
  FiMessageCircle,
  FiEdit,
} from "react-icons/fi";
import { NavLink } from "react-router-dom";

export default function SidebarDash() {
  return (
    <aside className="fixed top-0 left-0  bg-[#061a3a]  w-64 h-screen flex flex-col p-6 shadow-lg z-40">
      <div>
        <h2 className="text-white text-2xl font-bold mb-8 tracking-wide border-b border-[#1f3261] pb-4">
          Dashboard
        </h2>
        <nav>
          <ul className="space-y-3 mt-4">
            <li>
              <NavLink
                to="/dashboard/overview"
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg font-medium transition-colors cursor-pointer ${isActive
                    ? "bg-[#ffd100] text-[#071d49] shadow font-bold"
                    : "text-white hover:bg-yellow-300 hover:text-[#071d49]"
                  }`
                }
              >
                <FiBarChart className="w-5 h-5 mr-3" />
                Overview
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/dashboard/orders"
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg font-medium transition-colors cursor-pointer ${isActive
                    ? "bg-[#ffd100] text-[#071d49] shadow font-bold"
                    : "text-white hover:bg-yellow-300 hover:text-[#071d49]"
                  }`
                }
              >
                <FiShoppingBag className="w-5 h-5 mr-3" />
                Orders
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/dashboard/add-course"
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg font-medium transition-colors cursor-pointer ${isActive
                    ? "bg-[#ffd100] text-[#071d49] shadow font-bold"
                    : "text-white hover:bg-yellow-300 hover:text-[#071d49]"
                  }`
                }
              >
                <FiPlusSquare className="w-5 h-5 mr-3" />
                Add Course
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/dashboard/manage-courses"
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg font-medium transition-colors cursor-pointer ${isActive
                    ? "bg-[#ffd100] text-[#071d49] shadow font-bold"
                    : "text-white hover:bg-yellow-300 hover:text-[#071d49]"
                  }`
                }
              >
                <FiEdit2 className="w-5 h-5 mr-3" />
                Manage Courses
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/dashboard/users"
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg font-medium transition-colors cursor-pointer ${isActive
                    ? "bg-[#ffd100] text-[#071d49] shadow font-bold"
                    : "text-white hover:bg-yellow-300 hover:text-[#071d49]"
                  }`
                }
              >
                <FiUsers className="w-5 h-5 mr-3" />
                Users
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/dashboard/feedback"
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg font-medium transition-colors cursor-pointer ${isActive
                    ? "bg-[#ffd100] text-[#071d49] shadow font-bold"
                    : "text-white hover:bg-yellow-300 hover:text-[#071d49]"
                  }`
                }
              >
                <FiMessageCircle className="w-5 h-5 mr-3" />
                Feedback
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/dashboard/addblog"
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg font-medium transition-colors cursor-pointer ${isActive
                    ? "bg-[#ffd100] text-[#071d49] shadow font-bold"
                    : "text-white hover:bg-yellow-300 hover:text-[#071d49]"
                  }`
                }
              >
                <FiEdit className="w-5 h-5 mr-3" />
                Add Blog
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}
