const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { Rental, validatemodel: validateRental } = require('../models/rental');
const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');

mongoose.set('useFindAndModify', false);

router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('dateFrom');
    res.send(rentals);
});

router.post('/', async (req, res) => {
    const { error } = validateRental(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const movie = await Movie.findOne(req.body.movieId);
    if (!movie) return res.status(404).send('Invalid Movie.');

    if (movie.numberInStock === 0) return res.status(400).send('No Stock Available.');

    const customer = await Customer.findOne(req.body.customerId);
    if (!customer) return res.status(404).send('Invalid Customer.');

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name
        },
        movie: {
            _id: movie._id,
            title: movie.title
        },
        dateFrom: req.body.dateFrom,
        dateTo: req.body.dateTo,
        numberOfDays: req.body.numberOfDays
    });
    rental = await rental.save();

    res.send(rental);
});

router.put('/:id', async (req, res) => {
    const { error } = validateRental(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const rental = await Rental.findOneAndUpdate({ _id: req.params.id }, {
        dateFrom: req.body.dateFrom,
        dateTo: req.body.dateTo,
        numberOfDays: req.body.numberOfDays
    }, {
        upsert: true,
        new: true
    });

    if (!rental) return res.status(404).send('The movie with the given ID was not found.');

    res.send(rental);
});

router.delete('/:id', async (req, res) => {
    const rental = await Rental.findOneAndDelete(req.params.id);

    if (!rental) return res.status(404).send('The movie with the given ID was not found.');

    res.send(rental);
});

router.get('/:id', async (req, res) => {
    const rental = await Rental.findOne(req.params.id);

    if (!rental) return res.status(404).send('The movie with the given ID was not found.');

    res.send(rental);
});

module.exports = router;
