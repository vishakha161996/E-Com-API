import ProductModel from "./product.model.js";
import ProductRepository from './product.repository.js';

export default class ProductController {  
 
    constructor(){
        this.productRepository = new ProductRepository();
      }
    
    async getAllProducts (req, res) {
        try {
            const products = await this.productRepository.getAll();
            res.status(200).send(products);
        }catch (err) {
            console.log (err);
            return res.status(400).send('Something went wrong in controller getAllProducts');
        }         
    }
    async addProduct (req, res) {
        try {
            const { name, price, sizes } = req.body;
            const newProduct = new ProductModel(name, null, parseFloat(price), req.file.filename, null, sizes.split(','));
            const createdRecord = await this.productRepository.add(newProduct);
            res.status(201).send(createdRecord);
        } catch (err) {
            console.log (err);
            return res.status(400).send('Something went wrong in controller addProduct');
        }    
    }
    async getOneProduct (req, res) {
        try {
            const id = req.params.id;
            const product = await this.productRepository.get(id);
            if(!product) {
                res.status(404).send('Product not found');
            } else {
                return res.status(200).send(product);
            }
        } catch (err) {
            console.log (err);
            return res.status(400).send('Something went wrong in controller getOneProduct');
        } 
    }
    async filterProducts (req, res) {
        try {
            const minPrice = req.query.minPrice;
            // const maxPrice = req.query.maxPrice;
            const categories = req.query.categories;
            const result = await this.productRepository.filter(minPrice, categories);
            res.status(200).send(result);
        }
        catch (err) {
            console.log (err);
            return res.status(400).send('Something went wrong in controller filterProducts');
        } 
    }
    async rateProduct (req, res, next) {
        // console.log(req.query);
        try{ 
            const userID = req.userID;
            const productID = req.body.productID;
            const rating = req.body.rating;
            await this. productRepository.rate(userID, productID, rating);
            return res.status(200).send('Rating has been added');
        } catch(err){
            console.log("Passing error to middleware controller rateProduct");
            next(err);
        }

        // const userID = req.query.userID;
        // const productID = req.query.productID;
        // const rating = req.query.rating;
        // // try {
        // //     ProductModel.rateProduct(userID, productID, rating);
        // // } catch (err) {
        // //     res.status(400).send(err.message);
        // // } return res.status(200).send('Rating has been added');
        // ProductModel.rateProduct(userID, productID, rating);
        // return res.status(200).send('Rating has been added');
    }

    async averagePrice(req, res, next){
        try{
          const result =await this.productRepository.averageProductPricePerCategory();
          res.status(200).send(result);
        }catch(err){
        console.log(err);
        return res.status(200).send("Something went wrong in controller averagePrice");
      }
    }
}