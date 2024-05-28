// Manage routes "/paths" to ProductController

// Import
import express from "express";
import ProductController from "./product.controller.js";
import {upload} from "../../middlewares/fileupload.middleware.js"

// Initialize Express Router
const productRouter = express.Router();

// Initialize instance for ProductController
const productController = new ProductController ();

// All the paths to controller methods
// productRouter.get("/", productController.getAllProducts);
// productRouter.post("/", upload.single('imageUrl'), productController.addProduct);
// productRouter.get("/:id", productController.getOneProduct);
productRouter.post("/rate", (req, res, next) => {
    productController.rateProduct(req, res, next)
});
productRouter.get("/", (req, res) => {
    productController.getAllProducts(req, res)
});
productRouter.post("/", upload.single('imageUrl'), (req, res) => {
    productController.addProduct(req, res)
});
productRouter.get("/filter", (req, res) => {
    productController.filterProducts(req, res)
});
productRouter.get("/averagePrice", (req, res, next)=>{
    productController.averagePrice(req, res)
});
productRouter.get("/:id", (req, res) => {
    productController.getOneProduct(req, res)
});
// localhost:3300/api/products/filter?minPrice=10&maxPrice=20&category=Category1
// productRouter.get("/filter", productController.filterProducts);
// localhost:3300/api/products/rate?userID=2&productId=1&rating=4
// productRouter.post("/rate", productController.rateProduct); 


export default productRouter;