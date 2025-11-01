const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

const allTripInfo = async (req, res) => {
  const TripInfo = await prisma.tripGuest.findMany({
    where: {trip_id: 1},
    include: {
      guest_table: {select: { guest_name: true }},
      trip_table: { select: {tripName: true,tripDuration: true}},
    },
  });
  const memberCount = await prisma.tripGuest.count({
    where: {trip_id: 1}
  })

  res.json({TripInfo,memberCount});
};

const getAllTripGuests = async(req,res)=>{
    const {tripId} = req.params;
    const userId = req.user.id;

    try {
      const trip = await prisma.trip.findUnique({
        where: { trip_id: tripId },
      });
      if (!trip || trip.user_id !== userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const tripGuests = await prisma.tripGuest.findMany({
        where: { trip_id: tripId },
        select: {
          guest_id:true,
          guest_table:{select:{guest_name:true}},

        }
      });
      return res.status(200).json({ tripGuests });
    } catch (error) {
      console.error("Error fetching trip guests:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

}

const addTripGuests = async (req,res)=>{
    const {arrayGuestId,tripId} = req.body;
    const prepareData = arrayGuestId.map((guestId)=>{
      return {
        guest_id:guestId,
        trip_id:tripId,
        total_spend:0
      }
    })
    console.log(prepareData)
    try {
       const newTripGuests = await prisma.tripGuest.createMany({
        data:prepareData
       })
      res.status(200).json({ newTripGuests, message: "Trip guests added successfully" });

    } catch (error) {
      console.error("Error fetching trip guests:", error);
      res.status(500).json({ error: "Internal server error" });
    }
   
    res.json({prepareData})
}

module.exports = {
  allTripInfo,
  addTripGuests,
  getAllTripGuests
};
