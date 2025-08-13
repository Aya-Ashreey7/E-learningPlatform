export default function CourseCard({
  image,
  title,
  category,
  enrolled,
  price,
  duration,
}) {
  return (
    <div
      className="w-80 bg-white rounded-3xl shadow-lg
       hover:shadow-yellow-200 transition-shadow duration-300 p-6 cursor-pointer flex flex-col"
    >
      <img
        src={image}
        alt={title}
        className="w-full h-44 object-cover rounded-3xl mb-5 border-4 border-[#ffd100] shadow-md"
      />
      <div className="px-3 flex-grow flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-[#071d49] mb-1 tracking-wide drop-shadow-sm">
            {title}
          </h2>
          <p className="text-sm  text-[#555] mb-3">{category}</p>

          <div className="flex justify-start gap-6 text-[#071d49] text-lg mb-3 font-semibold whitespace-nowrap">
            <p className="mr-6">
              Enrolled:{" "}
              <span className="font-bold text-[#ffd100]">
                {enrolled} students
              </span>
            </p>
          </div>

          <p className="text-[#071d49] text-lg font-semibold whitespace-nowrap mb-6 flex gap-17">
            <span>
              Price: <span className="text-[#ffd100]">${price}</span>
            </span>
            <span>
              Duration:{" "}
              <span className="font-bold text-[#ffd100]">{duration}h</span>
            </span>
          </p>
        </div>

        <button
          className="bg-[#ffd100] text-[#071d49] font-extrabold py-3 rounded-2xl hover:bg-yellow-400 transition-colors duration-300 shadow-md"
          type="button"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
