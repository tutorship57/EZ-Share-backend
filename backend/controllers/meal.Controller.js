const { get } = require('http');
const { PrismaClient } = require('../generated/prisma')
const prisma = new PrismaClient();

const createMeal = async(req,res)=>{
    const {meal_name,meal_at,meal_host} = req.body
    const tripId = req.params.tripId
    console.log(tripId)
    try {
        const newMeal = await prisma.meal.create({
            data:{meal_name,meal_at,meal_host,trip_id:tripId,meal_status:"pending"}
        })
        res.status(200).json({ newMeal, message: "Trip guests added successfully" });
    } catch (error) {
        console.error("Error fetching trip guests:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
const getAllMeals = async(req,res)=>{
    const tripId = req.params.tripId
    try {
        const meals = await prisma.meal.findMany({
            where:{trip_id:tripId},
            include:{
                _count:true
            }
        })
        res.status(200).json({meals})
    } catch (error) {
        console.error("Error fetching trip guests:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {
    createMeal,
    getAllMeals
}