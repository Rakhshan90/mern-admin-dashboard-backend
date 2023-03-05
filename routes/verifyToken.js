const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next)=>{
    const authHeader = req.headers.token;
    if(authHeader){
        //verify token
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SEC, (err, user)=>{
            if(err) return res.status(403).json("Token is not valid");
            //if everything is ok
            req.user = user;
            next();
        });
    }
    else{
        return res.status(401).json("You are not authenticated!");
    }
};

const verifyTokenAndAuthorization = (req, res, next)=>{
    verifyToken(req, res, ()=>{
        if(req.user.id === req.params.id || req.user.isAdmin){
            next(); //process continue
        }
        else{
            return res.status(403).json("Your are not allowd to do that!")
        }
    });
};
const verifyTokenAndAdmin = (req, res, next)=>{
    verifyToken(req, res, ()=>{
        if(req.user.isAdmin){
            next(); //process continue
        }
        else{
            return res.status(403).json("Your are not allowd to do that!")
        }
    });
};

module.exports = {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin};