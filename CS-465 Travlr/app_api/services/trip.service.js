const mongoose = require('mongoose');
const Trip = mongoose.model('trips');

class TripService {
    /**
     * ENHANCEMENT: Algorithms & Data Structures
     * Uses a skip/limit algorithm to optimize data retrieval to O(k).
     */
    async listTrips(limit, skip, sortBy, order) {
        return await Trip
            .find({})
            .sort({ [sortBy]: order })
            .limit(limit)
            .skip(skip)
            .exec();
    }

    // SOFTWARE DESIGN: Service Layer Methods (Encapsulated)
    async findTrip(tripCode) {
        return await Trip.findOne({ 'code': tripCode }).exec();
    }

    async addTrip(data) {
        return await Trip.create(data);
    }

    async updateTrip(tripCode, data) {
        return await Trip.findOneAndUpdate({ 'code': tripCode }, data, { new: true }).exec();
    }

    async deleteTrip(tripCode) {
        return await Trip.findOneAndDelete({ 'code': tripCode }).exec();
    }
}

module.exports = new TripService(); // Exporting the class instance