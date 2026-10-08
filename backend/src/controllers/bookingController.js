const bookingService = require('../services/bookingService');

async function create(req, res, next) {
  try {
    const result = await bookingService.create(req.session.user.user_id, req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

async function getMine(req, res, next) {
  try {
    res.json(await bookingService.getMine(req.session.user.user_id));
  } catch (error) {
    next(error);
  }
}

async function cancel(req, res, next) {
  try {
    await bookingService.cancel(req.params.bookingId, req.session.user.user_id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

async function getPassengers(req, res, next) {
  try {
    res.json(await bookingService.getPassengers(req.params.flightId));
  } catch (error) {
    next(error);
  }
}

module.exports = { create, getMine, cancel, getPassengers };
