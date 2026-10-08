import { useEffect, useState } from 'react';

const emptyFlight = {
  airline: '',
  departure_airport: '',
  arrival_airport: '',
  departure_date: '',
  arrival_date: '',
  price: '',
  available_seats: '',
};

function toLocalInputValue(value) {
  if (!value) return '';
  const d = new Date(value);
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

export default function FlightForm({ initialValue, onSubmit, onCancel, submitLabel = 'Save flight' }) {
  const [form, setForm] = useState(emptyFlight);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!initialValue) {
      setForm(emptyFlight);
      return;
    }
    setForm({
      ...initialValue,
      departure_date: toLocalInputValue(initialValue.departure_date),
      arrival_date: toLocalInputValue(initialValue.arrival_date),
    });
  }, [initialValue]);

  function change(event) {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        airline: form.airline.trim(),
        departure_airport: form.departure_airport.trim(),
        arrival_airport: form.arrival_airport.trim(),
        departure_date: `${form.departure_date.replace('T', ' ')}:00`,
        arrival_date: `${form.arrival_date.replace('T', ' ')}:00`,
        price: Number(form.price),
        available_seats: Number(form.available_seats),
      });
      if (!initialValue) setForm(emptyFlight);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="form-grid" onSubmit={submit}>
      <label>Airline<input name="airline" value={form.airline} onChange={change} required /></label>
      <label>Available seats<input name="available_seats" type="number" min="0" value={form.available_seats} onChange={change} required /></label>
      <label>Departure airport<input name="departure_airport" value={form.departure_airport} onChange={change} required /></label>
      <label>Arrival airport<input name="arrival_airport" value={form.arrival_airport} onChange={change} required /></label>
      <label>Departure date<input name="departure_date" type="datetime-local" value={form.departure_date} onChange={change} required /></label>
      <label>Arrival date<input name="arrival_date" type="datetime-local" value={form.arrival_date} onChange={change} required /></label>
      <label>Price (USD)<input name="price" type="number" min="0" step="0.01" value={form.price} onChange={change} required /></label>
      <div className="form-actions">
        {onCancel && <button type="button" className="button button-secondary" onClick={onCancel}>Cancel</button>}
        <button className="button" disabled={submitting}>{submitting ? 'Saving…' : submitLabel}</button>
      </div>
    </form>
  );
}
