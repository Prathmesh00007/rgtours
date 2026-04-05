import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
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
} from "../redux/user/userSlice";
import { uploadImageWithProgress } from "../utils/cloudinaryUpload";
import MyBookings from "./user/MyBookings";
import UpdateProfile from "./user/UpdateProfile";
import MyHistory from "./user/MyHistory";
import defaultProfileImg from "../assets/images/profile.png";

const Profile = () => {
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
        `/api/user/update-profile-photo/${currentUser._id}`,
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
      const res = await fetch("/api/auth/logout", { credentials: "include" });
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
        const res = await fetch(`/api/user/delete/${currentUser._id}`, {
          method: "DELETE",
          credentials: "include",
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

  const tabBtn = (id, label) => (
    <button
      type="button"
      className={`flex-1 whitespace-nowrap rounded-xl px-4 py-3 text-sm font-semibold transition ${
        activePanelId === id
          ? "bg-white text-travel-ink shadow-sm ring-1 ring-slate-200/80"
          : "text-slate-500 hover:text-travel-ink"
      }`}
      onClick={() => setActivePanelId(id)}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-mesh-light py-10 px-4 md:py-14">
      {currentUser ? (
        <div className="container mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-4">
              <div className="sticky top-24 overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 shadow-card-lg">
                <div className="h-28 bg-gradient-to-br from-sky-500 via-cyan-500 to-teal-500" />
                <div className="-mt-14 px-6 pb-8">
                  <div className="relative mx-auto flex w-fit flex-col items-center">
                    <div className="relative">
                      <img
                        src={
                          (profilePhoto && URL.createObjectURL(profilePhoto)) ||
                          formData.avatar ||
                          defaultProfileImg
                        }
                        alt="Profile"
                        className="h-28 w-28 cursor-pointer rounded-3xl border-4 border-white object-cover shadow-lg ring-4 ring-sky-100 transition hover:opacity-95"
                        onClick={() => fileRef.current.click()}
                      />
                      <button
                        type="button"
                        onClick={() => fileRef.current.click()}
                        className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-travel-ink text-white shadow-md transition hover:bg-slate-800"
                        aria-label="Change photo"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </button>
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
                        className="mt-5 w-full rounded-xl bg-gradient-to-r from-travel-primary to-travel-secondary py-2.5 text-sm font-semibold text-white shadow-glow"
                      >
                        {loading
                          ? `Uploading… (${photoPercentage}%)`
                          : "Upload photo"}
                      </button>
                    )}

                    <h2 className="font-display mt-5 text-2xl font-bold text-travel-ink">
                      {currentUser.username}
                    </h2>
                    <p className="mt-1 text-sm text-travel-muted">Traveler</p>
                  </div>

                  <div className="mt-8 space-y-4 rounded-2xl bg-slate-50/80 p-4">
                    <div className="flex gap-3 text-sm text-slate-600">
                      <svg
                        className="mt-0.5 h-5 w-5 shrink-0 text-travel-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="break-all">{currentUser.email}</span>
                    </div>
                    <div className="flex gap-3 text-sm text-slate-600">
                      <svg
                        className="mt-0.5 h-5 w-5 shrink-0 text-travel-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <span>{currentUser.phone}</span>
                    </div>
                    <div className="flex gap-3 text-sm text-slate-600">
                      <svg
                        className="mt-0.5 h-5 w-5 shrink-0 text-travel-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 111.414-11.314l4.243 4.243a2 2 0 002.828 0l4.243-4.243A8 8 0 1117.657 16.657z"
                        />
                      </svg>
                      <span className="break-all">{currentUser.address}</span>
                    </div>
                  </div>

                  <div className="mt-8 space-y-3">
                    <button
                      type="button"
                      onClick={() => setActivePanelId(3)}
                      className="w-full rounded-xl bg-travel-ink py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      Edit profile
                    </button>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full rounded-xl border border-red-200 bg-red-50 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                    >
                      Log out
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteAccount}
                      className="w-full py-2 text-sm font-medium text-red-600/90 hover:underline"
                    >
                      Delete account
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 shadow-card-lg">
                <div className="border-b border-slate-100 bg-slate-50/50 p-2 md:p-3">
                  <div className="flex gap-1 rounded-2xl bg-slate-100/80 p-1">
                    {tabBtn(1, "My bookings")}
                    {tabBtn(2, "History")}
                  </div>
                </div>
                <div className="p-6 md:p-8">
                  {activePanelId === 1 && <MyBookings />}
                  {activePanelId === 2 && <MyHistory />}
                  {activePanelId === 3 && <UpdateProfile />}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <div className="max-w-md rounded-3xl border border-slate-200/80 bg-white/95 px-10 py-12 text-center shadow-card-lg">
            <p className="font-display text-xl font-bold text-travel-ink">
              Please sign in
            </p>
            <p className="mt-2 text-sm text-travel-muted">
              Access your trips, history, and profile settings.
            </p>
            <Link
              to="/login"
              className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-travel-primary to-travel-secondary py-3 font-semibold text-white shadow-glow"
            >
              Go to login
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
