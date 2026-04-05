import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const History = () => {
  const { currentUser } = useSelector((state) => state.user);
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

  const handleHistoryDelete = async (id) => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/booking/delete-booking-history/${id}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (data?.success) {
        setLoading(false);
        alert(data?.message);
        getAllBookings();
      } else {
        setLoading(false);
        alert(data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-travel-secondary">
          Archive
        </p>
        <h2 className="font-display text-2xl font-bold text-travel-ink md:text-3xl">
          Booking history
        </h2>
        <p className="mt-1 text-sm text-travel-muted">
          Past trips and cancelled reservations
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No History Found</h3>
          <p className="text-gray-600">No booking history available</p>
        </div>
      )}

      {!loading && !error && allBookings && allBookings.length > 0 && (
        <div className="space-y-4">
          {allBookings.map((booking, i) => {
            const isPast = new Date(booking?.date).getTime() < new Date().getTime();
            const isCancelled = booking?.status === "Cancelled";
            
            return (
              <div
                key={i}
                className={`rounded-2xl border p-6 shadow-sm transition hover:shadow-card ${
                  isCancelled
                    ? "border-red-200 bg-red-50/80"
                    : "border-slate-200/80 bg-white/95"
                }`}
              >
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                  <Link to={`/package/${booking?.packageDetails?._id}`} className="flex-shrink-0">
                    <img
                      className="w-24 h-24 rounded-lg object-cover hover:scale-105 transition-transform"
                      src={booking?.packageDetails?.packageImages[0]}
                      alt="Package"
                    />
                  </Link>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Link to={`/package/${booking?.packageDetails?._id}`}>
                        <h3 className="text-xl font-bold text-travel-dark hover:text-travel-primary transition-colors">
                          {booking?.packageDetails?.packageName}
                        </h3>
                      </Link>
                      {isCancelled && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold">
                          Cancelled
                        </span>
                      )}
                      {isPast && !isCancelled && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-semibold">
                          Completed
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-travel-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>{booking?.buyer?.username}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-travel-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span>{booking?.buyer?.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-travel-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-semibold">{booking?.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-travel-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-bold text-travel-success">${booking?.totalPrice}</span>
                      </div>
                    </div>
                  </div>

                  {(isPast || isCancelled) && (
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this booking from history?")) {
                          handleHistoryDelete(booking._id);
                        }
                      }}
                      className="whitespace-nowrap rounded-xl border border-red-200 bg-red-50 px-5 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default History;
