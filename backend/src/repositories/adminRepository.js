const pool = require('../config/database');

async function getTotalUsers() {
  const [rows] = await pool.execute(
    `SELECT COUNT(*) AS total FROM users`
  );

  return rows[0].total;
}

async function getTotalBookings() {
  const [rows] = await pool.execute(
    `
    SELECT COUNT(*) AS total
    FROM bookings
    WHERE booking_status = 'confirmed'
    `
  );

  return rows[0].total;
}

async function getTotalRevenue() {
  const [rows] = await pool.execute(
    `
    SELECT COALESCE(SUM(f.price), 0) AS total
    FROM bookings b
    JOIN flights f ON f.flight_id = b.flight_id
    WHERE b.booking_status = 'confirmed'
    `
  );

  return rows[0].total;
}

async function getActiveFlights() {
  const [rows] = await pool.execute(
    `
    SELECT COUNT(*) AS total
    FROM flights
    WHERE departure_date > NOW()
    `
  );

  return rows[0].total;
}

async function getTopRoutes() {
  const [rows] = await pool.execute(
    `
    SELECT
      f.departure_airport,
      f.arrival_airport,
      COUNT(*) AS bookings
    FROM bookings b
    JOIN flights f ON f.flight_id = b.flight_id
    WHERE b.booking_status = 'confirmed'
    GROUP BY
      f.departure_airport,
      f.arrival_airport
    ORDER BY bookings DESC
    LIMIT 5
    `
  );

  return rows;
}

async function getRecentBookings() {
  const [rows] = await pool.execute(
    `
    SELECT
      b.booking_id,
      b.seat_number,
      b.created_at,

      u.firstname,
      u.lastname,
      u.email,

      f.airline,
      f.departure_airport,
      f.arrival_airport

    FROM bookings b

    JOIN users u
      ON u.user_id = b.user_id

    JOIN flights f
      ON f.flight_id = b.flight_id

    WHERE b.booking_status = 'confirmed'

    ORDER BY b.created_at DESC

    LIMIT 5
    `
  );

  return rows;
}

async function getBookingsPerMonth() {
  const [rows] = await pool.execute(`
    SELECT
      DATE_FORMAT(created_at, '%Y-%m') AS month,
      COUNT(*) AS bookings
    FROM bookings
    WHERE booking_status = 'confirmed'
      AND created_at >= DATE_FORMAT(
        CURRENT_DATE - INTERVAL 11 MONTH,
        '%Y-%m-01'
      )
    GROUP BY DATE_FORMAT(created_at, '%Y-%m')
    ORDER BY month ASC
  `);

  return rows;
}

async function getAllUsers() {
  const [rows] = await pool.execute(`
    SELECT
      user_id,
      firstname,
      lastname,
      email,
      role,
      created_at
    FROM users
    ORDER BY created_at DESC
  `);

  return rows;
}

async function getAllActiveFlights() {
  const [rows] = await pool.execute(`
    SELECT
      flight_id,
      airline,
      departure_airport,
      arrival_airport,
      departure_date,
      arrival_date,
      price,
      available_seats
    FROM flights
    WHERE departure_date > NOW()
    ORDER BY departure_date ASC
  `);

  return rows;
}

async function getAllConfirmedBookings() {
  const [rows] = await pool.execute(`
    SELECT
      b.booking_id,
      b.seat_number,
      b.created_at,
      u.firstname,
      u.lastname,
      u.email,
      f.airline,
      f.departure_airport,
      f.arrival_airport,
      f.price
    FROM bookings b
    JOIN users u ON u.user_id = b.user_id
    JOIN flights f ON f.flight_id = b.flight_id
    WHERE b.booking_status = 'confirmed'
    ORDER BY b.created_at DESC
  `);

  return rows;
}

async function getRevenueByRoute() {
  const [rows] = await pool.execute(`
    SELECT
      f.departure_airport,
      f.arrival_airport,
      COUNT(*) AS total_bookings,
      COALESCE(SUM(f.price), 0) AS revenue
    FROM bookings b
    JOIN flights f ON f.flight_id = b.flight_id
    WHERE b.booking_status = 'confirmed'
    GROUP BY
      f.departure_airport,
      f.arrival_airport
    ORDER BY revenue DESC
  `);

  return rows;
}

module.exports = {
  getTotalUsers,
  getTotalBookings,
  getTotalRevenue,
  getActiveFlights,
  getTopRoutes,
  getRecentBookings,
  getBookingsPerMonth,
  getAllUsers,
  getAllActiveFlights,
  getAllConfirmedBookings,
  getRevenueByRoute
};