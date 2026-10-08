import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { authApi } from '../services/api';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const passwordRules = {
    minLength: form.password.length >= 8,
    uppercase: /[A-Z]/.test(form.password),
    lowercase: /[a-z]/.test(form.password),
    specialChar: /[^A-Za-z0-9]/.test(form.password),
  };

  const isPasswordValid =
    Object.values(passwordRules).every(Boolean);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!isPasswordValid) {
      setError(
        'Please make sure your password meets all requirements.'
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);

    try {
      await authApi.resetPassword({
        token,
        password: form.password,
        });

      navigate('/login', {
        state: { passwordReset: true },
      });
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

        <h1>Reset password</h1>

        <p>
          Enter your new password below.
        </p>

        <form
          className="stack-form"
          onSubmit={handleSubmit}
        >

          <div className="password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="New password"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowPassword((prev) => !prev)
              }
              aria-label={
                showPassword
                  ? 'Hide password'
                  : 'Show password'
              }
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <div className="password-requirements">
            <p
              className={
                passwordRules.minLength
                  ? 'valid'
                  : 'invalid'
              }
            >
              {passwordRules.minLength ? '✓' : '✕'}{' '}
              At least 8 characters
            </p>

            <p
              className={
                passwordRules.uppercase
                  ? 'valid'
                  : 'invalid'
              }
            >
              {passwordRules.uppercase ? '✓' : '✕'}{' '}
              At least one uppercase letter
            </p>

            <p
              className={
                passwordRules.lowercase
                  ? 'valid'
                  : 'invalid'
              }
            >
              {passwordRules.lowercase ? '✓' : '✕'}{' '}
              At least one lowercase letter
            </p>

            <p
              className={
                passwordRules.specialChar
                  ? 'valid'
                  : 'invalid'
              }
            >
              {passwordRules.specialChar ? '✓' : '✕'}{' '}
              At least one special character
            </p>
          </div>

          
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm new password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({
                  ...form,
                  confirmPassword: e.target.value,
                })
              }
              required
            />
          

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
              ? 'Resetting…'
              : 'Reset password'}
          </button>
        </form>

        <p className="auth-switch">
          <Link to="/login">
            Back to sign in
          </Link>
        </p>
      </section>
    </main>
  );
}