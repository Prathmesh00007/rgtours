import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";

const AllUsers = () => {
  const [allUser, setAllUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const getUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`https://rgtours.onrender.com/api/user/getAllUsers?searchTerm=${search}`);
      const data = await res.json();

      if (data && data?.success === false) {
        setLoading(false);
        setError(data?.message);
      } else {
        setLoading(false);
        setAllUsers(data);
        setError(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUsers();
    if (search) getUsers();
  }, [search]);

  const handleUserDelete = async (userId) => {
    const CONFIRM = confirm(
      "Are you sure ? the account will be permenantly deleted!"
    );
    if (CONFIRM) {
      setLoading(true);
      try {
        const res = await fetch(`https://rgtours.onrender.com/api/user/delete-user/${userId}`, {
          method: "DELETE",
          credentials: "include",
        });
        const data = await res.json();
        if (data?.success === false) {
          setLoading(false);
          alert("Something went wrong!");
          return;
        }
        setLoading(false);
        alert(data?.message);
        getUsers();
      } catch (error) {}
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-travel-secondary">
          People
        </p>
        <h2 className="font-display text-2xl font-bold text-travel-ink md:text-3xl">
          All users
        </h2>
        <p className="mt-1 text-sm text-travel-muted">
          Search and manage registered accounts
        </p>
      </div>

      <div className="mb-8">
        <div className="relative mb-4">
          <input
            type="text"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pl-12 text-sm outline-none transition focus:border-travel-primary/50 focus:ring-4 focus:ring-sky-500/15"
            placeholder="Search by name, email or phone..."
            onChange={(e) => setSearch(e.target.value)}
          />
          <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-4">
          <h3 className="text-sm font-semibold text-travel-ink">
            Total users:{" "}
            <span className="font-display text-lg text-travel-primary">
              {loading ? "…" : allUser.length}
            </span>
          </h3>
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

      {!loading && !error && allUser && allUser.length === 0 && (
        <div className="text-center py-20">
          <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No Users Found</h3>
          <p className="text-gray-600">No users match your search criteria</p>
        </div>
      )}

      {!loading && !error && allUser && allUser.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Username</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Address</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allUser.map((user, i) => (
                  <tr key={i} className="transition-colors hover:bg-slate-50/80">
                    <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-xs">
                      {user._id}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-travel-dark">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-xs">
                      {user.address}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.phone}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        disabled={loading}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        onClick={() => handleUserDelete(user._id)}
                        title="Delete User"
                      >
                        <FaTrash className="w-5 h-5" />
                      </button>
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

export default AllUsers;
