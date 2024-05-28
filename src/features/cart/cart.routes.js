// Manage routes "/paths" to ProductController

// Import
import express from "express";
import CartItemController from "./cart.controller.js";
import jwtAuth from '../../middlewares/jwt.middleware.js';

// Initialize Express Router
const cartRouter = express.Router();

// Initialize instance for ProductController
const cartController = new CartItemController ();

// All the paths to controller methods
// localhost:3300/api/cart?productID=1&quantity=2
// cartRouter.delete("/:id", cartController.delete);
// cartRouter.post("/", cartController.add);
// cartRouter.get("/", cartController.get);

cartRouter.delete('/:id', (req, res, next)=>{
    cartController.delete(req, res, next)
 });
cartRouter.post('/', (req, res, next)=>{
    cartController.add(req, res, next)
 });
cartRouter.get('/', (req, res, next)=>{
    cartController.get(req, res, next)
 });

export default cartRouter;