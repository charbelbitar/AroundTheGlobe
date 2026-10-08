import BookingsChart from './BookingsChart';
import { useState } from 'react';
import AdminDetailsModal from './AdminDetailsModal';

export default function AdminDashboard({
  dashboard,
  loading,
  error,
}) {
  const [activeModal, setActiveModal] = useState(null);

  if (loading) {
    return (
      <section className="admin-dashboard">
        <p>Loading dashboard...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="admin-dashboard">
        <p className="form-error">{error}</p>
      </section>
    );
  }

  if (!dashboard) {
    return null;
  }

  const {
    stats,
    topRoutes,
    recentBookings,
    bookingsPerMonth
  } = dashboard;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
    }).format(Number(value));
  };

  const formatDate = (value) => {
    return new Date(value).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <section className="admin-dashboard">

      {/* STATISTIC CARDS */}

      <div className="dashboard-stats">

        <button
          type="button"
          className="stat-card stat-card-clickable"
          onClick={() => setActiveModal('users')}
        >
          <div className="stat-icon">
            <span className="material-symbols-outlined">groups</span>
          </div>
          <div className="stat-info">
            <span>Total Users</span>
            <h3>{stats.totalUsers}</h3>
          </div>
        </button>

        <button
          type="button"
          className="stat-card stat-card-clickable"
          onClick={() => setActiveModal('bookings')}
        >
          <div className="stat-icon">
            <span className="material-symbols-outlined">
              confirmation_number
            </span>
          </div>

          <div className="stat-info">
            <span>Confirmed Bookings</span>
            <h3>{stats.totalBookings}</h3>
          </div>
        </button>

        <button
          type="button"
          className="stat-card stat-card-clickable"
          onClick={() => setActiveModal('revenue')}
        >
          <div className="stat-icon">
            <span className="material-symbols-outlined">money_bag</span>
          </div>
          <div className="stat-info">
            <span>Total Revenue</span>
            <h3>{formatCurrency(stats.totalRevenue)}</h3>
          </div>
        </button>

        <button
          type="button"
          className="stat-card stat-card-clickable"
          onClick={() => setActiveModal('flights')}
        >
          <div className="stat-icon">
            <span className="material-symbols-outlined">flight</span>
          </div>
          <div className="stat-info">
            <span>Active Flights</span>
            <h3>{stats.activeFlights}</h3>
          </div>
        </button>

      </div>

      <BookingsChart data={bookingsPerMonth ?? []} />

      {/* TABLES */}

      <div className="dashboard-tables">

        {/* TOP ROUTES */}

        <div className="dashboard-panel">

          <h3>Most Booked Routes</h3>

          {topRoutes.length === 0 ? (
            <p className="dashboard-empty">
              No bookings available yet.
            </p>
          ) : (
            <div className="dashboard-table-wrapper">
              <table className="dashboard-table">

                <thead>
                  <tr>
                    <th>Route</th>
                    <th>Bookings</th>
                  </tr>
                </thead>

                <tbody>
                  {topRoutes.map((route, index) => (
                    <tr key={index}>
                      <td>
                        {route.departure_airport}
                        {' → '}
                        {route.arrival_airport}
                      </td>

                      <td>
                        {route.bookings}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}

        </div>

        {/* RECENT BOOKINGS */}

        <div className="dashboard-panel">

          <h3>Recent Bookings</h3>

          {recentBookings.length === 0 ? (
            <p className="dashboard-empty">
              No recent bookings.
            </p>
          ) : (
            <div className="dashboard-table-wrapper">
              <table className="dashboard-table">

                <thead>
                  <tr>
                    <th>Booking</th>
                    <th>Passenger</th>
                    <th>Route</th>
                    <th>Seat</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {recentBookings.map((booking) => (
                    <tr key={booking.booking_id}>

                      <td>
                        #{booking.booking_id}
                      </td>

                      <td>
                        {booking.firstname}
                        {' '}
                        {booking.lastname}
                      </td>

                      <td>
                        {booking.departure_airport}
                        {' → '}
                        {booking.arrival_airport}
                      </td>

                      <td>
                        {booking.seat_number}
                      </td>

                      <td>
                        {formatDate(booking.created_at)}
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}

        </div>

      </div>


      {activeModal && (
        <AdminDetailsModal
          type={activeModal}
          onClose={() => setActiveModal(null)}
        />
      )}

    </section>
  );
}