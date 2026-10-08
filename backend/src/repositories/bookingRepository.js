const pool = require('../config/database');

async function createBooking(userId, flightId, seatNumber) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [flightRows] = await connection.execute(
      `SELECT flight_id, available_seats
       FROM flights
       WHERE flight_id = ?
       FOR UPDATE`,
      [flightId]
    );

    if (!flightRows.length) {
      const error = new Error('Flight not found');
      error.statusCode = 404;
      throw error;
    }

    if (flightRows[0].available_seats <= 0) {
      const error = new Error('No seats available');
      error.statusCode = 409;
      throw error;
    }

    const [seatRows] = await connection.execute(
      `SELECT booking_id
       FROM bookings
       WHERE flight_id = ? AND seat_number = ? AND booking_status = 'confirmed'
       FOR UPDATE`,
      [flightId, seatNumber]
    );

    if (seatRows.length) {
      const error = new Error('Seat is already booked');
      error.statusCode = 409;
      throw error;
    }

    const [bookingResult] = await connection.execute(
      `INSERT INTO bookings (user_id, flight_id, seat_number, booking_status)
       VALUES (?, ?, ?, 'confirmed')`,
      [userId, flightId, seatNumber]
    );

    await connection.execute(
      `UPDATE flights
       SET available_seats = available_seats - 1
       WHERE flight_id = ?`,
      [flightId]
    );

    await connection.commit();
    return bookingResult.insertId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function findByUserId(userId) {
  const [rows] = await pool.execute(
    `SELECT b.booking_id, b.seat_number, b.booking_status, b.created_at,
            f.flight_id, f.airline, f.departure_airport, f.arrival_airport,
            f.departure_date, f.arrival_date, f.price
     FROM bookings b
     JOIN flights f ON f.flight_id = b.flight_id
     WHERE b.user_id = ?
     ORDER BY f.departure_date ASC`,
    [userId]
  );
  return rows;
}

async function cancelBooking(bookingId, userId) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [rows] = await connection.execute(
      `SELECT booking_id, flight_id, booking_status
       FROM bookings
       WHERE booking_id = ? AND user_id = ?
       FOR UPDATE`,
      [bookingId, userId]
    );

    if (!rows.length) {
      const error = new Error('Booking not found');
      error.statusCode = 404;
      throw error;
    }

    if (rows[0].booking_status === 'cancelled') {
      const error = new Error('Booking is already cancelled');
      error.statusCode = 409;
      throw error;
    }

    await connection.execute(
      `UPDATE bookings SET booking_status = 'cancelled' WHERE booking_id = ?`,
      [bookingId]
    );

    await connection.execute(
      `UPDATE flights SET available_seats = available_seats + 1 WHERE flight_id = ?`,
      [rows[0].flight_id]
    );

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function findPassengersByFlightId(flightId) {
  const [rows] = await pool.execute(
    `SELECT b.booking_id, b.seat_number, b.booking_status,
            u.user_id, u.email, u.firstname, u.lastname
     FROM bookings b
     JOIN users u ON u.user_id = b.user_id
     WHERE b.flight_id = ? AND b.booking_status = 'confirmed'
     ORDER BY b.seat_number ASC`,
    [flightId]
  );
  return rows;
}

async function findById(bookingId) {
  const [rows] = await pool.execute(
    `
    SELECT
      b.booking_id,
      b.user_id,
      b.flight_id,
      b.seat_number,
      b.booking_status,
      b.created_at,

      f.airline,
      f.departure_airport,
      f.arrival_airport,
      f.departure_date,
      f.arrival_date,
      f.price

    FROM bookings b

    JOIN flights f
      ON f.flight_id = b.flight_id

    WHERE b.booking_id = ?

    LIMIT 1
    `,
    [bookingId]
  );

  return rows[0];
}

async function findConfirmedBookingByUserAndFlight(
  connection,
  userId,
  flightId
) {
  const [rows] = await connection.execute(
    `SELECT booking_id, seat_number
     FROM bookings
     WHERE user_id = ?
       AND flight_id = ?
       AND booking_status = 'confirmed'
     LIMIT 1`,
    [userId, flightId]
  );

  return rows[0] || null;
}

module.exports = { 
  createBooking, 
  findByUserId, 
  cancelBooking, 
  findPassengersByFlightId,
  findById,
  findConfirmedBookingByUserAndFlight
};
