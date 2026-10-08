import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FlightCard from '../components/FlightCard';
import { bookingsApi, flightsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Pagination from '../components/Pagination';

export default function FlightsPage() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [seatNumber, setSeatNumber] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const FLIGHTS_PER_PAGE = 6;
  const [bookingLoading, setBookingLoading] = useState(false);

  async function loadFlights(currentPage = 1, search = '') {
    try {
      setLoading(true);
      setError('');

      console.log('Starting flight request...');

      const result = await flightsApi.getAll(currentPage, FLIGHTS_PER_PAGE, search);

      console.log('Flights received:', result);

      setFlights(result.data);
      setTotalPages(result.pagination.totalPages);
      setTotalItems(result.pagination.totalItems);

    } catch (err) {
      console.error('Flight loading error:', err);
      setError(err.message);
    } finally {
      console.log('Flight request finished');
      setLoading(false);
    }
  }

  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 400);

    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    loadFlights(page, debouncedQuery);
  }, [page, debouncedQuery]);

  function openBooking(flight) {
    if (!user) {
      navigate('/login', { state: { from: '/flights' } });
      return;
    }
    if (user.role === 'admin') return;
    setSelectedFlight(flight);
    setSeatNumber('');
    setBookingError('');
    setBookingSuccess('');
  }

  async function book(event) {
    event.preventDefault();

    if (bookingLoading) return;

    setBookingError('');
    setBookingSuccess('');
    setBookingLoading(true);

    try {
      await bookingsApi.create({
        flightId: selectedFlight.flight_id,
        seatNumber: seatNumber
      });

      setBookingSuccess(
        `Seat ${seatNumber.toUpperCase()} booked successfully.`
      );

      await loadFlights(page, query);

      setTimeout(() => {
        setSelectedFlight(null);
      }, 800);

    } catch (err) {
      setBookingError(err.message);
    } finally {
      setBookingLoading(false);
    }
  }

  return (
    <main className="section page-section">
      <div className="page-heading-row">
        <div><span className="eyebrow dark">Live availability</span><h1>Find your next flight</h1></div>
        <input className="search-input" placeholder="Search airline or airport…" value={query} onChange={(e) => {setQuery(e.target.value); setPage(1);}} />
      </div>

      {loading && <div className="page-state">Loading flights…</div>}
      {error && <div className="page-state error-state">{error}</div>}
      {!loading && !error && flights.length === 0 && (
        <div className="page-state">
          No flights match your search.
        </div>
      )}

      {!loading && !error && (
        <div className="flight-grid">
          {flights.map((flight) => (
            <FlightCard
              key={flight.flight_id}
              flight={flight}
              onBook={user?.role === 'admin' ? null : openBooking}
            />
          ))}
        </div>
      )}

      {!loading && !error && flights.length > 0 && (
        <>
          <p className="pagination-info">
            Showing {(page - 1) * FLIGHTS_PER_PAGE + 1}–
            {Math.min(page * FLIGHTS_PER_PAGE, totalItems)} of {totalItems} flights
          </p>

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}

      {selectedFlight && (
        <div className="modal-backdrop" onMouseDown={() => setSelectedFlight(null)}>
          <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedFlight(null)} aria-label="Close">×</button>
            <span className="eyebrow dark">Complete your booking</span>
            <h2>{selectedFlight.departure_airport} → {selectedFlight.arrival_airport}</h2>
            <p>{selectedFlight.airline} · ${Number(selectedFlight.price).toFixed(2)}</p>
            <form className="stack-form" onSubmit={book}>
              <label>Seat number<input placeholder="e.g. 12A" maxLength="10" value={seatNumber} onChange={(e) => setSeatNumber(e.target.value)} required /></label>
              {bookingError && <p className="form-error">{bookingError}</p>}
              {bookingSuccess && <p className="form-success">{bookingSuccess}</p>}
              <button
                className="button full-width"
                disabled={bookingLoading}
              >
                {bookingLoading ? 'Booking…' : 'Confirm booking'}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
