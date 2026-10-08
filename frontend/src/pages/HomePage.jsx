import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <video className="hero-video" src="/media/vid1.mp4" autoPlay muted loop playsInline />
        <div className="hero-overlay" />
        <div className="hero-content">
          <span className="eyebrow">Your next journey starts here</span>
          <h1>Adventure is worthwhile.</h1>
          <p>Discover destinations, compare available flights and manage your bookings in one place.</p>
          <div className="hero-actions">
            <Link className="button" to="/flights">Explore flights</Link>
          </div>
        </div>
      </section>

      <section className="section features-section">
        <div className="section-heading">
          <span className="eyebrow dark">Built around the journey</span>
          <h2>A simpler way to travel</h2>
        </div>
        <div className="feature-grid">
          <article><span>01</span><h3>Browse</h3><p>Check available routes, schedules, pricing and seat availability.</p></article>
          <article><span>02</span><h3>Book</h3><p>Reserve a specific seat through a secure authenticated booking flow.</p></article>
          <article><span>03</span><h3>Manage</h3><p>Review your confirmed and cancelled reservations from your personal space.</p></article>
        </div>
      </section>
    </main>
  );
}
