/**
 * I need to write the controller logic to register a user
 */

const bcrypt = require("bcryptjs");
const user_model = require("../models/user.model");

exports.signup = async (req, res) => {
    /**
     * Logic to create the user
     */

    //1. read the request body
    const request_body = req.body; //gives request body in the form of javascript object

    //2. Insert the data in the users collection in MongoDB
    const userObj = {
        name : request_body.name,
        userId : request_body.userId,
        email : request_body.email,
        password : bcrypt.hashSync(request_body.password, 8),
        userType : request_body.userType
    };

    try{
        const user_created = await user_model.create(userObj);
        //Return the user
        const res_obj = {
            name : user_created.name,
            userId : user_created.userId,
            email : user_created.email,
            userType : user_created.userType,
            createdAt : user_created.createdAt,
            updatedAt : user_created.updatedAt
        }
        res.status(201).send(res_obj);
    } catch (err){
        console.log("Error while creating the user", err);
        res.status(500).send({
            message : "Some internal error while creating the user",
        })
    }

    //3. Return the response back to the user
}