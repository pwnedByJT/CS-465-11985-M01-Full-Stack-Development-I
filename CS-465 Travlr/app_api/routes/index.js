const express = require('express');
const router = express.Router();
const {expressjwt: jwt} = require('express-jwt');
// const jwt = require('express-jwt');
const auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload',
    algorithms: ["HS256"],
  });

// SECURITY ENHANCEMENT: Import authorize middleware for role-based access control
const authorize = require('../middleware/authorize');

const authController = require('../controllers/authentication')
const tripsController = require('../controllers/trips');

router
    .route('/login')
    .post(authController.login);

router
    .route('/register')
    .post(authController.register);

router
    .route('/user')
    .get(tripsController.getUser);

router
    .route('/trips')
    .get(tripsController.getAllTrips)
    .post(auth, authorize, tripsController.tripsAddTrip);

router
    .route('/trip/:tripCode')
    .get(tripsController.getTripByCode)
    .put(auth, authorize, tripsController.tripsUpdateTrip)
    .delete(auth, authorize, tripsController.tripsDeleteTrip);

router.route("/trips/:tripCode").get(tripsController.tripsFindCode);

module.exports = router;