const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

async function sendPasswordResetEmail(email, resetUrl) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Reset your AroundTheGlobe password',
    html: `
      <h2>Password reset</h2>

      <p>You requested a password reset.</p>

      <p>
        <a href="${resetUrl}">
          Reset password
        </a>
      </p>

      <p>This link expires in 30 minutes.</p>

      <p>
        If you did not request this reset,
        you can ignore this email.
      </p>
    `,
  });
}

async function sendWelcomeEmail(email, firstname) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Welcome to AroundTheGlobe!',
    html: `
      <h2>Welcome to AroundTheGlobe, ${firstname}!</h2>

      <p>
        Your account has been created successfully.
      </p>

      <p>
        You can now explore available flights,
        manage your bookings, and plan your next trip.
      </p>

      <p>
        We're happy to have you with us.
      </p>

      <p>
        The AroundTheGlobe Team
      </p>
    `,
  });
}

async function sendBookingConfirmationEmail(email, firstname, booking) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `Booking confirmed - ${booking.departure_airport} → ${booking.arrival_airport}`,
    html: `
      <h2>Booking confirmed ✈️</h2>

      <p>Hello ${firstname},</p>

      <p>
        Your flight booking has been confirmed successfully.
      </p>

      <h3>Booking details</h3>

      <p>
        <strong>Booking number:</strong>
        #${booking.booking_id}
      </p>

      <p>
        <strong>Airline:</strong>
        ${booking.airline}
      </p>

      <p>
        <strong>Flight:</strong>
        ${booking.departure_airport}
        →
        ${booking.arrival_airport}
      </p>

      <p>
        <strong>Departure:</strong>
        ${new Date(booking.departure_date).toLocaleString()}
      </p>

      <p>
        <strong>Arrival:</strong>
        ${new Date(booking.arrival_date).toLocaleString()}
      </p>

      <p>
        <strong>Seat:</strong>
        ${booking.seat_number}
      </p>

      <p>
        <strong>Price:</strong>
        €${booking.price}
      </p>

      <p>
        You can view your bookings from your
        AroundTheGlobe account.
      </p>

      <p>
        Have a great trip!
      </p>

      <p>
        The AroundTheGlobe Team
      </p>
    `,
  });
}

async function sendBookingCancellationEmail(email, firstname, booking) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `Booking cancelled - #${booking.booking_id}`,
    html: `
      <h2>Booking cancelled</h2>

      <p>Hello ${firstname},</p>

      <p>
        Your booking has been cancelled successfully.
      </p>

      <h3>Cancelled booking</h3>

      <p>
        <strong>Booking number:</strong>
        #${booking.booking_id}
      </p>

      <p>
        <strong>Airline:</strong>
        ${booking.airline}
      </p>

      <p>
        <strong>Flight:</strong>
        ${booking.departure_airport}
        →
        ${booking.arrival_airport}
      </p>

      <p>
        <strong>Departure:</strong>
        ${new Date(booking.departure_date).toLocaleString()}
      </p>

      <p>
        <strong>Seat:</strong>
        ${booking.seat_number}
      </p>

      <p>
        The seat has been released and is available
        for booking again.
      </p>

      <p>
        The AroundTheGlobe Team
      </p>
    `,
  });
}

module.exports = {
  sendPasswordResetEmail, 
  sendWelcomeEmail, 
  sendBookingConfirmationEmail,
  sendBookingCancellationEmail
};