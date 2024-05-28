// Manage routes "/paths" to UserController

// Import
import express from "express";
import UserController from "./user.controller.js";

// Initialize Express Router
const userRouter = express.Router();

// Initialize instance for ProductController
const userController = new UserController ();

// All the paths to controller methods
// localhost:3300/api/user/signup
userRouter.post("/signup", (req, res) => {
    userController.signUp(req, res)
});
userRouter.post("/signin", (req, res) => {
    userController.signIn(req, res)
});
// userRouter.post("/signin", userController.signIn);

export default userRouter; 