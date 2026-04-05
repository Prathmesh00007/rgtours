import React, { useEffect, useState } from "react";
import { uploadImageWithProgress } from "../../utils/cloudinaryUpload";
import { useNavigate, useParams } from "react-router";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-travel-ink outline-none transition focus:border-travel-primary/50 focus:ring-4 focus:ring-sky-500/15";
const labelClass =
  "mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500";

const UpdatePackage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    packageName: "",
    packageDescription: "",
    packageDestination: "",
    packageTravelStartDate: "",
    packageTravelEndDate: "",
    packageDays: 1,
    packageNights: 1,
    packageAccommodation: "",
    packageTransportation: "",
    packageMeals: "",
    packageActivities: "",
    packagePrice: 500,
    packageDiscountPrice: 0,
    packageOffer: false,
    packageImages: [],
  });
  const [images, setImages] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUploadPercent, setImageUploadPercent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const getPackageData = async () => {
    try {
      const res = await fetch(`https://rgtours.onrender.com/api/package/get-package-data/${params?.id}`);
      const data = await res.json();
      if (data?.success) {
        setFormData({
          packageName: data?.packageData?.packageName,
          packageDescription: data?.packageData?.packageDescription,
          packageDestination: data?.packageData?.packageDestination,
          packageTravelStartDate:
            data?.packageData?.packageTravelStartDate || "",
          packageTravelEndDate: data?.packageData?.packageTravelEndDate || "",
          packageDays: data?.packageData?.packageDays,
          packageNights: data?.packageData?.packageNights,
          packageAccommodation: data?.packageData?.packageAccommodation,
          packageTransportation: data?.packageData?.packageTransportation,
          packageMeals: data?.packageData?.packageMeals,
          packageActivities: data?.packageData?.packageActivities,
          packagePrice: data?.packageData?.packagePrice,
          packageDiscountPrice: data?.packageData?.packageDiscountPrice,
          packageOffer: data?.packageData?.packageOffer,
          packageImages: data?.packageData?.packageImages,
        });
      } else {
        alert(data?.message || "Something went wrong!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (params.id) getPackageData();
  }, [params.id]);

  const handleChange = (e) => {
    const { id, type, checked, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageSubmit = () => {
    if (
      images.length > 0 &&
      images.length + formData.packageImages.length < 6
    ) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < images.length; i++) {
        promises.push(storeImage(images[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            packageImages: formData.packageImages.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image upload failed (2mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 5 images per package");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return uploadImageWithProgress(file, {
      folder: "packages",
      onProgress: (p) => setImageUploadPercent(p),
    });
  };

  const handleDeleteImage = (index) => {
    setFormData({
      ...formData,
      packageImages: formData.packageImages.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.packageImages.length === 0) {
      alert("You must upload atleast 1 image");
      return;
    }
    if (
      formData.packageName === "" ||
      formData.packageDescription === "" ||
      formData.packageDestination === "" ||
      formData.packageAccommodation === "" ||
      formData.packageTransportation === "" ||
      formData.packageMeals === "" ||
      formData.packageActivities === "" ||
      formData.packagePrice === 0
    ) {
      alert("All fields are required!");
      return;
    }
    if (formData.packagePrice < 0) {
      alert("Price should be greater than 500!");
      return;
    }
    if (formData.packageDiscountPrice >= formData.packagePrice) {
      alert("Regular Price should be greater than Discount Price!");
      return;
    }
    if (formData.packageTravelStartDate > formData.packageTravelEndDate) {
      alert("Travel start date must be on or before travel end date!");
      return;
    }
    if (formData.packageOffer === false) {
      setFormData({ ...formData, packageDiscountPrice: 0 });
    }
    try {
      setLoading(true);
      setError(false);

      const res = await fetch(`https://rgtours.onrender.com/api/package/update-package/${params?.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          packageDiscountPrice: formData.packageOffer
            ? formData.packageDiscountPrice
            : 0,
        }),
      });
      const data = await res.json();
      if (data?.success === false) {
        setError(data?.message);
        setLoading(false);
      }
      setLoading(false);
      setError(false);
      alert(data?.message);
      navigate(`/package/${params?.id}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-travel-secondary">
          Catalog
        </p>
        <h2 className="font-display text-2xl font-bold text-travel-ink md:text-3xl">
          Update package
        </h2>
        <p className="mt-1 text-sm text-travel-muted">
          Adjust copy, pricing, and media. Changes save to your live listing.
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <form
          onSubmit={handleSubmit}
          className="w-full flex-1 rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-card md:p-8 lg:max-w-3xl"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <label htmlFor="packageName" className={labelClass}>
                Package name
              </label>
              <input
                type="text"
                className={inputClass}
                id="packageName"
                value={formData?.packageName}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="packageDescription" className={labelClass}>
                Description
              </label>
              <textarea
                rows={4}
                className={`${inputClass} resize-y`}
                id="packageDescription"
                value={formData.packageDescription}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="packageDestination" className={labelClass}>
                Destination
              </label>
              <input
                type="text"
                className={inputClass}
                id="packageDestination"
                value={formData.packageDestination}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="packageTravelStartDate" className={labelClass}>
                Travel start date
              </label>
              <input
                type="date"
                className={inputClass}
                id="packageTravelStartDate"
                value={formData.packageTravelStartDate}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="packageTravelEndDate" className={labelClass}>
                Travel end date
              </label>
              <input
                type="date"
                className={inputClass}
                id="packageTravelEndDate"
                value={formData.packageTravelEndDate}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="packageDays" className={labelClass}>
                Days
              </label>
              <input
                type="number"
                className={inputClass}
                id="packageDays"
                value={formData.packageDays}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="packageNights" className={labelClass}>
                Nights
              </label>
              <input
                type="number"
                className={inputClass}
                id="packageNights"
                value={formData.packageNights}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="packageAccommodation" className={labelClass}>
                Accommodation
              </label>
              <textarea
                rows={3}
                className={`${inputClass} resize-y`}
                id="packageAccommodation"
                value={formData.packageAccommodation}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="packageTransportation" className={labelClass}>
                Transportation
                <span className="ml-2 font-normal normal-case text-slate-400">
                  (current: {formData?.packageTransportation || "—"})
                </span>
              </label>
              <select
                className={inputClass}
                id="packageTransportation"
                value={formData?.packageTransportation || ""}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="Flight">Flight</option>
                <option value="Train">Train</option>
                <option value="Boat">Boat</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="packageMeals" className={labelClass}>
                Meals
              </label>
              <textarea
                rows={3}
                className={`${inputClass} resize-y`}
                id="packageMeals"
                value={formData.packageMeals}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="packageActivities" className={labelClass}>
                Activities
              </label>
              <textarea
                rows={3}
                className={`${inputClass} resize-y`}
                id="packageActivities"
                value={formData.packageActivities}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="packagePrice" className={labelClass}>
                Price (INR)
              </label>
              <input
                type="number"
                className={inputClass}
                id="packagePrice"
                value={formData.packagePrice}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-end">
              <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-travel-primary focus:ring-travel-primary"
                  id="packageOffer"
                  checked={formData?.packageOffer}
                  onChange={handleChange}
                />
                <span className="text-sm font-semibold text-travel-ink">
                  Special offer
                </span>
              </label>
            </div>

            <div
              className={`${
                formData.packageOffer ? "md:col-span-2" : "hidden"
              }`}
            >
              <label htmlFor="packageDiscountPrice" className={labelClass}>
                Discount price (INR)
              </label>
              <input
                type="number"
                className={inputClass}
                id="packageDiscountPrice"
                value={formData.packageDiscountPrice}
                onChange={handleChange}
              />
            </div>
          </div>

          {(imageUploadError || error) && (
            <p className="mt-4 text-sm font-medium text-red-600">
              {imageUploadError || error}
            </p>
          )}

          <button
            disabled={uploading || loading}
            className="mt-8 w-full rounded-xl bg-gradient-to-r from-travel-primary to-travel-secondary py-3.5 text-sm font-semibold text-white shadow-glow transition hover:brightness-105 disabled:opacity-60"
          >
            {uploading ? "Uploading…" : loading ? "Saving…" : "Save changes"}
          </button>
        </form>

        <div className="w-full shrink-0 rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-card md:p-8 lg:max-w-md">
          <h3 className="font-display text-lg font-bold text-travel-ink">
            Gallery
          </h3>
          <p className="mt-1 text-sm text-travel-muted">
            Add or remove images. Max 5 total, 2MB each.
          </p>

          <label htmlFor="packageImages" className={`${labelClass} mt-6`}>
            Upload new images
          </label>
          <input
            type="file"
            className="w-full cursor-pointer rounded-xl border border-dashed border-slate-300 bg-slate-50/80 px-4 py-4 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-travel-primary file:px-4 file:py-2 file:font-semibold file:text-white"
            id="packageImages"
            multiple
            onChange={(e) => setImages(e.target.files)}
          />

          {formData?.packageImages?.length > 0 && (
            <div className="mt-6 space-y-3">
              {formData.packageImages.map((image, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3"
                >
                  <img src={image} alt="" className="h-16 w-16 rounded-xl object-cover" />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(i)}
                    className="text-sm font-semibold text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            disabled={uploading || loading || images.length === 0}
            className="mt-6 w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            onClick={handleImageSubmit}
          >
            {uploading
              ? `Uploading… (${imageUploadPercent}%)`
              : loading
              ? "Loading…"
              : "Upload to gallery"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdatePackage;
