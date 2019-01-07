const moment = require('moment');
const mongoose = require("mongoose");
const express = require("express");
const auth = require("../middleware/auth");
const { Rental } = require("../models/rental");
const { Movie } = require("../models/movie");
const router = express.Router();

mongoose.set("useFindAndModify", false);

router.post("/", auth, async (req, res) => {
  if (!req.body.customerId || !req.body.movieId)
    return res.status(400).send("Invalid data provided");

  const rental = await Rental.findOne({
    'customer._id': req.body.customerId,
    'movie._id': req.body.movieId
  });

  if (!rental) return res.status(404).send("No rental found");
  if(rental.dateTo) res.status(400).send("This rental is already processed");
  // Set the rental DateTo to Now
  const now = moment();
  rental.dateTo = now.toDate();
  rental.rentalFee = now.diff(rental.dateFrom, 'days') * rental.movie.dailyRentalRate;
  await rental.save();

  await Movie.updateOne({ _id: rental.movie._id }, {
    $inc: { numberInStock: 1 }
  });

  return res.send(rental);
});

module.exports = router;
