const adminRepository = require('../repositories/adminRepository');

async function getDashboard() {
  const [
    totalUsers,
    totalBookings,
    totalRevenue,
    activeFlights,
    topRoutes,
    recentBookings,
    bookingsPerMonth
  ] = await Promise.all([
    adminRepository.getTotalUsers(),
    adminRepository.getTotalBookings(),
    adminRepository.getTotalRevenue(),
    adminRepository.getActiveFlights(),
    adminRepository.getTopRoutes(),
    adminRepository.getRecentBookings(),
    adminRepository.getBookingsPerMonth()
  ]);

  return {
    stats: {
      totalUsers,
      totalBookings,
      totalRevenue,
      activeFlights
    },
    topRoutes,
    recentBookings,
    bookingsPerMonth
  };
}

async function getAllUsers() {
  return adminRepository.getAllUsers();
}

async function getAllActiveFlights() {
  return adminRepository.getAllActiveFlights();
}

async function getAllConfirmedBookings() {
  return adminRepository.getAllConfirmedBookings();
}

async function getRevenueByRoute() {
  return adminRepository.getRevenueByRoute();
}

module.exports = {
  getDashboard,
  getAllUsers,
  getAllActiveFlights,
  getAllConfirmedBookings,
  getRevenueByRoute
};