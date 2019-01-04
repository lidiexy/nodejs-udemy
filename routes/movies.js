const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { Movie, validateModel } = require("../models/movie");
const { Genre } = require("../models/genre");

mongoose.set("useFindAndModify", false);

router.get("/", async (req, res) => {
  const movies = await Movie.find().sort("title");
  res.send(movies);
});

router.post("/", async (req, res) => {
  const { error } = validateModel(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findOne(req.body.genreId);
  if (!genre) return res.status(404).send("Invalid Genre.");

  const movie = new Movie({
    name: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  });
  await movie.save();

  res.send(movie);
});

router.put("/:id", async (req, res) => {
  const { error } = validateModel(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const movie = await Movie.findOneAndUpdate(
    { _id: req.params.id },
    {
      title: req.body.title,
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate
    },
    {
      upsert: true,
      new: true
    }
  );

  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(movie);
});

router.delete("/:id", async (req, res) => {
  const movie = await Movie.findOneAndDelete(req.params.id);

  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(movie);
});

router.get("/:id", async (req, res) => {
  const movie = await Movie.findOne(req.params.id);

  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(movie);
});

module.exports = router;
