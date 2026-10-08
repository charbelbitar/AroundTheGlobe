const bookingRepository = require('../repositories/bookingRepository');
const emailService = require('./emailService');
const userRepository = require('../repositories/userRepository');

async function create(userId, { flightId, seatNumber }) {
  console.log('User ID:', userId);
  console.log('flightId:', flightId);
  console.log('seatNumber:', seatNumber);

  const bookingId = await bookingRepository.createBooking(
    userId,
    flightId,
    seatNumber
  );

  const booking = await bookingRepository.findById(bookingId);

  const user = await userRepository.findPublicById(userId);

  try {
    await emailService.sendBookingConfirmationEmail(
      user.email,
      user.firstname,
      booking
    );
  } catch (error) {
    console.error(
      'Failed to send booking confirmation email:',
      error.message
    );
  }

  return booking;
}

async function getMine(userId) {
  return bookingRepository.findByUserId(userId);
}

async function cancel(bookingId, userId) {
  const booking = await bookingRepository.findById(bookingId);

  if (!booking) {
    const error = new Error('Booking not found');
    error.statusCode = 404;
    throw error;
  }

  await bookingRepository.cancelBooking(
    bookingId,
    userId
  );

  const user = await userRepository.findPublicById(userId);

  try {
    await emailService.sendBookingCancellationEmail(
      user.email,
      user.firstname,
      booking
    );
  } catch (error) {
    console.error(
      'Failed to send cancellation email:',
      error.message
    );
  }
}

async function getPassengers(flightId) {
  return bookingRepository.findPassengersByFlightId(flightId);
}

module.exports = {
  create,
  getMine,
  cancel,
  getPassengers
};