import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../services/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError('');
    setMessage('');
    setSubmitting(true);

    try {
    await authApi.forgotPassword({
        email,
    });

    setMessage(
        'If an account exists for this email, a password reset link has been sent.'
    );
    } catch (err) {
    setError(err.message);
    } finally {
    setSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">

        <span className="eyebrow dark">
          Password recovery
        </span>

        <h1>Forgot password?</h1>

        <p>
          Enter your email address and we'll send you
          a link to reset your password.
        </p>

        <form
          className="stack-form"
          onSubmit={handleSubmit}
        >
            <input
              type="email"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />

          {message && (
            <p className="form-success">
              {message}
            </p>
          )}

          {error && (
            <p className="form-error">
              {error}
            </p>
          )}

          <button
            className="button full-width"
            disabled={submitting}
          >
            {submitting
              ? 'Sending…'
              : 'Send reset link'}
          </button>
        </form>

        <p className="auth-switch">
          Remember your password?{' '}
          <Link to="/login">
            Sign in
          </Link>
        </p>

      </section>
    </main>
  );
}