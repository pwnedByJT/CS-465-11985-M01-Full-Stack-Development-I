const tripsModel = require('../models/travlr');

/* GET travel view */
const travel = async (req, res) => {
    const trips = await tripsModel.find({});
    res.render('travel', { title: 'Travlr Getaways', trips });
};

module.exports = {
    travel
};