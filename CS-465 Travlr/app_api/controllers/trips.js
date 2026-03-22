const mongoose = require('mongoose');
const User = mongoose.model('users');
const tripService = require('../services/trip.service');

// Helper function to handle user authentication
const getUser = (req, res, callback) => {
    if (req.auth && req.auth.email) {
        User
            .findOne({ email : req.auth.email })
            .exec((err, user) => {
                if (!user) {
                    return res.status(404).json({"message": "User not found"});
                } else if (err) {
                    return res.status(404).json(err);
                }
                callback(req, res, user.name);
            });
    } else {
        return res.status(404).json({"message": "User not found"});
    }
};

// GET: /trips
const getAllTrips = async (req, res) => {
    try {
        const trips = await tripService.listTrips();
        if (!trips) {
            return res.status(404).json({ "message": "trips not found" });
        }
        return res.status(200).json(trips);
    } catch (err) {
        return res.status(500).json(err);
    }
};

// GET: /trips/:tripCode
const getTripByCode = async (req, res) => {
    try {
        const trip = await tripService.findTrip(req.params.tripCode);
        if (!trip) {
            return res.status(404).json({ "message": "trip not found" });
        }
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
            if (!trip) {
                return res.status(404).json({ "message": "trip not found" });
            }
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
            if (!trip) {
                return res.status(404).json({ "message": "trip not found" });
            }
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