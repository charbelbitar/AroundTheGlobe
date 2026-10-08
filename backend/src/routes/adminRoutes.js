const express = require('express');
const adminController = require('../controllers/adminController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get(
  '/dashboard',
  requireAuth,
  requireAdmin,
  adminController.getDashboard
); // GET /api/admin/dashboard

router.get(
  '/users',
  requireAuth,
  requireAdmin,
  adminController.getAllUsers
); // GET /api/admin/users

router.get(
  '/flights/active',
  requireAuth,
  requireAdmin,
  adminController.getAllActiveFlights
); // GET /api/admin/flights/active

router.get(
  '/bookings',
  requireAuth,
  requireAdmin,
  adminController.getAllConfirmedBookings
); // GET /api/admin/bookings

router.get(
  '/revenue',
  requireAuth,
  requireAdmin,
  adminController.getRevenueByRoute
); // GET /api/admin/revenue

module.exports = router;