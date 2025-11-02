const {PrismaClient} = require('../generated/prisma');
const prisma = new PrismaClient();

const getUserProfile = async (req, res) => {
    const userId = req.user.id;

    try {
        const userProfile = await prisma.user.findUnique({
            where: { user_id: userId },
            select:{
                user_id:true,
                username:true,
                email:true,
            }
        })
        res.status(200).json({userProfile})
    } catch (error) {
        res.status(500).json({message: "Internal server error"})
    }
}


module.exports = {
    getUserProfile
}