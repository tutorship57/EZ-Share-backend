const { PrismaClient } = require('../generated/prisma')
const prisma = new PrismaClient();
const crypto = require('crypto');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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

        // res.cookie("refreshToken", refreshToken, {
        //   httpOnly: true,
        //   secure: true, // dev = false, prod = true // dev จะใช้ http / prod จะใช้ https ในการ secure เลย dev ให้เป็น false ไปก่อน 
        //   sameSite: "None",
        //   path:'/'
        // });
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,

        });
        res.cookie("refreshToken2", refreshToken, {
          httpOnly: true,
          secure: false,       // dev เท่านั้น
          sameSite: "None",    // cross-site
          maxAge: 24 * 60 * 60 * 1000
        });
        
        
       
        // res.cookie('username', 'JohnDoe', {
        //   maxAge: 1000 * 60 * 60 * 24 * 7, // Cookie expires in 7 days (milliseconds)
        //   httpOnly: true, // Prevents client-side JavaScript access
        //   secure: true, // Only send over HTTPS
        //   sameSite: 'Lax', // Controls when cookies are sent with cross-site requests
        //   path:'/'
        // });
       
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
        // generate JWT token
        // const token = jwt.sign(
        //   { id: userExists.user_id, email: userExists.email },
        //   process.env.JWT_SECRET, // put secret in .env file
        //   { expiresIn: "1h"
        //    } // token expiration
        // );
  
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


module.exports = {
    login,
    register,
    tokenRecover
}