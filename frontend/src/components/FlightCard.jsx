function formatDate(value) {
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export default function FlightCard({ flight, onBook, actionLabel = 'Book flight' }) {
  return (
    <article className="flight-card">
      <div className="flight-card-topline">
        <span className="airline-pill">{flight.airline}</span>
        <span className={`seat-pill ${flight.available_seats === 0 ? 'sold-out' : ''}`}>
          {flight.available_seats} seats left
        </span>
      </div>

      <div className="route">
        <div>
          <span className="route-label">From</span>
          <strong>{flight.departure_airport}</strong>
          <small>{formatDate(flight.departure_date)}</small>
        </div>
        <span className="route-arrow" aria-hidden="true">→</span>
        <div>
          <span className="route-label">To</span>
          <strong>{flight.arrival_airport}</strong>
          <small>{formatDate(flight.arrival_date)}</small>
        </div>
      </div>

      <div className="flight-card-footer">
        <div className="price"><span>From</span><strong>${Number(flight.price).toFixed(2)}</strong></div>
        {onBook && (
          <button
            className="button"
            disabled={flight.available_seats <= 0}
            onClick={() => onBook(flight)}
          >
            {flight.available_seats <= 0 ? 'Sold out' : actionLabel}
          </button>
        )}
      </div>
    </article>
  );
}
