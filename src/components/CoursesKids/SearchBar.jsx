// import React from "react";

// export default function SearchBar({
//   search,
//   setSearch,
//   filter,
//   setFilter,
//   categories,
// }) {
//   return (
//     <form
//       onSubmit={(e) => e.preventDefault()} // منع إعادة تحميل الصفحة لو الفورم اتعمل submit بالغلط
//       className="flex items-center gap-4 w-full max-w-md mt-4 p-6"
//     >
//       <input
//         type="text"
//         placeholder="Search"
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         className="flex-grow p-2 rounded-xl border border-gray-300 shadow-md
//           focus:outline-none focus:ring-2 focus:ring-[#071d49] hover:border-[#071d49]"
//       />
//       <div className="relative">
//         <select
//           value={filter}
//           onChange={(e) => setFilter(e.target.value)}
//           className="appearance-none p-2 pl-8 pr-4 rounded-xl border border-gray-300 shadow-md cursor-pointer
//           focus:outline-none focus:ring-2 focus:ring-[#071d49] hover:border-[#071d49]"
//         >
//           <option value="all">All</option>
//           {categories.map((cat) => (
//             <option key={cat.id} value={cat.name.toLowerCase()}>
//               {cat.name}
//             </option>
//           ))}
//         </select>

//         <svg
//           className="w-5 h-5 absolute left-2 top-2.5 pointer-events-none text-gray-500"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           viewBox="0 0 24 24"
//         >
//           <path d="M3 4h18M9 12h6M10 16h4" />
//         </svg>
//       </div>
//     </form>
//   );
// }
