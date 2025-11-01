const jwt = require("jsonwebtoken")

const authMiddleware = async (req,res,next)=>{
    
    const tokenHeader = req.header("Authorization").split(" ");
    const token = tokenHeader[1]
    if(token === "1234"){
        return next() // เอาไวยิง api เพื่อ bypass
    }
    if(!token){
        return res.status(401).json("Invalid Credential")
    }
    // if (!token.startsWith("Bearer ")) {
    //     return res.status(400).json({ error: "Invalid token format" });
    // }
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