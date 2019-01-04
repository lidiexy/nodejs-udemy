const Joi = require('joi');
const mongoose = require('mongoose');
const { genreSchema } = require('./genre');

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255,
    },
    genre: {
        type: genreSchema,
        required: true,
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
    }
});
const Movie = mongoose.model('Movie',  schema);

function validateModel(movie) {
    const schema = {
        title: Joi.string().min(3).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().required(),
        dailyRentalRate: Joi.number().required()
    };

    return Joi.validate(movie, schema);
}

exports.Movie = Movie;
exports.movieSchema = schema;
exports.validateModel = validateModel;
