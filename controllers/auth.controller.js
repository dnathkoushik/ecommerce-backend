/**
 * I need to write the controller logic to register and login a user
 */

const bcrypt = require("bcryptjs");
const user_model = require("../models/user.model");
const jwt = require("jsonwebtoken");
const secret = require("../configs/auth.config").secret;

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

exports.signin = async (req, res) => {
    //Check if the userId is present in the system
    const user = await user_model.findOne({userId : req.body.userId});
    if(!user){
        return res.status(400).send({
            message : "Failed! UserId does not exist, Create an account first then try to signin",
        });
    }

    //Passwords match or not
    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password); //true or false
    if(!passwordIsValid){
        return res.status(401).send({
            message : "Invalid Password ! Try again",
        });
    }

    //If all good, generate a JWT access token with a given TTL and return to the user
    const token = jwt.sign({id : user.userId}, secret, {
        expiresIn : 120, //2 minutes
    });

    res.status(200).send({
        name : user.name, 
        userId : user.userId,
        email : user.email, 
        userType : user.userType,
        accessToken : token
    });
}