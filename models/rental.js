const Joi = require('joi');
const mongoose = require('mongoose');
const { movieSchema } = require('./movie');
const { customerSchema } = require('./customer');

const schema = mongoose.Schema({
    customer: {
        type: customerSchema,
        required: true,
    },
    movie: {
        type: movieSchema,
        required: true,
    },
    dateFrom: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateTo: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
});

const Rental = mongoose.model('Rental',  schema);

function validateModel(rental) {
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required(),
    };

    return Joi.validate(rental, schema);
}

exports.Rental = Rental;
exports.rentalSchema = schema;
exports.validateModel = validateModel;