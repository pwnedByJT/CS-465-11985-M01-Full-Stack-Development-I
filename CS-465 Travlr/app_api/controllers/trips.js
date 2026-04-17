const mongoose = require('mongoose');
const User = mongoose.model('users');
const tripService = require('../services/trip.service');
const { 
    sanitizeString, 
    validatePaginationParams, 
    validateSortField, 
    sanitizeObjectData 
} = require('../utils/sanitization');

/**
 * SECURITY & SOFTWARE DESIGN: Authorization Helper
 * Verifies user exists via JWT payload. Modernized to use async/await.
 */
const getUser = async (req, res) => {
    if (!req.auth || !req.auth.email) {
        res.status(401).json({ "message": "Unauthorized: No email found in token" });
        return null;
    }
    try {
        const user = await User.findOne({ email: req.auth.email }).exec();
        if (!user) {
            res.status(404).json({ "message": "User not found" });
            return null;
        }
        return user;
    } catch (err) {
        res.status(500).json(err);
        return null;
    }
};

/**
 * SECURITY ENHANCEMENT: Role-Based Authorization Check
 * Verifies 'admin' role. Returns 403 Forbidden if unauthorized.
 */
const isAdmin = (req, res) => {
    if (!req.auth || req.auth.role !== 'admin') {
        res.status(403).json({
            "message": "Forbidden: Admin privileges required for this operation"
        });
        return false;
    }
    return true;
};

// ============================================================================
// GET: /trips
// ENHANCEMENT: Algorithmic pagination and sorting with sanitization
// ============================================================================
const getAllTrips = async (req, res) => {
    try {
        // SECURITY: Validate and sanitize pagination using your utility
        const { page, limit } = validatePaginationParams(
            req.query.page,
            req.query.limit
        );

        // ALGORITHM: Use whitelisted sort fields ('start', 'name', 'code')
        const sortBy = validateSortField(req.query.sortBy);
        const order = req.query.order === 'desc' ? -1 : 1;
        const skip = (page - 1) * limit;

        const result = await tripService.listTrips(limit, skip, sortBy, order);
        
        if (!result.trips || result.trips.length === 0) {
            return res.status(404).json({ 
                "message": "No trips found",
                "pagination": { "total": 0, "currentPage": page, "totalPages": 0 }
            });
        }

        return res.status(200).json({
            trips: result.trips,
            pagination: result.pagination
        });
    } catch (err) {
        return res.status(500).json({ "message": "Internal Server Error", "error": err.message });
    }
};

// ============================================================================
// GET: /trips/:tripCode
// ============================================================================
const getTripByCode = async (req, res) => {
    try {
        const tripCode = sanitizeString(req.params.tripCode);
        const trip = await tripService.findTrip(tripCode);
        if (!trip) return res.status(404).json({ "message": "trip not found" });
        return res.status(200).json(trip);
    } catch (err) {
        return res.status(500).json(err);
    }
};

// ============================================================================
// POST: /trips
// ============================================================================
const tripsAddTrip = async (req, res) => {
    if (!isAdmin(req, res)) return;
    const user = await getUser(req, res);
    if (!user) return;

    try {
        // SECURITY: Recursive object sanitization for the entire body
        const sanitizedData = sanitizeObjectData(req.body);
        const trip = await tripService.addTrip(sanitizedData);
        return res.status(201).json(trip);
    } catch (err) {
        return res.status(400).json(err);
    }
};

// ============================================================================
// PUT: /trips/:tripCode
// ============================================================================
const tripsUpdateTrip = async (req, res) => {
    if (!isAdmin(req, res)) return;
    const user = await getUser(req, res);
    if (!user) return;

    try {
        const tripCode = sanitizeString(req.params.tripCode);
        const sanitizedData = sanitizeObjectData(req.body);
        const trip = await tripService.updateTrip(tripCode, sanitizedData);
        if (!trip) return res.status(404).json({ "message": "trip not found" });
        return res.status(200).json(trip);
    } catch (err) {
        return res.status(500).json(err);
    }
};

// ============================================================================
// DELETE: /trips/:tripCode
// ============================================================================
const tripsDeleteTrip = async (req, res) => {
    if (!isAdmin(req, res)) return;
    const user = await getUser(req, res);
    if (!user) return;

    try {
        const tripCode = sanitizeString(req.params.tripCode);
        const trip = await tripService.deleteTrip(tripCode);
        if (!trip) return res.status(404).json({ "message": "trip not found" });
        return res.status(204).send();
    } catch (err) {
        return res.status(500).json(err);
    }
};

module.exports = {
    getAllTrips,
    getTripByCode,
    tripsAddTrip,
    tripsUpdateTrip,
    tripsDeleteTrip,
    getUser,
    isAdmin
};