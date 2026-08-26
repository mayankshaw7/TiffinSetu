import React from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer'; // Footer is in src/components/
const reviews = [
  {
    name: 'Ananya M.',
    city: 'Bengaluru',
    review: 'The meals are fresh, homely, and perfectly suited for my Jain diet. The ordering process is super easy and reliable.',
  },
  {
    name: 'Rohit K.',
    city: 'Mumbai',
    review: 'I have been using TiffinSetu for weeks. The quality, taste, and timely delivery are consistent every single time.',
  },
  {
    name: 'Priya S.',
    city: 'Delhi',
    review: 'The provider listings are transparent and the food quality is excellent. It feels like home-cooked meals without the effort.',
  },
  {
    name: 'Vikram P.',
    city: 'Pune',
    review: 'Great selection of options across localities. The website is simple to use and the experience has been excellent.',
  },
  {
    name: 'Sneha R.',
    city: 'Hyderabad',
    review: 'I love the variety. Customer support is responsive and the food is fresh, flavorful, and hygienic.',
  },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <section className="rounded-3xl bg-gradient-to-r from-green-700 to-emerald-600 px-6 py-12 text-white shadow-xl md:px-12">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-green-100">About Us</p>
            <h1 className="text-4xl font-extrabold md:text-5xl">Fresh, honest meals for every home.</h1>
            <p className="mt-5 text-lg text-green-50">
              TiffinSetu connects food lovers with trusted home-style tiffin providers across India. We make it easier to discover tasty, affordable, and reliable meals that match your lifestyle and budget.
            </p>
          </div>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-green-100 bg-white p-6 shadow hover:shadow-lg hover:shadow-indigo-500 transition">
            <div className="mb-3 text-3xl">🍽️</div>
            <h3 className="text-xl font-bold text-green-800">Home-style taste</h3>
            <p className="mt-2 text-gray-600">Every meal is designed to feel warm, comforting, and close to home, with quality ingredients and hygiene in focus.</p>
          </div>
          <div className="rounded-2xl border border-green-100 bg-white p-6 shadow hover:shadow-lg hover:shadow-indigo-500 transition">
            <div className="mb-3 text-3xl">📍</div>
            <h3 className="text-xl font-bold text-green-800">India-wide coverage</h3>
            <p className="mt-2 text-gray-600">We support customers across major city hubs and local areas in India, helping them find nearby trusted providers quickly.</p>
          </div>
          <div className="rounded-2xl border border-green-100 bg-white p-6 shadow hover:shadow-lg hover:shadow-indigo-500 transition">
            <div className="mb-3 text-3xl">⭐</div>
            <h3 className="text-xl font-bold text-green-800">Trusted reviews</h3>
            <p className="mt-2 text-gray-600">Our platform is built on transparency, repeat customers, and dependable provider listings with consistent quality.</p>
          </div>
        </section>

        <section className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-green-100 bg-white p-8 shadow hover:shadow-lg hover:shadow-indigo-500 transition">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-700">Why people choose us</p>
            <h2 className="mt-3 text-3xl font-bold text-gray-800">Made for families, students, and working professionals</h2>
            <ul className="mt-6 space-y-4 text-gray-700">
              <li className="flex gap-3"><span className="text-green-600">✓</span><span>Easy-to-use filters for veg, Jain, and non-veg preferences.</span></li>
              <li className="flex gap-3"><span className="text-green-600">✓</span><span>Local discovery for the right tiffin service near your area.</span></li>
              <li className="flex gap-3"><span className="text-green-600">✓</span><span>Reliable ordering flow with transparent pricing and clear provider details.</span></li>
              <li className="flex gap-3"><span className="text-green-600">✓</span><span>Comfort and trust for daily meals without repetitive cooking.</span></li>
            </ul>
          </div>

          <div className="rounded-3xl border border-green-100 bg-green-50 p-8 shadow hover:shadow-lg hover:shadow-indigo-500 transition">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-700">Contact</p>
            <h3 className="mt-3 text-2xl font-bold text-green-800">Get in touch</h3>
            <div className="mt-5 space-y-3 text-gray-700">
              <p><span className="font-semibold">Phone:</span> +91 9073766320</p>
              <p><span className="font-semibold">Email:</span> mayankshaw4001@gmail.com</p>
              <p><span className="font-semibold">Location:</span> Bengaluru, Mumbai, Delhi, Pune, Hyderabad</p>
              <p><span className="font-semibold">Service area:</span> India</p>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <div className="mb-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-700">Customer reviews</p>
            <h2 className="mt-3 text-3xl font-bold text-gray-800">Loved by our community</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
            {reviews.map((item) => (
              <div key={item.name} className="rounded-2xl border border-green-100 bg-white p-5 shadow hover:shadow-lg hover:shadow-indigo-500 transition">
                <div className="mb-2 text-yellow-500">★★★★★</div>
                <p className="text-sm text-gray-600">“{item.review}”</p>
                <div className="mt-4 border-t border-green-100 pt-3">
                  <p className="font-bold text-gray-800">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.city}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
       <Footer />
    </div>
  );
};

export default AboutPage;
