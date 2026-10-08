import { useEffect, useState } from 'react';
import FlightForm from '../components/FlightForm';
import { adminApi, flightsApi, bookingsApi } from '../services/api';
import AdminDashboard from '../components/AdminDashboard';
import Pagination from '../components/Pagination';

export default function AdminPage() {
  const [flights, setFlights] = useState([]);
  const [mode, setMode] = useState('list');
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [passengers, setPassengers] = useState([]);
  const [passengerFlight, setPassengerFlight] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [dashboard, setDashboard] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState(''); 

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [flightsLoading, setFlightsLoading] = useState(false);

const FLIGHTS_PER_PAGE = 10;

  async function loadFlights(currentPage = page) {
    try {
      setFlightsLoading(true);
      setError('');

      const result = await flightsApi.getAll(
        currentPage,
        FLIGHTS_PER_PAGE
      );

      setFlights(result.data);
      setTotalPages(result.pagination.totalPages);
      setTotalItems(result.pagination.totalItems);

      // Handle a page becoming invalid after deletion
      if (
        result.pagination.totalPages > 0 &&
        currentPage > result.pagination.totalPages
      ) {
        setPage(result.pagination.totalPages);
      } else if (
        result.pagination.totalPages === 0 &&
        currentPage !== 1
      ) {
        setPage(1);
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setFlightsLoading(false);
    }
  }

  useEffect(() => {
    loadFlights(page);
  }, [page]);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function createFlight(payload) {
    setError('');
    await flightsApi.create(payload);
    setMessage('Flight created successfully.');
    setMode('list');
    await loadFlights();
  }

  async function updateFlight(payload) {
    setError('');
    await flightsApi.update(selectedFlight.flight_id, payload);
    setMessage('Flight updated successfully.');
    setSelectedFlight(null);
    setMode('list');
    await loadFlights();
  }

  async function removeFlight(flight) {
    if (!window.confirm(`Delete flight #${flight.flight_id}?`)) return;
    try {
      await flightsApi.remove(flight.flight_id);
      setMessage('Flight deleted.');
      await loadFlights();
      await loadDashboard(); // the dashboard is automatically refreshed - no need to refresh the whole page
    } catch (err) {
      setError(err.message);
    }
  }

  async function viewPassengers(flight) {
    try {
      setPassengers(await bookingsApi.passengers(flight.flight_id));
      setPassengerFlight(flight);
      setMode('passengers');
    } catch (err) {
      setError(err.message);
    }
  }

  async function loadDashboard() {
  try {
    setDashboardLoading(true);
    setDashboardError('');

    const data = await adminApi.dashboard();

    setDashboard(data);
  } catch (error) {
    setDashboardError(error.message);
  } finally {
    setDashboardLoading(false);
  }
}

  return (
    <main className="section page-section admin-page">

      <h1>Admin Dashboard</h1>

      <AdminDashboard
        dashboard={dashboard}
        loading={dashboardLoading}
        error={dashboardError}
      />

      <div className="page-heading-row">
        <h1>Flight management</h1>
        {mode === 'list' && <button className="button" onClick={() => { setMode('create'); setMessage(''); }}>+ Add flight</button>}
      </div>

      {message && <p className="form-success notice">{message}</p>}
      {error && <p className="form-error notice">{error}</p>}

      {mode === 'create' && (
        <section className="admin-panel">
          <div className="panel-heading"><h2>Create flight</h2></div>
          <FlightForm onSubmit={createFlight} onCancel={() => setMode('list')} submitLabel="Create flight" />
        </section>
      )}

      {mode === 'edit' && selectedFlight && (
        <section className="admin-panel">
          <div className="panel-heading"><h2>Edit flight #{selectedFlight.flight_id}</h2></div>
          <FlightForm initialValue={selectedFlight} onSubmit={updateFlight} onCancel={() => { setSelectedFlight(null); setMode('list'); }} submitLabel="Update flight" />
        </section>
      )}

      {mode === 'passengers' && passengerFlight && (
        <section className="admin-panel">
          <div className="panel-heading">
            <div><h2>Passengers · Flight #{passengerFlight.flight_id}</h2><p>{passengerFlight.departure_airport} → {passengerFlight.arrival_airport}</p></div>
            <button className="button button-secondary" onClick={() => setMode('list')}>Back</button>
          </div>
          {passengers.length === 0 ? <div className="page-state">No confirmed passengers.</div> : (
            <div className="table-wrap"><table><thead><tr><th>Seat</th><th>Name</th><th>Email</th><th>Booking</th></tr></thead><tbody>
              {passengers.map((p) => <tr key={p.booking_id}><td>{p.seat_number}</td><td>{p.firstname} {p.lastname}</td><td>{p.email}</td><td>#{p.booking_id}</td></tr>)}
            </tbody></table></div>
          )}
        </section>
      )}

      {mode === 'list' && (
        <section className="admin-panel">

          {flightsLoading && (
            <div className="page-state">
              Loading flights...
            </div>
          )}

          {!flightsLoading && !error && flights.length === 0 && (
            <div className="page-state">
              No flights available.
            </div>
          )}

          {!flightsLoading && flights.length > 0 && (
            <div className="table-wrap">
              <table>
                <thead><tr><th>ID</th><th>Airline</th><th>Route</th><th>Departure</th><th>Price</th><th>Seats</th><th>Actions</th></tr></thead>
                <tbody>
                  {flights.map((flight) => (
                    <tr key={flight.flight_id}>
                      <td>#{flight.flight_id}</td>
                      <td>{flight.airline}</td>
                      <td>{flight.departure_airport} → {flight.arrival_airport}</td>
                      <td>{new Date(flight.departure_date).toLocaleString()}</td>
                      <td>${Number(flight.price).toFixed(2)}</td>
                      <td>{flight.available_seats}</td>
                      <td className="action-cell">
                        <button className="text-action" onClick={() => { setSelectedFlight(flight); setMode('edit'); }}>Edit</button>
                        <button className="text-action" onClick={() => viewPassengers(flight)}>Passengers</button>
                        <button className="text-action danger-text" onClick={() => removeFlight(flight)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!flightsLoading && !error && flights.length > 0 && (
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
          
        </section>
      )}
    </main>
  );
}
