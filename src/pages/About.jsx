// src/pages/About.jsx
import React from 'react'
import { FaGlobe, FaHandsHelping, FaShieldAlt, FaClock } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function About(){
  return (
    <main className="max-w-6xl mx-auto px-4 md:px-6 py-12">
      {/* HERO */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-10">
        <div>
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
            <FaGlobe className="w-4 h-4" />
            Global marketplace
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4">About Raynott</h1>

          <p className="text-gray-700 text-lg mb-6">
            Raynott E-com connects exceptional makers with customers across the globe. We curate products for quality and longevity, make pricing transparent, and back every purchase with friendly support.
          </p>

          <div className="flex gap-3 flex-wrap">
            <Link to="/products" className="inline-block px-5 py-3 bg-indigo-600 text-white rounded-2xl shadow-sm hover:shadow-lg transition">
              Browse products
            </Link>
            <Link to="/contact" className="inline-block px-5 py-3 border rounded-2xl text-gray-700 hover:bg-gray-50 transition">
              Contact us
            </Link>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden shadow-lg">
          <img
            src="https://picsum.photos/seed/about-hero/1000/700"
            alt="Raynott team and goods"
            className="w-full h-72 object-cover md:h-full"
          />
        </div>
      </section>

      {/* MISSION + STATS */}
      <section className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-sm border">
          <h2 className="text-xl font-semibold mb-3">Our mission</h2>
          <p className="text-gray-700">
            Deliver quality goods, protect buyer trust, and make cross-border shopping frictionless. We partner with producers who meet strict quality and ethical standards, then handle logistics so you get great products without the fuss.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border text-center">
            <div className="text-2xl font-bold">120k+</div>
            <div className="text-sm text-gray-500 mt-1">Happy customers</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border text-center">
            <div className="text-2xl font-bold">30+</div>
            <div className="text-sm text-gray-500 mt-1">Countries shipped</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border text-center">
            <div className="text-2xl font-bold">500+</div>
            <div className="text-sm text-gray-500 mt-1">Curated items</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border text-center">
            <div className="text-2xl font-bold">24/7</div>
            <div className="text-sm text-gray-500 mt-1">Support</div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4">What we stand for</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Card icon={<FaShieldAlt />} title="Buyer Protection" body="Secure payments, transparent returns and a clear dispute process." />
          <Card icon={<FaHandsHelping />} title="Fair partnerships" body="We pay fair margins to makers and work on long-term relationships." />
          <Card icon={<FaGlobe />} title="Global reach" body="Logistics and shipping solutions that connect makers to customers worldwide." />
          <Card icon={<FaClock />} title="Reliable delivery" body="We monitor shipments and proactively update you until delivery." />
        </div>
      </section>

      {/* TEAM / STORY */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4">Our story & team</h3>
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <p className="text-gray-700 mb-4">
            Founded by global commerce builders, Raynott started with a simple idea: make curated international shopping feel local. Our small team spans product, logistics, and customer success — focused on creating delightful experiences.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <TeamMember name="Anita Sharma" title="Founder & CEO" img="https://i.pravatar.cc/100?img=32" />
            <TeamMember name="Liam Chen" title="Head of Product" img="https://i.pravatar.cc/100?img=12" />
            <TeamMember name="Sofia Martinez" title="Head of Customer Success" img="https://i.pravatar.cc/100?img=52" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mb-6">
        <div className="rounded-2xl p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-lg font-semibold">Ready to try Raynott?</div>
            <div className="text-sm text-gray-600">Browse our handpicked collection — free shipping at flat rates.</div>
          </div>
          <div className="flex gap-3">
            <Link to="/products" className="px-4 py-2 bg-indigo-600 text-white rounded-full shadow-sm">Shop products</Link>
            <Link to="/contact" className="px-4 py-2 border rounded-full text-sm">Get support</Link>
          </div>
        </div>
      </section>
    </main>
  )
}

/* small helper components */

function Card({ icon, title, body }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border h-full flex flex-col gap-3">
      <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
        {icon}
      </div>
      <div className="font-semibold">{title}</div>
      <div className="text-sm text-gray-600 mt-auto">{body}</div>
    </div>
  )
}

function TeamMember({ name, title, img }) {
  return (
    <div className="flex items-center gap-3">
      <img src={img} alt={name} className="w-14 h-14 rounded-lg object-cover" />
      <div>
        <div className="font-medium">{name}</div>
        <div className="text-sm text-gray-500">{title}</div>
      </div>
    </div>
  )
}
