const mongoose = require('mongoose');
const Trip = mongoose.model('trips');

class TripService {
    /**
     * ENHANCEMENT: Algorithms & Data Structures
     * Implements efficient server-side pagination with metadata.
     * 
     * Uses skip/limit algorithm to optimize data retrieval to O(k) where k = limit.
     * This prevents loading entire collections into memory and enables scalability
     * for large datasets.
     * 
     * @param {number} limit - Maximum trips per page
     * @param {number} skip - Number of trips to skip for pagination
     * @param {string} sortBy - Field to sort by
     * @param {number} order - Sort order (1 for ascending, -1 for descending)
     * @returns {Promise<Object>} Object containing trips array and pagination metadata
     */
    async listTrips(limit, skip, sortBy, order) {
        try {
            // Execute query with pagination
            const trips = await Trip
                .find({})
                .sort({ [sortBy]: order })
                .limit(limit)
                .skip(skip)
                .exec();

            // ENHANCEMENT: Pagination Metadata
            // Retrieve total count for pagination controls
            const totalCount = await Trip.countDocuments({});
            const currentPage = Math.floor(skip / limit) + 1;
            const totalPages = Math.ceil(totalCount / limit);

            // Return trips with metadata for frontend pagination
            return {
                trips: trips,
                pagination: {
                    total: totalCount,
                    currentPage: currentPage,
                    totalPages: totalPages,
                    hasNextPage: currentPage < totalPages,
                    hasPrevPage: currentPage > 1
                }
            };
        } catch (error) {
            throw new Error(`Failed to retrieve trips: ${error.message}`);
        }
    }

    // SOFTWARE DESIGN: Service Layer Methods (Encapsulated)
    /**
     * Finds a single trip by trip code.
     * 
     * @param {string} tripCode - Unique trip identifier
     * @returns {Promise<Object>} Trip document or null if not found
     */
    async findTrip(tripCode) {
        return await Trip.findOne({ 'code': tripCode }).exec();
    }

    /**
     * SECURITY ENHANCEMENT: Creates a new trip with sanitized data.
     * All input sanitization should be done before calling this method.
     * 
     * @param {Object} data - Sanitized trip data
     * @returns {Promise<Object>} Created trip document
     */
    async addTrip(data) {
        return await Trip.create(data);
    }

    /**
     * SECURITY ENHANCEMENT: Updates a trip with sanitized data.
     * All input sanitization should be done before calling this method.
     * 
     * @param {string} tripCode - Trip code to identify trip
     * @param {Object} data - Sanitized update data
     * @returns {Promise<Object>} Updated trip document or null if not found
     */
    async updateTrip(tripCode, data) {
        return await Trip.findOneAndUpdate({ 'code': tripCode }, data, { new: true }).exec();
    }

    /**
     * Deletes a trip by trip code.
     * Only accessible to users with admin role.
     * 
     * @param {string} tripCode - Trip code to identify trip
     * @returns {Promise<Object>} Deleted trip document or null if not found
     */
    async deleteTrip(tripCode) {
        return await Trip.findOneAndDelete({ 'code': tripCode }).exec();
    }
}

module.exports = new TripService(); // Exporting the class instance