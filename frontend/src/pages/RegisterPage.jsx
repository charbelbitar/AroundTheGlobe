import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [form, setForm] = useState({ firstname: '', lastname: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const passwordRules = {
  minLength: form.password.length >= 8,
  uppercase: /[A-Z]/.test(form.password),
  lowercase: /[a-z]/.test(form.password),
  specialChar: /[^A-Za-z0-9]/.test(form.password),
};
const isPasswordValid = Object.values(passwordRules).every(Boolean);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    if (!isPasswordValid) {
      setError('Please make sure your password meets all requirements.');
      return;
    }
    setSubmitting(true);
    try {
      await register(form);
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page register-page">
      <section className="auth-card">
        <span className="eyebrow dark">Join AroundTheGlobe</span>
        <h1>Create account</h1>
        <form className="stack-form" onSubmit={handleSubmit}>
            <input value={form.firstname} placeholder="First name" onChange={(e) => setForm({ ...form, firstname: e.target.value })} required />
            <input value={form.lastname} placeholder="Last name" onChange={(e) => setForm({ ...form, lastname: e.target.value })} required />
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
          <div className="password-requirements">
            <p className={passwordRules.minLength ? "valid" : "invalid"}>
              {passwordRules.minLength ? "✓" : "✕"} At least 8 characters
            </p>

            <p className={passwordRules.uppercase ? "valid" : "invalid"}>
              {passwordRules.uppercase ? "✓" : "✕"} At least one uppercase letter
            </p>

            <p className={passwordRules.lowercase ? "valid" : "invalid"}>
              {passwordRules.lowercase ? "✓" : "✕"} At least one lowercase letter
            </p>

            <p className={passwordRules.specialChar ? "valid" : "invalid"}>
              {passwordRules.specialChar ? "✓" : "✕"} At least one special character
            </p>
          </div>
          {error && <p className="form-error">{error}</p>}
          <button className="button full-width" disabled={submitting}>{submitting ? 'Creating…' : 'Create account'}</button>
        </form>
        <p className="auth-switch">Already registered? <Link to="/login">Sign in</Link></p>
      </section>
    </main>
  );
}
