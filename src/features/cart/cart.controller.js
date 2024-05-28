import CartItemModel from "./cart.model.js";
import CartItemsRepository from "./cart.repository.js";

export default class CartItemController {

    constructor(){
        this.cartItemsRepository = new CartItemsRepository();
    }

    async add(req, res) {
        try{ 
            const { productID, quantity } = req.body;
            const userID = req.userID;
            await this.cartItemsRepository.add(productID, userID, quantity);
            res.status(201).send("Cart is updated");
        }catch(err){
            console.log(err);
            return res.status(200).send("Something went wrong in controller add");
           }    
    }

    async get(req, res){
        try{
            const userID = req.userID;
            const items = await this.cartItemsRepository.get(userID);
            return res.status(200).send(items);
        }catch(err){
            console.log(err);
            return res.status(200).send("Something went wrong in controller get.");
           }   
    }

    async delete(req, res) {
        const userID = req.userID;
        const cartItemID = req.params.id;
        const isDeleted = await this.cartItemsRepository.delete(
            userID,
            cartItemID
        );
        if (!isDeleted) {
            return res.status(404).send("Cart item not found");
        }
        return res
        .status(200)
        .send('Cart item is removed');
    }

    // add(req, res) {
    //     const { productID, quantity } = req.query;
    //     const userID = req.userID;
    //     CartItemModel.add(productID, userID, quantity);
    //     res.status(201).send('Cart is updated');
    // }
    // get(req, res) {
    //     const userID = req.userID;
    //     const items = CartItemModel.get(userID);
    //     res.status(200).send(items);
    // }
    // delete(req, res) {
    //     const userID = req.userID;
    //     const cartItemID = req.params.id;
    //     const error = CartItemModel.delete(cartItemID, userID);
    //     if(error) {
    //         return res.status(404).send(error);
    //     } else {
    //         return res.status(200).send('Cart Item Deleted Successfully');
    //     }
    // }
}