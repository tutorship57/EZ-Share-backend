const jwt = require("jsonwebtoken")

const authMiddleware = async (req,res,next)=>{
    
    const tokenHeader = req.header("Authorization").split(" ");
    const token = tokenHeader[1]

    if(!token){
        return res.status(401).json("Invalid Credential")
    }

    try{
    const decoded = jwt.verify(token,process.env.JWT_ACCESS_SECRET)

    req.user = decoded
    } catch(error){
        console.log(error)
        return res.status(403).json({ error: "Invalid or expired token" });
    }
    
    next()
}


module.exports = {
    authMiddleware
}