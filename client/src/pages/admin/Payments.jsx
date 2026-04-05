import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Payments = () => {
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");

  const getAllBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/booking/get-allBookings?searchTerm=${search}`
      );
      const data = await res.json();
      if (data?.success) {
        setAllBookings(data?.bookings);
        setLoading(false);
        setError(false);
      } else {
        setLoading(false);
        setError(data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllBookings();
  }, [search]);

  const totalRevenue = allBookings.reduce((sum, booking) => sum + (booking?.totalPrice || 0), 0);

  return (
    <div className="w-full">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-travel-secondary">
          Finance
        </p>
        <h2 className="font-display text-2xl font-bold text-travel-ink md:text-3xl">
          Payment history
        </h2>
        <p className="mt-1 text-sm text-travel-muted">
          Revenue snapshot and transaction log
        </p>
      </div>

      <div className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-sky-900 to-cyan-800 p-8 text-white shadow-card-lg">
        <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-white/70">
          Total revenue
        </h3>
        <p className="font-display mt-2 text-4xl font-bold">
          ${totalRevenue.toLocaleString()}
        </p>
      </div>

      <div className="mb-8">
        <div className="relative">
          <input
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pl-12 text-sm outline-none transition focus:border-travel-primary/50 focus:ring-4 focus:ring-sky-500/15"
            type="text"
            placeholder="Search by username or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-travel-primary border-t-transparent" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-700 font-semibold">{error}</p>
        </div>
      )}

      {!loading && !error && allBookings && allBookings.length === 0 && (
        <div className="text-center py-20">
          <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No Payments Found</h3>
          <p className="text-gray-600">No payment records match your search</p>
        </div>
      )}

      {!loading && !error && allBookings && allBookings.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Package</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allBookings.map((booking, i) => (
                  <tr key={i} className="transition-colors hover:bg-slate-50/80">
                    <td className="px-6 py-4">
                      <Link to={`/package/${booking?.packageDetails?._id}`} className="flex items-center gap-3">
                        <img
                          className="w-12 h-12 rounded-lg object-cover"
                          src={booking?.packageDetails?.packageImages[0]}
                          alt="Package"
                        />
                        <span className="font-semibold text-travel-dark hover:text-travel-primary">
                          {booking?.packageDetails?.packageName}
                        </span>
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{booking?.buyer?.username}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{booking?.buyer?.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{booking?.date}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-bold text-travel-success text-lg">${booking?.totalPrice}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
