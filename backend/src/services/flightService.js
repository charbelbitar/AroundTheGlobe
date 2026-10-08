const flightRepository = require('../repositories/flightRepository');

function validateFlight(flight) {
  const required = [
    'airline', 'departure_airport', 'arrival_airport',
    'departure_date', 'arrival_date', 'price', 'available_seats'
  ];

  for (const field of required) {
    if (flight[field] === undefined || flight[field] === null || flight[field] === '') {
      const error = new Error(`${field} is required`);
      error.statusCode = 400;
      throw error;
    }
  }

  if (Number(flight.price) < 0 || Number(flight.available_seats) < 0) {
    const error = new Error('price and available_seats cannot be negative');
    error.statusCode = 400;
    throw error;
  }

  if (new Date(flight.arrival_date) <= new Date(flight.departure_date)) {
    const error = new Error('arrival_date must be after departure_date');
    error.statusCode = 400;
    throw error;
  }
}

async function getAll({ page = 1, limit = 6, search = '' }) {
  const offset = (page - 1) * limit;

  const [flights, totalItems] = await Promise.all([
    flightRepository.findAll({
      limit,
      offset,
      search
    }),

    flightRepository.countAll(search)
  ]);

  const totalPages = Math.ceil(totalItems / limit);

  return {
    data: flights,

    pagination: {
      page,
      limit,
      totalItems,
      totalPages
    }
  };
}

async function getById(flightId) {
  const flight = await flightRepository.findById(flightId);
  if (!flight) {
    const error = new Error('Flight not found');
    error.statusCode = 404;
    throw error;
  }
  return flight;
}

async function create(flight) {
  validateFlight(flight);
  const flightId = await flightRepository.create(flight);
  return getById(flightId);
}

async function update(flightId, flight) {
  validateFlight(flight);
  const affectedRows = await flightRepository.update(flightId, flight);
  if (!affectedRows) {
    const error = new Error('Flight not found');
    error.statusCode = 404;
    throw error;
  }
  return getById(flightId);
}

async function remove(flightId) {
  const affectedRows = await flightRepository.remove(flightId);
  if (!affectedRows) {
    const error = new Error('Flight not found');
    error.statusCode = 404;
    throw error;
  }
}

module.exports = { getAll, getById, create, update, remove };
