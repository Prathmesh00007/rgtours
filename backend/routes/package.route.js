import express from "express";
import {
  createPackage,
  deletePackage,
  getPackageData,
  getPackages,
  updatePackage,
} from "../controllers/package.controller.js";

const router = express.Router();

//create package
router.post("/create-package", createPackage);

//update package by id
router.post("/update-package/:id", updatePackage);

//delete package by id
router.delete("/delete-package/:id", deletePackage);

//get all packages
router.get("/get-packages", getPackages);

//get single package data by id
router.get("/get-package-data/:id", getPackageData);

export default router;
