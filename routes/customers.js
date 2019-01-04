const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { Customer, validateModel } = require('../models/customer');

mongoose.set('useFindAndModify', false);

router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
});

router.post('/', async (req, res) => {
    const { error } = validateModel(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let customer = new Customer({
        name: req.body.name,
        phone: req.body.phone
    });
    customer = await customer.save();

    res.send(customer);
});

router.put('/:id', async (req, res) => {
    const { error } = validateModel(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findOneAndUpdate({ _id: req.params.id }, {
        name: req.body.name,
        isGold: req.body.isGold || false,
        phone: req.body.phone
    }, {
        upsert: true,
        new: true
    });

    if (!customer) return res.status(404).send('The customer with the given ID was not found.');

    res.send(customer);
});

router.delete('/:id', async (req, res) => {
    const customer = await Customer.findOneAndDelete(req.params.id);

    if (!customer) return res.status(404).send('The customer with the given ID was not found.');

    res.send(customer);
});

router.get('/:id', async (req, res) => {
    const customer = await Customer.findOne(req.params.id);

    if (!customer) return res.status(404).send('The customer with the given ID was not found.');

    res.send(customer);
});

module.exports = router;
