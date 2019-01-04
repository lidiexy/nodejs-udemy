const Joi = require('joi');
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
});
const Genre = mongoose.model('Genre', schema);

function validateModel(genre) {
    const schema = {
        name: Joi.string().min(5).max(50).required()
    };

    return Joi.validate(genre, schema);
}

exports.Genre = Genre;
exports.genreSchema = schema;
exports.validateModel = validateModel;
