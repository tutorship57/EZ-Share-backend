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
            where:{user_id:userID}
        })
        // const tripsWithCounts = await Promise.all(
        //     trips.map(async (element) => {
        //       const guestCount = await prisma.tripGuest.count({
        //         where: { trip_id: element.trip_id }
        //       });
        //       const menuCount = await prisma.menu.count({
        //         where: { trip_id: element.trip_id }
        //       });
      
        //       return {
        //         ...element,
        //         memberCount: guestCount,
        //         menuCount: menuCount
        //       };
        //     })
        //   );
      
        // trips.map(async (element)=>{
        //     const guestCount = await prisma.tripGuest.count({
        //         where:{trip_id:element.trip_id}
        //     })
        //     // const menuCount = await prisma.menu.count({
        //     //     where:{trip_id:element.trip_id}
        //     // })
        //     // element.memberCount = guestCount
        //     // element.menuCount = menuCount
        // })
        
        
        return res.status(200).json({trips})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"something Went wrong !!"})
    }
}





module.exports = {
    createTrip,
    getTripByUserID
}