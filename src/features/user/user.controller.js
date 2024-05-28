import UserModel from "./user.model.js";
import jwt from "jsonwebtoken";
import UserRepository from "./user.repository.js";
import bcrypt from 'bcrypt';

export default class UserController {

    constructor () {
        this.userRepository = new UserRepository ();
    }
    async signUp (req, res) {
        const {name, email, password, type} = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new UserModel (name, email, hashedPassword, type);
        await this.userRepository.signUp(user);
        res.status(201).send(user);
    }
    async signIn (req, res, next) {
        try {
            // const result = UserModel.signIn (req.body.email, req.body.password);
            const user = await this.userRepository.findByEmail (req.body.email);
            if(!user) {
                res.status(400).send('Incorrect Credentials');
            } else {
                // compare password with hashedPassword
                const result = await bcrypt.compare(req.body.password, user.password);
                if (result){
                    const token = jwt.sign({userID:user._id, email:user.email},process.env.JWT_SECRET,{expiresIn:'1h',});
                    // send token
                    return res.status(200).send(token);
                } else {
                    res.status(400).send('Incorrect Credentials');
                }
            }
        } catch (err) {
            console.log (err);
            return res.status(400).send('Something went wrong in controller signIn');
        }  
    }
}