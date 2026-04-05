import express from "express";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import { uploadImageMemory } from "../middlewares/uploadMiddleware.js";
import { uploadImage } from "../controllers/upload.controller.js";

const router = express.Router();

const uploadSingle = (req, res, next) => {
  uploadImageMemory.single("file")(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "Image must be 2MB or smaller",
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message || "Invalid file",
      });
    }
    next();
  });
};

router.post("/image", requireSignIn, uploadSingle, uploadImage);

export default router;
