import {ObjectId} from 'mongodb';
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

class ProductRepository{

    constructor(){
        this.collection = "products";
    }
 
    async add(newProduct){
        try{
            // 1 . Get the db.
            const db = getDB();
            const collection = db.collection(this.collection);
            await collection.insertOne(newProduct);
            return newProduct;
        } catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with database add", 500);
        }
    }

    async getAll(){
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            const products = await collection.find().toArray();
            console.log(products);
            return products;
        } catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with database getAll", 500);
        }
    }

    async get(id){
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            return  await collection.findOne({_id: new ObjectId(id)});
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with database get(id)", 500);
        }
    }

    async filter(minPrice, categories){
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            let filterExpression={};
            if(minPrice){
                filterExpression.price = {$gte: parseFloat(minPrice)}
            }
            // if(maxPrice){
            //     filterExpression.price = {...filterExpression.price, $lte: parseFloat(maxPrice)}
            // }
            categories = JSON.parse(categories.replace(/'/g,'"'));
            if(categories){
                filterExpression={$or:[{category:{$in: categories}}, filterExpression]}
                // filterExpression.category=category;
            }
            return collection.find(filterExpression).project({name:1, price:1, _id:0, ratings:{$slice:-1}}).toArray();
            // return await collection.find(filterExpression).toArray();
            
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with database filter", 500);
        }
    } 

    async rate(userID, productID, rating){
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            // Removes existing entry
            await collection.updateOne({
                _id:new ObjectId(productID)
            }, {
                $pull: {ratings: {userID:new ObjectId(userID)}}
            })
            // Add new entry
            await collection.updateOne({
                _id:new ObjectId(productID)
            },{
                $push: {ratings: {userID:new ObjectId(userID), rating}}
            })
        } catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with database rate", 500);
        }
    }

    // async rate(userID, productID, rating){
    //     try{
    //         const db = getDB();
    //         const collection = db.collection(this.collection);
    //         // Find the product
    //         const product = await collection.findOne ({_id: new ObjectId(productID)});
    //         // Find the rating
    //         const userRating = product?.ratings?.find( r => r.userID == userID );
    //         if(userRating) {
    //             // Update the data
    //             await collection.updateOne ({_id: new ObjectId(productID), "ratings.userID": new ObjectId(userID)}, {$set: {"ratings.$.rating": rating}})
    //         } else {
    //             await collection.updateOne({
    //                 _id:new ObjectId(productID)
    //             },{
    //                 $push: {ratings: {userID:new ObjectId(userID), rating}}
    //             })
    //         }
    //     } catch(err){
    //         console.log(err);
    //         throw new ApplicationError("Something went wrong with database rate", 500);
    //     }
    // }

    async averageProductPricePerCategory(){
        try{
            const db=getDB();
            return await db.collection(this.collection)
                .aggregate([
                    {
                        // Stage 1: Get Vaerge price per category
                        $group:{
                            _id:"$category",
                            averagePrice:{$avg:"$price"}
                        }
                    }
                ]).toArray();
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with database averageProductPricePerCategory", 500);    
        }
    }
}

export default ProductRepository;