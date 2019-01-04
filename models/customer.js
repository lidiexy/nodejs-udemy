const Joi = require('joi');
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 60,
    },
    isGold: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 15,
        trim: true,
    }
});
const Customer = mongoose.model('Customer',  schema);

function validateModel(customer) {
    const schema = {
        name: Joi.string().min(3).required(),
        phone: Joi.string()
            .regex(/^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/, 'phone')
            .required(),
        isGold: Joi.boolean()
    };

    return Joi.validate(customer, schema);
}

exports.Customer = Customer;
exports.customerSchema = schema;
exports.validateModel = validateModel;
