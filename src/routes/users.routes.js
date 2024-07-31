import { Router } from "express";
import UserController from "../controllers/users.controller.js";


const router = Router();
const userController = new UserController();

router.post("/register", userController.createUser);
router.post("/requestPasswordReset", userController.requestPasswordReset);
router.post("/resetPassword", userController.resetPassword);
router.put("/premium/:uid", userController.cambioRol);


export default router;