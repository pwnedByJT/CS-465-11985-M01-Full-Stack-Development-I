const mongoose = require('mongoose');
const Trip = mongoose.model('trips');

// GET all trips
const listTrips = async () => {
    return await Trip.find({}).exec();
};

// GET a single trip by code
const findTrip = async (tripCode) => {
    return await Trip.findOne({ 'code': tripCode }).exec();
};

// POST a new trip
const addTrip = async (data) => {
    return await Trip.create({
        code: data.code,
        name: data.name,
        length: data.length,
        start: data.start,
        resort: data.resort,
        perPerson: data.perPerson,
        image: data.image,
        description: data.description
    });
};

// PUT (update) an existing trip
const updateTrip = async (tripCode, data) => {
    return await Trip.findOneAndUpdate({ 'code': tripCode }, data, { new: true }).exec();
};

// DELETE a trip
const deleteTrip = async (tripCode) => {
    return await Trip.findOneAndDelete({ 'code': tripCode }).exec();
};

module.exports = {
    listTrips,
    findTrip,
    addTrip,
    updateTrip,
    deleteTrip
};