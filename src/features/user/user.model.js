export default class UserModel {

    constructor(name, email, password, type, id) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.type = type;
        this._id = id;
    }
 
    // static signIn (email, password) {
    //     const user = users.find ( 
    //         (u) => u.email == email && u.password == password
    //     );
    //     return user; 
    // }  
    static getAll () {
        return users;
    }
}

let users = [
    {
        id: 1,
        name : "seller",
        email : "seller@gmail.com",
        password : "seller",
        type : "seller",
    },
    {
        id: 2,
        name : "customer",
        email : "customer@gmail.com",
        password : "customer",
        type : "customer",
    },
]