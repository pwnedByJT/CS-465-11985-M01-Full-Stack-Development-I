const express = require('express'); // Express app
const router = express.Router();   // Router logic
const tripsController = require('../controllers/trips');
// This is where we import the controllers we will route
router
    .route('/trips')
    .get(tripsController.tripsList);
// GET Method routes tripList
router
    .route('/trips/:tripCode')
    .get(tripsController.tripsFindByCode); // GET Method routes tripsFindByCode - requires parameter

module.exports = router;