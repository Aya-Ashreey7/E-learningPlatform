import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { useAuth } from "../AuthContext/AuthContext";
import { Heart } from "lucide-react";

export default function CourseCard({
  id,
  image,
  title,
  category,
  enrolled,
  price,
  duration,
}) {
  const { addToCart } = useCart();
  const [fav, setFav] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const exists = wishlist.find((item) => item.id === id);
    setFav(!!exists);
  }, [id]);

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login first to add to wishlist.");
      return;
    }

    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    if (fav) {
      wishlist = wishlist.filter((item) => item.id !== id);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      setFav(false);
      toast.error("Removed from Wishlist");
    } else {
      wishlist.push({
        id,
        image,
        title,
        category,
        enrolled,
        price,
        duration,
      });
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      setFav(true);
      toast.success("Added to Wishlist");
    }
  };

  return (
    <Link to={`/courses/kids/${id}`} className="no-underline">
      <div
        className="w-80 bg-white rounded-3xl shadow-lg
       hover:shadow-yellow-200 transition-shadow duration-300 p-6 cursor-pointer flex flex-col"
      >
        <div className="relative">
          <img
            src={image}
            alt={title}
            className="w-full h-65 object-cover rounded-3xl mb-5 border-4 border-[#ffd100] shadow-md"
          />

          <Heart
            size={24}
            className={`absolute top-4 right-4 cursor-pointer transition-colors duration-200 ${
              fav ? "text-red-500 fill-red-500" : "text-gray-500"
            }`}
            onClick={handleToggleWishlist}
          />
        </div>

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

            <p className="text-[#071d49] text-lg font-semibold whitespace-nowrap mb-6 flex gap-14">
              <span>
                Price: <span className="text-[#ffd100]">{price} EGP</span>
              </span>
              <span>
                Duration:{" "}
                <span className="font-bold text-[#ffd100]">{duration}h</span>
              </span>
            </p>
          </div>

          <button
            className="bg-[#ffd100] text-[#071d49] font-extrabold py-3 rounded-2xl hover:bg-yellow-400
             transition-colors duration-300 shadow-md cursor-pointer"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              addToCart({
                id,
                image,
                title,
                category,
                enrolled,
                price,
                duration,
              });
              toast.success("Course added to cart successfully");
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}
