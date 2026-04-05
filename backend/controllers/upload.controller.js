import { v2 as cloudinary } from "cloudinary";
import User from "../models/user.model.js";

if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export const uploadImage = async (req, res) => {
  try {
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return res.status(500).json({
        success: false,
        message:
          "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your environment.",
      });
    }

    if (!req.file?.buffer) {
      return res.status(400).json({
        success: false,
        message: "No image file received",
      });
    }

    const rawFolder = req.body.folder || "packages";
    const folder =
      rawFolder === "profile-photos" ? "profile-photos" : "packages";

    if (folder === "packages") {
      const user = await User.findById(req.user.id);
      if (!user || user.user_role !== 1) {
        return res.status(403).json({
          success: false,
          message: "Only admins can upload package images",
        });
      }
    }

    const cloudFolder = `travel-app/${folder}`;

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: cloudFolder,
          resource_type: "image",
        },
        (error, uploadResult) => {
          if (error) reject(error);
          else resolve(uploadResult);
        }
      );
      stream.end(req.file.buffer);
    });

    return res.status(200).json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (err) {
    console.error("Cloudinary upload:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Image upload failed",
    });
  }
};
