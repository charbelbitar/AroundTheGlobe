import { useEffect, useState } from 'react';
import { bookingsApi } from '../services/api';

function formatDate(value) {
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    try {
      setBookings(await bookingsApi.mine());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function cancelBooking(id) {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await bookingsApi.cancel(id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="section page-section narrow-page">
      <div className="page-heading-row"><div><span className="eyebrow dark">Your trips</span><h1>My bookings</h1></div></div>
      {loading && <div className="page-state">Loading bookings…</div>}
      {error && <div className="page-state error-state">{error}</div>}
      {!loading && bookings.length === 0 && <div className="page-state">You have no bookings yet.</div>}
      <div className="booking-list">
        {bookings.map((booking) => (
          <article className="booking-card" key={booking.booking_id}>
            <div>
              <span className={`status-badge ${booking.booking_status}`}>{booking.booking_status}</span>
              <h2>{booking.departure_airport} → {booking.arrival_airport}</h2>
              <p>{booking.airline} · Seat {booking.seat_number}</p>
            </div>
            <div className="booking-details">
              <span>Departure<strong>{formatDate(booking.departure_date)}</strong></span>
              <span>Price<strong>${Number(booking.price).toFixed(2)}</strong></span>
            </div>
            {booking.booking_status === 'confirmed' && (
              <button className="button button-danger" onClick={() => cancelBooking(booking.booking_id)}>Cancel booking</button>
            )}
          </article>
        ))}
      </div>
    </main>
  );
}
