const moment = require('moment');
const request = require('supertest');
const mongoose = require("mongoose");
const { User } = require("../../models/user");
const { Movie } = require("../../models/movie");
const { Rental } = require("../../models/rental");
let server, token;

describe('/api/returns', () => {
  let customerId, movieId, genreId, rental, movie;

  const exec = () => {
    return request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId });
  };

  beforeEach(async () => {
    server = require('../../index');
    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    genreId = mongoose.Types.ObjectId();
    token = new User().generateAuthToken();

    movie = new Movie({
      _id: movieId,
      title: 'Star Wars',
      genre: {
        _id: genreId,
        name: 'Sci-Fi'
      },
      numberInStock: 3,
      dailyRentalRate: 3
    });
    movie.save();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: 'Cust Name',
        phone: '123133123'
      },
      movie
    });

    await rental.save();
  });

  afterEach(async () => {
    await server.close() ;
    await Rental.deleteMany({});
    await Movie.deleteMany({});
  });

  describe('POST /', () => {
    it('should work', async () => {
      const res = await Rental.findOne({ _id: rental._id });
      expect(res).not.toBeNull();
    });

    it('should return 401 if client is not logged in', async () => {
      token = '';
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it('should return 400 if customerId is not provided', async () => {
      customerId = '';
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should return 400 if movieId is not provided', async () => {
      movieId = '';
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should return 404 if not rental fount for this customer/movie', async () => {
      customerId = mongoose.Types.ObjectId();
      movieId = mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it('should return 400 if rental already processed', async () => {
      rental.dateTo = new Date();
      await rental.save();
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should return 200 if valid request', async () => {
      const res = await exec();
      expect(res.status).toBe(200);
    });

    it('should set the return date', async () => {
      const res = await exec();
      const rentalCheck = await Rental.findOne({ _id: rental._id });
      const diff = new Date - rentalCheck.dateTo;
      //expect(res.body).toHaveProperty('dateTo');
      expect(rentalCheck.dateTo).toBeDefined();
      expect(diff).toBeLessThan(10 * 1000);
    });

    it('should calculate the rental fee (numberOfDays * movie.dailyRentalFee)', async () => {
      rental.dateFrom = moment().subtract(6, 'days').toDate();
      rental.save();

      const res = await exec();
      const rentalCheck = await Rental.findOne({ _id: rental._id });
      expect(rentalCheck.rentalFee).toBeGreaterThan(10);

    });

    it('should increase the stock of the movie', async () => {
      const res = await exec();
      const movieCheck = await Movie.findOne({ _id: movie._id });
      expect(movieCheck.numberInStock).toBeGreaterThan(movie.numberInStock);
    });

    it('should return the rental in the body', async () => {
      const res = await exec();
      const rentalCheck = await Rental.findOne({ _id: rental._id });
      const expectedProperties = ['dateTo', 'dateFrom', 'rentalFee', 'customer', 'movie'];
      expect(Object.keys(res.body)).toEqual(expect.arrayContaining(expectedProperties));
    });
  });

});