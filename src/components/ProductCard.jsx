



// src/components/ProductCard.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { FiStar } from "react-icons/fi";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Resolve image from common backend fields; fallback to placeholder
  const image =
    product.imgurl ||
    product.image ||
    product.img ||
    product.imageUrl ||
    `https://picsum.photos/seed/${encodeURIComponent(product.name || product.title || "product")}/600/400`;

  const title = product.name || product.title || "Untitled Product";
  const desc = product.description || "No description available";
  const price = product.price ?? 0;
  const id = product._id || product.id || "";
  const rating = (product.rating === 0 || product.rating) ? Number(product.rating) : null;

  function handleBuyNow() {
    // navigate to booking page and pass the product in state so Booking.jsx doesn't need to refetch
    navigate(`/booking/${id}`, { state: { product } });
  }

  return (
    <div className="border rounded-2xl overflow-hidden shadow-sm bg-white hover:shadow-md transition">
      {/* Image container */}
      <div className="w-full h-40 md:h-48 lg:h-56 bg-white/80 flex items-center justify-center overflow-hidden">
        <img
          src={image}
          alt={title}
          className="max-w-full max-h-full object-contain"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = `https://picsum.photos/seed/fallback-${encodeURIComponent(title)}/600/400`;
          }}
        />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-lg line-clamp-1">{title}</h4>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{desc}</p>
          </div>

          {/* Rating badge */}
          <div className="flex-shrink-0 ml-3">
            {rating !== null ? (
              <div className="inline-flex items-center gap-1 bg-yellow-50 border border-yellow-100 text-yellow-700 px-2 py-1 rounded-md text-sm font-medium">
                <FiStar className="text-yellow-600" />
                <span>{rating}</span>
              </div>
            ) : (
              <div className="text-xs text-gray-400">—</div>
            )}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="font-bold text-indigo-600 text-lg">₹ {price}</div>

          <div className="flex items-center gap-2">
            <Link
              to={`/booking/${id}`}
              state={{ product }}
              className="text-sm px-3 py-1 border rounded-lg hover:bg-gray-50"
            >
              Details
            </Link>

            <button
              onClick={() => addToCart({ ...product, img: image, title })}
              className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Add
            </button>

            <button
              onClick={handleBuyNow}
              className="px-3 py-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              title="Buy now"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
