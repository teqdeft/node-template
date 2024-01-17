import AuthController from "../controller/AuthController.js";
import { Router } from "express";
import Authenticate from "../middleware/Authenticate.js";

// Create a new router instance
const router = Router();

// Create a new user
router.post("/register", AuthController.register);
//login user
router.post("/login", AuthController.login);
//forgot_password
router.post("/forgot_password", AuthController.forgotPassword);
// update password
router.post("/update_password", AuthController.UpdatePassword);

export default router;