import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = await login(form);
      navigate(location.state?.from || (user.role === 'admin' ? '/admin' : '/flights'), { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <span className="eyebrow dark">Welcome back</span>
        <h1>Sign in</h1>
        <p>Access your bookings and continue exploring flights.</p>

        {location.state?.passwordReset && (
          <p className="form-success">
            Your password has been reset successfully.
            You can now sign in with your new password.
          </p>
        )}

        <form className="stack-form" onSubmit={handleSubmit}>
          <input type="email" value={form.email} placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <div className="forgot-password-link">
            <Link to="/forgot-password">
              Forgot your password?
            </Link>
          </div>
          {error && <p className="form-error">{error}</p>}
          <button className="button full-width" disabled={submitting}>{submitting ? 'Signing in…' : 'Sign in'}</button>
        </form>
        <p className="auth-switch">No account yet? <Link to="/register">Register</Link></p>
      </section>
    </main>
  );
}
