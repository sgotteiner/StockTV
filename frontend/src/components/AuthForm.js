import React, { useState } from 'react';
import '../App.css';

/**
 * AuthForm Component
 * Handles login and registration for unauthenticated users
 */
const AuthForm = ({ onSubmit, isLoginView, setIsLoginView, loading, error }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData });
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>{isLoginView ? 'Login' : 'Register'}</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {!isLoginView && (
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required={!isLoginView}
                disabled={loading}
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          {loading ? (
            <div className="loading">Processing...</div>
          ) : (
            <button type="submit" className="auth-button" disabled={loading}>
              {isLoginView ? 'Login' : 'Register'}
            </button>
          )}
        </form>

        <div className="switch-auth">
          {isLoginView ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                className="link-button"
                onClick={() => setIsLoginView(false)}
              >
                Register
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                className="link-button"
                onClick={() => setIsLoginView(true)}
              >
                Login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;