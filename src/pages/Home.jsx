



// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Testimonial from "../components/Testimonial";
import AllApi from "../services/AllApi";
// import { MOCK_PRODUCTS } from "../shared";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function fetchProducts() {
      setLoading(true);
      setError("");
      try {
        const res = await AllApi.listProducts();
        console.log("listProducts response:", res);

        if (res && res.success) {
          // server might return array or { data: [...] } or nested shapes
          const raw = Array.isArray(res.data) ? res.data : (res.data?.data || res.data || []);
          const mapped = (raw || []).map((p) => {
            // robust id resolution
            const id = p._id || p.id || (p._doc && p._doc._id) || "";

            const name = p.name || p.title || "Untitled product";
            const description = p.description || "";
            const price = p.price ?? p.amount ?? 0;
            const rating = p.rating ?? 0;

            // prefer imgurl (your model), then other common names, then placeholder
            const image =
              p.imgurl ||
              p.image ||
              p.img ||
              p.imgUrl ||
              (p._doc && (p._doc.imgurl || p._doc.image)) ||
              `https://picsum.photos/seed/${encodeURIComponent(name)}/600/400`;

            // produce the shape ProductCard expects
            return {
              _id: id,
              id,
              name,
              description,
              price,
              rating,
              imgurl: image
            };
          });

          if (mounted) setProducts(mapped);
        } else {
          // API reported failure
          setError((res && (res.error || res.message)) || "Failed to load products from server.");
          console.warn("Products API error:", res);
          if (mounted) setProducts(MOCK_PRODUCTS.slice(0, 3));
        }
      } catch (err) {
        console.error("Unexpected error loading products:", err);
        setError("Unexpected error while loading products.");
        if (mounted) setProducts(MOCK_PRODUCTS.slice(0, 3));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchProducts();
    return () => { mounted = false; };
  }, []);

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-6 py-12">
      {/* HERO */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
        <div>
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
            <svg aria-hidden className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 2v6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 22v-6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Free international shipping (flat rate)
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            Raynott — International goods with local care
          </h1>

          <p className="text-gray-600 text-lg mb-6">
            Curated products selected for quality and longevity. Transparent pricing, friendly support, and hassle-free returns.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/products"
              className="inline-block px-6 py-3 rounded-2xl bg-indigo-600 text-white font-medium shadow-md hover:shadow-lg transition"
              aria-label="Shop products"
            >
              Shop Products
            </Link>

            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border text-gray-700 hover:bg-gray-50 transition"
              aria-label="About Raynott"
            >
              Learn more
            </Link>
          </div>

          {/* Trust / quick stats */}
          <div className="mt-8 grid grid-cols-3 gap-4 max-w-md">
            <div className="flex flex-col">
              <div className="text-2xl font-semibold">120k+</div>
              <div className="text-xs text-gray-500">Happy customers</div>
            </div>
            <div className="flex flex-col">
              <div className="text-2xl font-semibold">30+</div>
              <div className="text-xs text-gray-500">Countries shipped</div>
            </div>
            <div className="flex flex-col">
              <div className="text-2xl font-semibold">24/7</div>
              <div className="text-xs text-gray-500">Support</div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="https://plus.unsplash.com/premium_photo-1681488262364-8aeb1b6aac56?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGUlMjBjb21tZXJjZXxlbnwwfHwwfHx8MA%3D%3D"
              alt="Handpicked international products"
              className="w-full h-full object-cover"
            />
          </div>

          {/* <div className="absolute left-6 bottom-6 bg-white/90 backdrop-blur rounded-2xl p-4 shadow-md border">
            <div className="text-sm text-gray-500">Trending</div>
            <div className="font-semibold">Raynott Classic Watch</div>
            <div className="text-xs text-gray-500 mt-1">Minimalist design · Worldwide shipping</div>
          </div> */}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Featured products</h2>
          <Link to="/products" className="text-sm text-indigo-600 hover:underline">View all products</Link>
        </div>

        {loading ? (
          <div className="p-6 text-center">Loading products…</div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.length === 0 ? (
              <div className="col-span-full text-center text-gray-500">No products found.</div>
            ) : (
              products.slice(0, 3).map((p) => (
                <div key={p.id || p._id} className="transform hover:-translate-y-1 transition">
                  <ProductCard product={{
                    _id: p._id,
                    id: p.id,
                    name: p.name,
                    description: p.description,
                    price: p.price,
                    rating: p.rating,
                    imgurl: p.imgurl || p.image || p.img || p.imageUrl || p.image
                  }} />
                </div>
              ))
            )}
          </div>
        )}
      </section>

      {/* WHY US / BENEFITS */}
      <section className="mb-12">
        <div className="rounded-2xl bg-white p-6 shadow-sm border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-xl font-semibold">Quality Assurance</div>
              <div className="text-sm text-gray-500 mt-2">Every product is inspected and curated.</div>
            </div>
            <div>
              <div className="text-xl font-semibold">Transparent Pricing</div>
              <div className="text-sm text-gray-500 mt-2">No hidden fees — what you see is what you pay.</div>
            </div>
            <div>
              <div className="text-xl font-semibold">Hassle-free Returns</div>
              <div className="text-sm text-gray-500 mt-2">30-day return policy for eligible items.</div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">What customers say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Testimonial name="Aisha" body="Amazing product quality and quick shipping to UAE." />
          <Testimonial name="Tom" body="Great customer support and clear tracking." />
          <Testimonial name="Priya" body="Lovely packaging — perfect gift for family abroad." />
        </div>
      </section>

      {/* PROMO BANNER */}
      <section className="mb-12">
        <div className="rounded-2xl p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-lg">International shipping — flat rates</h3>
            <p className="text-sm text-gray-600 mt-1">Special launch offer: <span className="font-semibold text-indigo-600">15% off</span> your first order.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/products" className="px-4 py-2 bg-indigo-600 text-white rounded-full shadow-sm">Shop now</Link>
            <Link to="/contact" className="px-4 py-2 border rounded-full text-sm">Contact support</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
