import { Router } from "express";
import Authenticate from "../middleware/Authenticate.js";
import AdminUserController from '../controller/admin/UserController.js'

// Create a new router instance
const router = Router();
// Create a new user
router.post("/create_user", Authenticate.adminAuthenticate, AdminUserController.create);

// get all users
router.get("/get_all_users", Authenticate.adminAuthenticate, AdminUserController.getAllUsers);

// get user by id
router.get("/get_user/:user_id", Authenticate.adminAuthenticate, AdminUserController.getUser);

// Update user
router.put("/update_user/:user_id", Authenticate.adminAuthenticate, AdminUserController.updateUser);

// Delete a user
router.delete("/delete_user/:user_id", Authenticate.adminAuthenticate, AdminUserController.deleteUser);

export default router;