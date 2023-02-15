const router = require('express').Router();
const User = require('../models/User');
const CryptoJS = require('crypto-js');

//REGISTER
router.post('/register', async(req, res)=>{
    const newUser = new User({
        //to take input from user and send to server we have to use req.body.input
        username: req.body.username,
        email: req.body.email,
        //this will show users password in DB which is risky
        // password: req.body.password,
        //so here i've used cryptoJS to secure my users password
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
    });

    //Trying to store users credentials in our DB asynchronously
    try{
        const savedUser = await newUser.save();
        // console.log(savedUser);
        //sending credentials to client side
        res.status(201).json(savedUser);
    }
    catch(err){
        // console.log(err);
        //if any error. send to the client side
        res.status(500).json(err);
    }

});


module.exports = router;