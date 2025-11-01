const { PrismaClient } = require('../generated/prisma')
const prisma = new PrismaClient();


const createGuest = async(req,res) => {
    const {guestName} = req.body
    const userID = req.user.id
    try {
        const guest = await prisma.guest.create({
            data:{
                guest_name:guestName,
                user_id:userID
            }
        })
        res.status(200).json(guest)
    } catch (error) {
        console.log(error);
        res.status(400).json({error:error.message})
    }
}

const getAllGuest = async(req,res) => {
    const userID = req.user.id
    try {
        const guests = await prisma.guest.findMany({
            where:{user_id:userID}
        })
        res.status(200).json({guests})
    } catch (error) {
        console.log(error);
        res.status(400).json({error:error.message})
    }
}

module.exports = {
    createGuest,
    getAllGuest
}