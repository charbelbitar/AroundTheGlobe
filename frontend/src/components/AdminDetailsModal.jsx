import { useEffect, useState } from 'react';
import { adminApi } from '../services/api';

export default function AdminDetailsModal({ type, onClose }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!type) return;

    let cancelled = false;

    async function loadData() {
      setLoading(true);
      setError('');
      setData([]);

      try {
        let result = [];

        if (type === 'users') {
          result = await adminApi.users();
        } else if (type === 'flights') {
          result = await adminApi.activeFlights();
        } else if (type === 'bookings') {
          result = await adminApi.bookings();
        } else if (type === 'revenue') {
          result = await adminApi.revenue();
        }

        if (!cancelled) {
          setData(result);
        }
     }
      catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [type]);

  if (!type) return null;

  const title = {
    users: 'Registered Users',
    flights: 'Active Flights',
    bookings: 'Confirmed Bookings',
    revenue: 'Revenue Breakdown',
  }[type];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal admin-details-modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        <h2>{title}</h2>

        {loading && <p>Loading...</p>}

        {error && <p className="form-error">{error}</p>}

        {!loading && !error && data.length === 0 && (
          <p>No records found.</p>
        )}

        {type === 'revenue' && !loading && !error && data.length > 0 && (
          <div className="revenue-summary">
            <span>Total Revenue</span>

            <strong>
              €
              {data
                .reduce((total, item) => total + Number(item.revenue), 0)
                .toFixed(2)}
            </strong>

            <small>
              {data.reduce(
                (total, item) => total + Number(item.total_bookings),
                0
              )}{' '}
              confirmed bookings
            </small>
          </div>
        )}

        {!loading && !error && data.length > 0 && (
          <div className="table-wrap">
              <table>
                <thead>
                  {type === 'users' && (
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Registered</th>
                    </tr>
                  )}

                  {type === 'flights' && (
                    <tr>
                      <th>Airline</th>
                      <th>Route</th>
                      <th>Departure</th>
                      <th>Price</th>
                      <th>Seats</th>
                    </tr>
                  )}

                  {type === 'bookings' && (
                    <tr>
                      <th>Booking ID</th>
                      <th>Passenger</th>
                      <th>Email</th>
                      <th>Airline</th>
                      <th>Route</th>
                      <th>Seat</th>
                      <th>Price</th>
                      <th>Booked On</th>
                    </tr>
                  )}

                  {type === 'revenue' && (
                    <tr>
                      <th>Route</th>
                      <th>Confirmed Bookings</th>
                      <th>Revenue</th>
                    </tr>
                  )}
                </thead>

                <tbody>
                  {data.map((item) => {
                    if (type === 'users') {
                      return (
                        <tr key={item.user_id}>
                          <td>{item.user_id}</td>
                          <td>{item.firstname} {item.lastname}</td>
                          <td>{item.email}</td>
                          <td>{item.role}</td>
                          <td>
                            {new Date(item.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    }

                    if (type === 'flights') {
                      return (
                        <tr key={item.flight_id}>
                          <td>{item.airline}</td>
                          <td>
                            {item.departure_airport} → {item.arrival_airport}
                          </td>
                          <td>
                            {new Date(item.departure_date).toLocaleString()}
                          </td>
                          <td>€{Number(item.price).toFixed(2)}</td>
                          <td>{item.available_seats}</td>
                        </tr>
                      );
                    }

                    if (type === 'bookings') {
                      return (
                        <tr key={item.booking_id}>
                          <td>#{item.booking_id}</td>
                          <td>{item.firstname} {item.lastname}</td>
                          <td>{item.email}</td>
                          <td>{item.airline}</td>
                          <td>
                            {item.departure_airport} → {item.arrival_airport}
                          </td>
                          <td>{item.seat_number}</td>
                          <td>€{Number(item.price).toFixed(2)}</td>
                          <td>
                            {new Date(item.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    }

                    if (type === 'revenue') {
                      return (
                        <tr key={`${item.departure_airport}-${item.arrival_airport}`}>
                          <td>
                            {item.departure_airport} → {item.arrival_airport}
                          </td>

                          <td>{item.total_bookings}</td>

                          <td>
                            €{Number(item.revenue).toFixed(2)}
                          </td>
                        </tr>
                      );
                    }

                    return null;
                  })}
                </tbody>
              </table>
          </div>
        )}
      </div>
    </div>
  );
}