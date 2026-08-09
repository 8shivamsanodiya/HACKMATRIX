import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [role, setRole] = useState("admin");
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();

    if (role === "admin") {
      navigate("/dashboard");
    } else if (role === "volunteer") {
      navigate("/volunteer");
    } else {
      navigate("/ngo");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-logo">
          🌱 FoodBridge
        </div>

        <p className="section-tag">
          WELCOME TO FOODBRIDGE
        </p>

        <h1>Welcome back.</h1>

        <p className="login-description">
          Manage meals, prevent food waste, and connect
          surplus food with people who need it.
        </p>

        <form onSubmit={handleLogin}>

          <label>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            required
          />

          <label>Your role</label>

          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
          >
            <option value="admin">Admin / Kitchen</option>
            <option value="volunteer">Volunteer</option>
            <option value="ngo">NGO</option>
          </select>

          <button
            type="submit"
            className="primary-button login-button"
          >
            Continue →
          </button>

        </form>

        <button
          className="back-button"
          onClick={() => navigate("/")}
        >
          ← Back to FoodBridge
        </button>

      </div>
    </div>
  );
}

export default Login;