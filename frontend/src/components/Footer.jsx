import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">

        <div className="footer-section">
          <h3>AroundTheGlobe</h3>
          <p>
            Discover new destinations and book your next journey with us.
          </p>
        </div>

        <div className="footer-section">
          <h4>Contact Us</h4>

          <p>
            123 Dekwaneh Street<br />
            Beirut, Lebanon
          </p>

          <p>
            <a href="tel:+96176724538">
              +961 76 724 538
            </a>
          </p>

          <p>
            <a href="mailto:contact@aroundtheglobe.com">
              contact@aroundtheglobe.com
            </a>
          </p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>

          <nav className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/flights">Flights</Link>
            <Link to="/bookings">My Bookings</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </nav>
        </div>

        <div className="footer-section footer-location">
          <h4>Find Us</h4>

          <iframe
            title="AroundTheGlobe location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13318.602691837878!2d35.53339980147682!3d33.87938686977042!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151f164a832a8ba5%3A0x8945720522e0ee8e!2sDekwaneh%2C%20Lebanon!5e1!3m2!1sen!2sfr!4v1788710927604!5m2!1sen!2sfr"
            width="100%"
            height="180"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} AroundTheGlobe. All rights reserved.
        </p>

        <p>
          Developed by <strong>Charbel Al Bitar</strong>
        </p>
      </div>
    </footer>
  );
}