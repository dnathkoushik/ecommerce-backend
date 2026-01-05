/**
 * This will be the strating file of the project
 */

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const server_config = require("./configs/server.config");
const db_config = require("./configs/db.config");
const user_model = require("./models/user.model");
const bcrypt = require("bcryptjs");

app.use(express.json()); //middleware  : to parse the incoming request body as JSON

/**
 * Create an admin user at the starting of the application
 * if not already present
 */


//Connection with mongodb
mongoose.connect(db_config.DB_URL)
const db = mongoose.connection;

db.on("error", () => {
    console.log("Error while connecting to the mongoDB");
})

db.once("open", () => {
    console.log("Connected to mongoDB");
    init();
})

async function init(){
    try{
        let user = await user_model.findOne({userId : "admin"});
        if(user){ //if admin already exist
            console.log("Admin is already present");
            return;
        }
    } catch(err){
        console.log("Error while reading the data", err);
    }

    try{

        user = await user_model.create({
            name : "koushik",
            userId : "admin",
            email : "koushikcomhere@gmail.com",
            userType : "ADMIN",
            password : bcrypt.hashSync("Welcome1", 8)
        });
        console.log("Admin created ", user)

    } catch(err){
        console.log("Error while creating admin", err);
    }
}

/**
 * Stich the route to the server
 */
require("./routers/auth.routes")(app);
require("./routers/category.routes")(app);

/**
 * Start the server
 */
app.listen(server_config.PORT, () => {
    console.log("Server started at PORT num : ", server_config.PORT);
});