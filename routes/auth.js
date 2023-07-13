const router = require('express').Router();
const User = require('../models/User');
const CryptoJS = require('crypto-js');
const jwt = require("jsonwebtoken");
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
        phone : req.body.phone,
        address: req.body.address,
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

//LOGIN
router.post('/login', async (req, res)=>{
    try{
        //findOne() used to find user in DB
        const user = await User.findOne({username: req.body.username});
        //if username is not found in DB then send error msg to client
        // !user && res.status(401).json("Username not found")
        if(!user) return res.status(401).json("Username not found");
        const hashPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
        const originalPassword = hashPassword.toString(CryptoJS.enc.Utf8);
        const inputPassword = req.body.password;
        //if user enter incorrect password
        // originalPassword != inputPassword && res.status(401).json("Password is incorrect")
        if(originalPassword != inputPassword) return res.status(401).json("Password is incorrect")

        //creating accessToken
        const accessToken = jwt.sign(
        {
            id: user._id,
            isAdmin: user.isAdmin,
        }, process.env.JWT_SEC,
        {expiresIn: "3d"}
        );

        //if everything is right
        const{password, ...others} = user._doc;
        // res.status(200).json(user);
        res.status(200).json({...others, accessToken});

    }
    catch(err){
        res.status(500).json(err);
    }
});


module.exports = router;