import dotenv from 'dotenv';
// load all the environment variables in application
dotenv.config();
import express from 'express';
import swagger from 'swagger-ui-express';
import cors from 'cors';

import productRouter from "./src/features/product/product.routes.js";
import userRouter from './src/features/user/user.routes.js';
import cartRouter from './src/features/cart/cart.routes.js';
import jwtAuth from './src/middlewares/jwt.middleware.js';
import apiDocs from './swagger.json' with {type: 'json'};
import loggerMiddleware from './src/middlewares/logger.middleware.js';
import { ApplicationError } from './src/error-handler/applicationError.js';
import {connectToMongoDB} from './src/config/mongodb.js';
import orderRouter from './src/features/order/order.routes.js';

// Create Server
const server = express ();

// CORS policy configuration
var corsOptions = {
    origin: 'http://127.0.0.1:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }
server.use(cors(corsOptions)); // allows access to specific users
// server.use(cors()); // allows access to all users
// server.use((req, res, next)=>{
//     res.header('Access-Control-Allow-Origin','http://127.0.0.1:3000');   // allows access to specific users
//     res.header('Access-Control-Allow-Headers','*');                      // * allows access to all users
//     res.header('Access-Control-Allow-Methods','*');                      // * allows access to all users
//     // return ok for preflight request.
//     if(req.method=="OPTIONS"){
//       return res.sendStatus(200);
//     }
//     next();
//   });
server.use(express.json());

// For all requests related to product, redirect to product.routes
// localhost:3300/api-docs/
server.use("/api-docs", swagger.serve, swagger.setup(apiDocs));
server.use(loggerMiddleware);
server.use("/api/orders", jwtAuth, orderRouter);
server.use("/api/products", jwtAuth, productRouter);
server.use("/api/cart", jwtAuth, cartRouter);
server.use("/api/user", userRouter);

// Default Request Handler
server.get ("/", (req, res) => {
    res.send ("Welcome to E-Commerce APIs");
});

// Error Handler middleware
server.use((err, req, res, next) => {
    console.log(err);
    if (err instanceof ApplicationError){
        res.status(err.code).send(err.message);
    }
    
    // server errors.
    res.status(500).send('Something went wrong, please try later');
});

// Middleware to handle 404 requests
server.use((req, res) => {
    res.status(404).send("Page not found");
});

// Specify Port
server.listen(3300, () => {
    console.log (" Server is running on port 3300 ");
    connectToMongoDB();
});