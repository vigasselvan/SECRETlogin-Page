//jshint esversion:6
require('dotenv').config();                                      //to store the encrpted keys in safer place.
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');                  //to encrypt the doc in mongoDB

const app = express();

mongoose.connect("mongodb://localhost:27017/userDB");

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });   //encrypting password data in userSchema in a specific format which is stored in .env file.

const User = mongoose.model("User", userSchema);

app.get('/', function(req, res){
    res.render('home');
});

app.get('/register', function(req, res){
    res.render('register');
});

app.get('/login', function(req, res){
    res.render('login');
});

app.post('/register', function(req, res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save().then(doc =>{
        res.render('secrets');
    }).catch(err =>{
        res.send(err);
    });
});

app.post('/login', function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}).then(doc =>{
        if(doc){
            if(password == doc.password){
                res.render('secrets');
            }else{
                res.send("password isn't correct!");
            }
        }else{
            res.send("This user isn't registered!");
        }
    }).catch(err =>{
        res.send(err);
    });
});










app.listen(3000, function() {
    console.log("server started on port 3000.");
});