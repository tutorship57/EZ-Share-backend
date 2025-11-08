const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const createTrip = async(req,res) =>{
    console.log(req.body);
    const {tripName,
        description,
        date} = req.body
    
    const userID = req.user.id
    try {
        const MealTrip = await prisma.trip.create({
            data:{
                tripName:tripName,
                Description:description,
                Date:new Date(date),
                user_id:userID
            }
        })
        return res.status(200).json({MealTrip})
    
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"something Went wrong !!"})
    }
   

}
const getTripByUserID = async(req,res) =>{
    
    const userID = req.user.id
    try {
        const trips = await prisma.trip.findMany({
            where:{user_id:userID},
            include:{
                _count:true
            },
        })
               
        return res.status(200).json({trips})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"something Went wrong !!"})
    }
}

const deleteTrip = async(req,res) =>{
    const {tripId} = req.params;
    console.log(req.user.id);
    try {
        const trip = await prisma.trip.delete({
            where:{trip_id:tripId,user_id:req.user.id},
        })
        return res.status(200).json({trip})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"something Went wrong !!"})
    }
}




module.exports = {
    createTrip,
    getTripByUserID,
    deleteTrip
}