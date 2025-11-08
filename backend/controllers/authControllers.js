const { PrismaClient } = require('../generated/prisma')
const prisma = new PrismaClient();
const crypto = require('crypto');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { use } = require('../routes/menuShare.Route');

const login = async (req, res)=>{
    const {email,password} = req.body ; 
    try {
        // check if user exists
        const userExists = await prisma.user.findUnique({
          where: { email },
        });
    
        if (!userExists) {
          return res.status(404).json({ message: "User not found" });
        }
        console.log(userExists);
        
        // check password (assuming it's hashed with bcrypt)
        const isPasswordValid = await bcrypt.compare(password, userExists.password);
        if (!isPasswordValid) {
          return res.status(401).json({ message: "Invalid credentials" });
        }
    
        const accessToken = jwt.sign({ id: userExists.user_id }, process.env.JWT_ACCESS_SECRET, { expiresIn: "15m" });
        const refreshToken = jwt.sign({ id: userExists.user_id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

     
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
        
        });
       
       
        console.log("this is cookies after sign",res.cookie)
        res.status(200).json({ 
          message:"Login Successfully !!",
          accessToken ,
          user: {
            id: userExists.id,
            email: userExists.email,
            name: userExists.username, 
          }
        });
        
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
      }
}


// email     String   @unique
// username  String?
// password  String   
// verify_status    String
// token     String 
// token_expired DateTime 
const register = async (req, res)=>{
    const {username,email,password} = req.body ; 

    const password_hash = await bcrypt.hash(password, 10);
    const verify_status = false;
    const Originaltoken =crypto.randomBytes(64).toString('hex');
    const token = crypto.createHash('sha256').update(Originaltoken).digest('hex');
    const token_expired = new Date(Date.now() + 60 * 60 * 1000);// 1 hour

    const userExists = await prisma.user.findUnique({
        where: {
            email
        }
    })
    console.log(userExists);
    
    if(userExists){
        return res.status(400).json({
            message: 'something went wrong'
        })
    }

    const user = await prisma.user.create({
        data: {
            username,
            email,
            password:password_hash,
            verify_status,
            token,
            token_expired
        }
    })
   
    
    return  res.json({message:"register successfully !"})
}

const tokenRecover = async(req,res)=>{
  // console.log("this is cookies", req.cookies)
  // console.log("this is cookies refresh", req.cookies.refreshToken)

  
  const token = req.cookies.refreshToken || req.body.refreshToken || req.headers['x-refresh-token'];

  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    const newAccessToken = jwt.sign({ id: user.id }, process.env.JWT_ACCESS_SECRET, { expiresIn: "15m" });
    // console.log(newAccessToken)
    res.json({ accessToken: newAccessToken });
  });
}

const logout = async (req,res)=>{
    const refreshToken = req.cookies?.refreshToken;

    if(!refreshToken){
        return res.status(400).json({
            message: 'something went wrong'
        })
    }

    jwt.verify(refreshToken,process.env.JWT_REFRESH_SECRET,(err,user)=>{
        if(err){
            return res.status(403).json({
                message: 'something went wrong'
            })
        }
    })

    res.clearCookie('refreshToken')
    return res.status(200).json({
        message: 'logout successfully'
    })
}


module.exports = {
    login,
    register,
    logout,
    tokenRecover
}