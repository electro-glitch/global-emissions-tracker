import React, { useState } from "react";
import "./LoginPage.css";

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || (username !== "guest" && !password.trim())) {
      setError("Please enter both username and password");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      let data;
        try {
          data = await response.json();
        } catch {
          setError("Server error. Please try again.");
          setIsLoading(false);
          return;
        }

        if (response.ok && data.success) {
          onLogin(username, data.role);
        } else {
          setError(data?.message || "Invalid credentials");
        }

    } catch (error) {
      setError("Connection error. Please check your server.");
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Global Emissions Tracker</h2>
        <p>Log in to access the emissions dashboard</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              disabled={isLoading}
            />
          </div>

          {username !== "guest" && (
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={isLoading}
              />
            </div>
          )}

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        <button
          type="button"
          className="guest-login-button"
          onClick={() => onLogin("guest", "guest")}
          style={{
            marginTop: "12px",
            width: "100%",
            background: "#e3f0fa",
            color: "#2d3a4a",
            border: "none",
            borderRadius: "6px",
            padding: "12px",
            fontWeight: 500,
            cursor: "pointer"
          }}
        >
          Continue as Guest
        </button>
      </div>
    </div>
  );
}
