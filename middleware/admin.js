// Middleware for handling auth
const jwt=require("jsonwebtoken");
// const jwtPassword =require("../routes/admin");
const jwtPassword = require("../config");


function adminMiddleware(req, res, next) {
  const token =req.headers.authorization;
  const words=token.split(" ");
  const jwtToken=words[1];
  try{
    const decodedValue=jwt.verify(jwtToken,jwtPassword);
    if(decodedValue.email){
        next();
    }else{
        res.status(403).json({message:"you are not authorized"})
    }
  }catch(e){
    res.json({msg:"Incorrest input"})
  }

  

    
    
}

module.exports = adminMiddleware;