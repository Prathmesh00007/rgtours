import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  logOutStart,
  logOutSuccess,
  logOutFailure,
  deleteUserAccountStart,
  deleteUserAccountSuccess,
  deleteUserAccountFailure,
} from "../../redux/user/userSlice";
import { uploadImageWithProgress } from "../../utils/cloudinaryUpload";
import AllBookings from "./AllBookings";
import AdminUpdateProfile from "./AdminUpdateProfile";
import AddPackages from "./AddPackages";
import "./styles/DashboardStyle.css";
import AllPackages from "./AllPackages";
import AllUsers from "./AllUsers";
import Payments from "./Payments";
import RatingsReviews from "./RatingsReviews";
import History from "./History";
const TABS = [
  { id: 1, label: "Bookings" },
  { id: 2, label: "Add package" },
  { id: 3, label: "All packages" },
  { id: 4, label: "Users" },
  { id: 5, label: "Payments" },
  { id: 6, label: "Ratings" },
  { id: 7, label: "History" },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const { currentUser, loading } = useSelector((state) => state.user);
  const [profilePhoto, setProfilePhoto] = useState(undefined);
  const [photoPercentage, setPhotoPercentage] = useState(0);
  const [activePanelId, setActivePanelId] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    address: "",
    phone: "",
    avatar: "",
  });

  useEffect(() => {
    if (currentUser !== null) {
      setFormData({
        username: currentUser.username,
        email: currentUser.email,
        address: currentUser.address,
        phone: currentUser.phone,
        avatar: currentUser.avatar,
      });
    }
  }, [currentUser]);

  const handleProfilePhoto = async (photo) => {
    try {
      dispatch(updateUserStart());
      setPhotoPercentage(0);
      const downloadUrl = await uploadImageWithProgress(photo, {
        folder: "profile-photos",
        onProgress: (p) => setPhotoPercentage(p),
      });
      const res = await fetch(
        `https://rgtours.onrender.com/api/user/update-profile-photo/${currentUser._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ avatar: downloadUrl }),
        }
      );
      const data = await res.json();
      if (data?.success) {
        alert(data?.message);
        setFormData({ ...formData, avatar: downloadUrl });
        dispatch(updateUserSuccess(data?.user));
        setProfilePhoto(null);
        return;
      }
      dispatch(updateUserFailure(data?.message));
      alert(data?.message);
    } catch (error) {
      console.error(error);
      dispatch(updateUserFailure(error?.message));
      alert(error?.message || "Upload failed");
    }
  };

  const handleLogout = async () => {
    try {
      dispatch(logOutStart());
      const res = await fetch("https://rgtours.onrender.com/api/auth/logout");
      const data = await res.json();
      if (data?.success !== true) {
        dispatch(logOutFailure(data?.message));
        return;
      }
      dispatch(logOutSuccess());
      navigate("/login");
      alert(data?.message);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    const CONFIRM = confirm(
      "Are you sure ? the account will be permenantly deleted!"
    );
    if (CONFIRM) {
      try {
        dispatch(deleteUserAccountStart());
        const res = await fetch(`https://rgtours.onrender.com/api/user/delete/${currentUser._id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (data?.success === false) {
          dispatch(deleteUserAccountFailure(data?.message));
          alert("Something went wrong!");
          return;
        }
        dispatch(deleteUserAccountSuccess());
        alert(data?.message);
      } catch (error) {}
    }
  };

  const detailLabel =
    "mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500";

  return (
    <div className="min-h-screen bg-mesh-light">
      {currentUser ? (
        <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-4 py-8 lg:flex-row lg:items-start lg:px-8 lg:py-12">
          <aside className="w-full shrink-0 lg:sticky lg:top-24 lg:max-w-sm">
            <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 shadow-card-lg">
              <div className="h-24 bg-gradient-to-r from-slate-900 via-sky-900 to-cyan-800" />
              <div className="-mt-12 px-6 pb-8">
                <div className="relative mx-auto w-fit">
                  <img
                    src={
                      (profilePhoto && URL.createObjectURL(profilePhoto)) ||
                      formData.avatar
                    }
                    alt="Profile"
                    className="h-28 w-28 cursor-pointer rounded-3xl border-4 border-white object-cover shadow-lg ring-4 ring-sky-100"
                    onClick={() => fileRef.current.click()}
                  />
                  <input
                    type="file"
                    name="photo"
                    id="photo"
                    hidden
                    ref={fileRef}
                    accept="image/*"
                    onChange={(e) => setProfilePhoto(e.target.files[0])}
                  />
                </div>
                {profilePhoto && (
                  <button
                    type="button"
                    onClick={() => handleProfilePhoto(profilePhoto)}
                    className="mt-4 w-full rounded-xl bg-gradient-to-r from-travel-primary to-travel-secondary py-2.5 text-sm font-semibold text-white shadow-glow"
                  >
                    {loading
                      ? `Uploading… (${photoPercentage}%)`
                      : "Save photo"}
                  </button>
                )}

                <div className="mt-6 text-center">
                  <p className="font-display text-xl font-bold text-travel-ink">
                    {currentUser.username}
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-travel-secondary">
                    Admin
                  </p>
                </div>

                <div className="mt-6 space-y-3 rounded-2xl bg-slate-50 p-4 text-sm">
                  <div>
                    <p className={detailLabel}>Email</p>
                    <p className="break-all font-medium text-slate-700">
                      {currentUser.email}
                    </p>
                  </div>
                  <div>
                    <p className={detailLabel}>Phone</p>
                    <p className="font-medium text-slate-700">
                      {currentUser.phone}
                    </p>
                  </div>
                  <div>
                    <p className={detailLabel}>Address</p>
                    <p className="break-words font-medium text-slate-700">
                      {currentUser.address}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={() => setActivePanelId(8)}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-travel-ink shadow-sm transition hover:border-travel-primary/40"
                  >
                    Edit profile
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full rounded-xl border border-red-200 bg-red-50 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                  >
                    Log out
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    className="py-2 text-sm font-medium text-red-600 hover:underline"
                  >
                    Delete account
                  </button>
                </div>
              </div>
            </div>
          </aside>

          <main className="min-w-0 flex-1">
            <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 shadow-card-lg">
              <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-4 md:px-6">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-travel-secondary">
                  Control center
                </p>
                <h1 className="font-display text-2xl font-bold text-travel-ink md:text-3xl">
                  Operations
                </h1>
              </div>

              <div className="overflow-x-auto border-b border-slate-100 bg-white px-2 py-3 md:px-4">
                <div className="flex min-w-max gap-2">
                  {TABS.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setActivePanelId(t.id)}
                      className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                        activePanelId === t.id
                          ? "bg-travel-ink text-white shadow-md"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 md:p-8">
                {activePanelId === 1 ? (
                  <AllBookings />
                ) : activePanelId === 2 ? (
                  <AddPackages />
                ) : activePanelId === 3 ? (
                  <AllPackages />
                ) : activePanelId === 4 ? (
                  <AllUsers />
                ) : activePanelId === 5 ? (
                  <Payments />
                ) : activePanelId === 6 ? (
                  <RatingsReviews />
                ) : activePanelId === 7 ? (
                  <History />
                ) : activePanelId === 8 ? (
                  <AdminUpdateProfile />
                ) : (
                  <p className="text-center text-slate-500">Page not found</p>
                )}
              </div>
            </div>
          </main>
        </div>
      ) : (
        <div className="flex min-h-[50vh] items-center justify-center px-4">
          <p className="rounded-2xl border border-red-100 bg-red-50 px-6 py-4 font-semibold text-red-700">
            Please log in first
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
