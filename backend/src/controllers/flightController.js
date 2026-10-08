const flightService = require('../services/flightService');

async function getAll(req, res, next) {
  try {
    const page = Math.max(
      parseInt(req.query.page, 10) || 1,
      1
    );

    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || 6, 1),
      100
    );

    const search = req.query.search?.trim() || '';

    const result = await flightService.getAll({
      page,
      limit,
      search
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    res.json(await flightService.getById(req.params.flightId));
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    res.status(201).json(await flightService.create(req.body));
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    res.json(await flightService.update(req.params.flightId, req.body));
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    await flightService.remove(req.params.flightId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = { getAll, getById, create, update, remove };
