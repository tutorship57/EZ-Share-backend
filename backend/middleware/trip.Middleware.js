// authMiddleware.js
const checkTripOwnership = async (req, res, next) => {
    const tripId = req.params.id;
    const userId = req.user.id; // สมมติ decoded จาก token
  
    // query database ดู owner ของ trip
    const trip = await Trip.findById(tripId);
  
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }
  
    if (trip.ownerId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }
  
    // attach trip ให้ request ไว้ใช้ต่อก็ได้
    req.trip = trip;
  
    next();
  };
  
  module.exports = checkTripOwnership;
  