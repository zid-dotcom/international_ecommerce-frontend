// src/pages/Products.jsx
import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import AllApi from "../services/AllApi";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError("");

      try {
        const res = await AllApi.listProducts();
        console.log("Products API Response:", res);

        if (res.success) {
          const data = Array.isArray(res.data)
            ? res.data
            : res.data?.data || [];

          const mapped = (data || []).map((p) => ({
            id: p._id || p.id,
            name: p.name,
            description: p.description,
            price: p.price,
            rating: p.rating,
            image:
              p.imgurl ||
              p.image ||
              p.img ||
              `https://picsum.photos/seed/${encodeURIComponent(
                p.name
              )}/600/400`,
            ...p
          }));

          setProducts(mapped);
        } else {
          setError(res.error || "Failed to load products.");
        }
      } catch (err) {
        console.error("Error loading products:", err);
        setError("Unexpected server error.");
      }

      setLoading(false);
    }

    fetchProducts();
  }, []);

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">All Products</h2>

      {loading && <p>Loading products...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.length === 0 ? (
            <p className="text-gray-500">No products found.</p>
          ) : (
            products.map((p) => <ProductCard key={p.id} product={p} />)
          )}
        </div>
      )}
    </main>
  );
}
