const adminService = require('../services/adminService');

async function getDashboard(req, res, next) {
  try {
    const dashboard = await adminService.getDashboard();
    res.json(dashboard);
  } catch (error) {
    next(error);
  }
}

async function getAllUsers(req, res, next) {
  try {
    const users = await adminService.getAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
}

async function getAllActiveFlights(req, res, next) {
  try {
    const flights = await adminService.getAllActiveFlights();
    res.json(flights);
  } catch (error) {
    next(error);
  }
}

async function getAllConfirmedBookings(req, res, next) {
  try {
    const bookings = await adminService.getAllConfirmedBookings();
    res.json(bookings);
  } catch (error) {
    next(error);
  }
}

async function getRevenueByRoute(req, res, next) {
  try {
    const revenue = await adminService.getRevenueByRoute();
    res.json(revenue);
  } catch (error) {
    next(error);
  }
}


module.exports = {
  getDashboard,
  getAllUsers,
  getAllActiveFlights,
  getAllConfirmedBookings,
  getRevenueByRoute
};