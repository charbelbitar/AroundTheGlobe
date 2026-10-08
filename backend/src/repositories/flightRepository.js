const pool = require('../config/database');

async function findAll({ limit, offset, search }) {
  let whereClause = '';
  const params = [];

  if (search) {
    whereClause = `
      WHERE airline LIKE ?
         OR departure_airport LIKE ?
         OR arrival_airport LIKE ?
    `;

    const searchTerm = `%${search}%`;

    params.push(
      searchTerm,
      searchTerm,
      searchTerm
    );
  }

  const [rows] = await pool.query(
    `SELECT flight_id, airline, departure_airport, arrival_airport,
            departure_date, arrival_date, price, available_seats,
            created_at, updated_at
     FROM flights
     ${whereClause}
     ORDER BY departure_date ASC, flight_id ASC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return rows;
}

async function findById(flightId) {
  const [rows] = await pool.execute(
    `SELECT flight_id, airline, departure_airport, arrival_airport,
            departure_date, arrival_date, price, available_seats,
            created_at, updated_at
     FROM flights
     WHERE flight_id = ?`,
    [flightId]
  );
  return rows[0] || null;
}

async function create(flight) {
  const [result] = await pool.execute(
    `INSERT INTO flights
      (airline, departure_airport, arrival_airport, departure_date, arrival_date, price, available_seats)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      flight.airline,
      flight.departure_airport,
      flight.arrival_airport,
      flight.departure_date,
      flight.arrival_date,
      flight.price,
      flight.available_seats,
    ]
  );
  return result.insertId;
}

async function update(flightId, flight) {
  const [result] = await pool.execute(
    `UPDATE flights
     SET airline = ?, departure_airport = ?, arrival_airport = ?,
         departure_date = ?, arrival_date = ?, price = ?, available_seats = ?
     WHERE flight_id = ?`,
    [
      flight.airline,
      flight.departure_airport,
      flight.arrival_airport,
      flight.departure_date,
      flight.arrival_date,
      flight.price,
      flight.available_seats,
      flightId,
    ]
  );
  return result.affectedRows;
}

async function remove(flightId) {
  const [result] = await pool.execute('DELETE FROM flights WHERE flight_id = ?', [flightId]);
  return result.affectedRows;
}

async function countAll(search) {
  let whereClause = '';
  const params = [];

  if (search) {
    whereClause = `
      WHERE airline LIKE ?
         OR departure_airport LIKE ?
         OR arrival_airport LIKE ?
    `;

    const searchTerm = `%${search}%`;

    params.push(
      searchTerm,
      searchTerm,
      searchTerm
    );
  }

  const [rows] = await pool.execute(
    `SELECT COUNT(*) AS total
     FROM flights
     ${whereClause}`,
    params
  );

  return rows[0].total;
}

module.exports = { findAll, findById, create, update, remove, countAll };
