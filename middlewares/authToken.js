//Token Validation
const jwt = require("jsonwebtoken")
const CONFIG = require("../config/config")

module.exports = function validateToken(req, res, next) {
    if(req.path != "/users/login"){
        if(req.headers.authorization){
            let token = req.headers.authorization.split(" ")[1]
            console.log(token)
            console.log(CONFIG.SECRET_KEY)
             jwt.verify(token,CONFIG.SECRET_KEY,function(error,decoded){
                if(error){
                  res.status(500).json({message:error.message})
                }else{
                  console.log(decoded)
                  next()
                }
              }) 
        }else{
            //La petición es válida, pero si no tiene header, no va a acceder
            res.status(403).send({message:"No tiene los permisos suficientes para acceder"})
            console.log(res.json)
        }
    }else{
        next()
    }
  };

