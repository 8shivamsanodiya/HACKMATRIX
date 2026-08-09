
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (role === "admin") {
      navigate("/dashboard");
    } else if (role === "volunteer") {
      navigate("/volunteer");
    } else if (role === "ngo") {
      navigate("/ngo");
    }
  };

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="login-glow login-glow-one"></div>
        <div className="login-glow login-glow-two"></div>
        <div className="login-grid"></div>
      </div>

      <div className="login-topbar">
        <Link to="/" className="login-brand">
          <span>🌱</span>
          FoodBridge
        </Link>

        <Link to="/" className="login-home">
          ← Back to Home
        </Link>
      </div>

      <main className="login-main">
        <div className="login-story">
          <p className="login-eyebrow">
            FOODBRIDGE PLATFORM
          </p>

          <h1>
            Turn every
            <br />
            <span>meal into impact.</span>
          </h1>

          <p className="login-story-text">
            Predict demand. Prevent waste. Redirect surplus.
            FoodBridge connects kitchens, volunteers and NGOs
            to make sure good food reaches people instead of
            landfills.
          </p>

          <div className="login-stats">
            <div>
              <strong>12K+</strong>
              <span>Meals Optimized</span>
            </div>

            <div>
              <strong>3K+</strong>
              <span>Meals Diverted</span>
            </div>

            <div>
              <strong>48</strong>
              <span>NGO Partners</span>
            </div>
          </div>
        </div>

        <div className="login-card">
          <div className="login-card-header">
            <div className="login-card-icon">
              🌱
            </div>

            <div>
              <p className="login-card-label">
                WELCOME BACK
              </p>

              <h2>
                Sign in to FoodBridge
              </h2>
            </div>
          </div>

          <p className="login-subtitle">
            Choose your role and continue to your workspace.
          </p>

          <div className="role-selector">
            <button
              type="button"
              className={role === "admin" ? "role-option active" : "role-option"}
              onClick={() => setRole("admin")}
            >
              <span className="role-icon">🏢</span>

              <span>
                <strong>Kitchen / Admin</strong>
                <small>Manage operations</small>
              </span>
            </button>

            <button
              type="button"
              className={role === "volunteer" ? "role-option active" : "role-option"}
              onClick={() => setRole("volunteer")}
            >
              <span className="role-icon">🚴</span>

              <span>
                <strong>Volunteer</strong>
                <small>Collect & deliver</small>
              </span>
            </button>

            <button
              type="button"
              className={role === "ngo" ? "role-option active" : "role-option"}
              onClick={() => setRole("ngo")}
            >
              <span className="role-icon">🤝</span>

              <span>
                <strong>NGO</strong>
                <small>Receive surplus</small>
              </span>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="login-field">
              <label htmlFor="email">
                EMAIL ADDRESS
              </label>

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="login-field">
              <div className="password-label">
                <label htmlFor="password">
                  PASSWORD
                </label>

                <button
                  type="button"
                  className="forgot-password"
                  onClick={() => alert("Password recovery will be connected soon.")}
                >
                  Forgot password?
                </button>
              </div>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="login-submit"
            >
              Continue as{" "}
              {role === "admin"
                ? "Kitchen / Admin"
                : role === "volunteer"
                ? "Volunteer"
                : "NGO"}
              <span>→</span>
            </button>
          </form>

          <div className="login-demo">
            <span>●</span>
            Demo environment
          </div>
        </div>
      </main>

      <div className="login-bottom">
        <span>Predict.</span>
        <span>Prevent.</span>
        <span>Redistribute.</span>
      </div>
    </div>
  );
}

export default Login;
