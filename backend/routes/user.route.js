import express from "express";
import {
  deleteUserAccount,
  deleteUserAccountAdmin,
  getAllUsers,
  updateProfilePhoto,
  updateUser,
  updateUserPassword,
} from "../controllers/user.controller.js";
import { isAdmin } from "../middlewares/authMiddleware.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

//user auth
router.get("/user-auth", (req, res) => {
  return res.status(200).send({ check: true });
});

//admin auth
router.get("/admin-auth", (req, res) => {
  res.status(200).send({ check: true });
});

//update user details
router.post("/update/:id", requireSignIn, updateUser);

//update user profile photo
router.post("/update-profile-photo/:id", requireSignIn, updateProfilePhoto);

//update user password
router.post("/update-password/:id", requireSignIn, updateUserPassword);

//delete user account
router.delete("/delete/:id", requireSignIn, deleteUserAccount);

//get all users
router.get("/getAllUsers", getAllUsers);

//admin delete user accounts
router.delete(
  "/delete-user/:id",
  deleteUserAccountAdmin
);

export default router;
