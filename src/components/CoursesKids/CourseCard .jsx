import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext/AuthContext";
import { Heart, Clock, Users } from "lucide-react";

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
      toast.error("Please login first to add to wishlist");
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
    <Link to={`/courses/kids/${id}`} className="no-underline block h-full">
      <article className="group h-full bg-white rounded-2xl border border-[#e8edf5] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
        <div className="relative aspect-[16/10] overflow-hidden bg-[#f4f7fb]">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071d49]/55 via-transparent to-transparent" />

          <button
            type="button"
            aria-label="Toggle wishlist"
            className="absolute top-3 right-3 p-2 rounded-full bg-white shadow-md hover:bg-[#ffd100] transition"
            onClick={handleToggleWishlist}
          >
            <Heart
              size={18}
              className={
                fav ? "text-red-500 fill-red-500" : "text-[#071d49]"
              }
            />
          </button>

          <span className="absolute bottom-3 left-3 text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full bg-[#ffd100] text-[#071d49]">
            {category}
          </span>
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <h2 className="text-lg font-bold text-[#071d49] leading-snug line-clamp-2 min-h-[3.25rem] group-hover:text-[#0d2a63] transition-colors">
            {title}
          </h2>

          <div className="mt-3 flex items-center gap-4 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <Users size={15} className="text-[#071d49]" />
              {enrolled} students
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock size={15} className="text-[#071d49]" />
              {duration}h
            </span>
          </div>

          <div className="mt-auto pt-5 flex items-center justify-between gap-3">
            <p className="text-xl font-extrabold text-[#071d49]">
              {price}
              <span className="ml-1 text-xs font-semibold text-slate-400">EGP</span>
            </p>
          </div>

          <button
            className="mt-4 w-full bg-[#071d49] text-[#ffd100] font-bold py-2.5 rounded-xl hover:bg-[#ffd100] hover:text-[#071d49] transition-colors duration-300 cursor-pointer"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              const added = addToCart({
                id,
                image,
                title,
                category,
                enrolled,
                price,
                duration,
              });

              if (!user) {
                toast.error("Please login first to add to cart");
                return;
              }

              if (!added) {
                toast.error("Course already in cart");
              } else {
                toast.success("Course added to cart successfully");
              }
            }}
          >
            Add to Cart
          </button>
        </div>
      </article>
    </Link>
  );
}
