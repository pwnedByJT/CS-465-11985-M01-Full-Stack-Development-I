const mongoose = require('mongoose');
const User = mongoose.model('users');
const tripService = require('../services/trip.service');

// Helper for auth - kept original structure
const getUser = (req, res, callback) => {
    if (req.auth && req.auth.email) {
        User.findOne({ email : req.auth.email }).exec((err, user) => {
            if (!user) return res.status(404).json({"message": "User not found"});
            if (err) return res.status(404).json(err);
            callback(req, res, user.name);
        });
    } else {
        return res.status(404).json({"message": "User not found"});
    }
};

// GET: /trips
// ENHANCEMENT: Algorithmic pagination and sorting
const getAllTrips = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const sortBy = req.query.sortBy || 'start';
        const order = req.query.order === 'desc' ? -1 : 1;
        const skip = (page - 1) * limit;

        const trips = await tripService.listTrips(limit, skip, sortBy, order);
        
        if (!trips || trips.length === 0) {
            return res.status(404).json({ "message": "No trips found" });
        }
        return res.status(200).json(trips);
    } catch (err) {
        return res.status(500).json({ "message": "Internal Server Error", "error": err.message });
    }
};

// GET: /trips/:tripCode
const getTripByCode = async (req, res) => {
    try {
        const trip = await tripService.findTrip(req.params.tripCode);
        if (!trip) return res.status(404).json({ "message": "trip not found" });
        return res.status(200).json(trip);
    } catch (err) {
        return res.status(500).json(err);
    }
};

// POST: /trips
const tripsAddTrip = async (req, res) => {
    getUser(req, res, async (req, res) => {
        try {
            const trip = await tripService.addTrip(req.body);
            return res.status(201).json(trip);
        } catch (err) {
            return res.status(400).json(err);
        }
    });
};

// PUT: /trips/:tripCode
const tripsUpdateTrip = async (req, res) => {
    getUser(req, res, async (req, res) => {
        try {
            const trip = await tripService.updateTrip(req.params.tripCode, req.body);
            if (!trip) return res.status(404).json({ "message": "trip not found" });
            return res.status(200).json(trip);
        } catch (err) {
            return res.status(500).json(err);
        }
    });
};

// DELETE: /trips/:tripCode
const tripsDeleteTrip = async (req, res) => {
    getUser(req, res, async (req, res) => {
        try {
            const trip = await tripService.deleteTrip(req.params.tripCode);
            if (!trip) return res.status(404).json({ "message": "trip not found" });
            return res.status(204).send();
        } catch (err) {
            return res.status(500).json(err);
        }
    });
};

module.exports = {
    getAllTrips,
    getTripByCode,
    tripsAddTrip,
    tripsUpdateTrip,
    tripsDeleteTrip,
    getUser
};