const Mongoose = require('./db');
const Trip = require('./travlr');
const fs = require('fs');

// Read the trips.json file from the data directory
// Note: The path './data/trips.json' assumes you run this script from the project root
const trips = JSON.parse(fs.readFileSync('./data/trips.json', 'utf8'));

const seedDB = async () => {
  // Delete all existing documents in the Trip collection
  await Trip.deleteMany({});
  // Insert the new documents from the JSON file
  await Trip.insertMany(trips);
};

// Execute the seed function, then close the connection and exit
Mongoose.connection.on('connected', () => {
  seedDB().then(async () => {
    await Mongoose.connection.close();
    process.exit(0);
  });
});