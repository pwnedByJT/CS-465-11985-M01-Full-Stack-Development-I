const mongoose = require('mongoose');
const Model = mongoose.model('trips');

// GET: /trips - lists all the trips
const tripsList = async (req, res) => {
    const q = await Model
        .find({}) // No filter, find all records
        .exec();

    if (!q) {
        return res
            .status(404)
            .json({"message": "Trip not found"});
    } else {
        return res
            .status(200)
            .json(q);
    }
};

// GET: /trips/:tripCode - lists a single trip
const tripsFindByCode = async (req, res) => {
    const q = await Model
        .find({ 'code': req.params.tripCode }) // Return single record
        .exec();

    if (!q) {
        return res
            .status(404)
            .json({"message": "Trip not found"});
    } else {
        return res
            .status(200)
            .json(q);
    }
};

module.exports = {
    tripsList,
    tripsFindByCode
};