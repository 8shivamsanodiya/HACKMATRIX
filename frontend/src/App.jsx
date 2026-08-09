import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import NGODashboard from "./pages/NGODashboard";

function Home() {
  return (
    <div className="app">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">
          🌱 FoodBridge
        </div>

        <div className="nav-links">
          <a href="#problem">The Problem</a>
          <a href="#solution">Our Solution</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#impact">Impact</a>
        </div>
<Link to="/login" className="nav-button">
  Get Started
</Link>
      </nav>


      {/* HERO SECTION */}
      <section className="hero">

        <div className="hero-content">

          <p className="hero-tag">
            AI-POWERED FOOD WASTE PREVENTION
          </p>

          <h1>
            Feed People.
            <br />
            <span>Not Landfills.</span>
          </h1>

          <p className="hero-description">
            FoodBridge uses AI-powered demand prediction to help
            kitchens prepare the right amount of food — and quickly
            redirect unavoidable surplus to people who need it.
          </p>

          <div className="hero-buttons">
            <Link to="/login" className="primary-button">
  Explore FoodBridge →
</Link>

           <a href="#how-it-works" className="secondary-button">
  See How It Works
</a>
          </div>

        </div>


        {/* HERO VISUAL */}
        <div className="hero-visual">

          <div className="prediction-card">

            <div className="card-header">
              <span>🤖 AI Prediction</span>
              <span className="live">● LIVE</span>
            </div>

            <p className="small-text">
              Tomorrow's expected demand
            </p>

            <div className="meal-number">
              510
              <span> meals</span>
            </div>

            <div className="prediction-bar">
              <div className="prediction-fill"></div>
            </div>

            <p className="confidence">
              87% prediction confidence
            </p>

          </div>


          <div className="flow-card">

            <div>
              <span>🍱</span>
              <p>Prepare</p>
            </div>

            <div className="arrow">→</div>

            <div>
              <span>🥗</span>
              <p>Consume</p>
            </div>

            <div className="arrow">→</div>

            <div>
              <span>📱</span>
              <p>Donate</p>
            </div>

          </div>

        </div>

      </section>


      {/* PROBLEM SECTION */}
      <section id="problem" className="problem-section">

        <p className="section-tag">
          THE PROBLEM
        </p>

        <h2>
          Food waste isn't just
          <span> wasted food.</span>
        </h2>

        <p className="section-description">
          Every uneaten meal represents wasted water, energy, land,
          transportation, labour and cooking resources.
        </p>


        <div className="problem-cards">

          <div className="problem-card">
            <div className="problem-icon">💧</div>
            <h3>Wasted Water</h3>
            <p>
              Water used to grow and prepare food is wasted when
              that food is never eaten.
            </p>
          </div>

          <div className="problem-card">
            <div className="problem-icon">⚡</div>
            <h3>Wasted Energy</h3>
            <p>
              Energy used in farming, transportation, refrigeration
              and cooking is lost.
            </p>
          </div>

          <div className="problem-card">
            <div className="problem-icon">🌍</div>
            <h3>Climate Impact</h3>
            <p>
              Food waste contributes to greenhouse gas emissions
              throughout its lifecycle.
            </p>
          </div>

        </div>

      </section>


      {/* SOLUTION SECTION */}
      <section id="solution" className="solution-section">

        <div className="solution-content">

          <p className="section-tag">
            OUR APPROACH
          </p>

          <h2>
            Prevent waste
            <br />
            <span>before it happens.</span>
          </h2>

          <p>
            Instead of waiting for food to become surplus,
            FoodBridge predicts demand using historical meal
            consumption data.
          </p>

          <div className="solution-flow">

            <div className="solution-step">
              <strong>01</strong>
              <span>Predict</span>
              <p>AI forecasts meal demand.</p>
            </div>

            <div className="solution-step">
              <strong>02</strong>
              <span>Prepare</span>
              <p>Kitchen prepares closer to demand.</p>
            </div>

            <div className="solution-step">
              <strong>03</strong>
              <span>Redistribute</span>
              <p>Surplus reaches NGOs quickly.</p>
            </div>

          </div>

        </div>

      </section>


      {/* HOW IT WORKS */}
      <section id="how-it-works" className="how-section">

        <p className="section-tag">
          HOW FOODBRIDGE WORKS
        </p>

        <h2>
          One loop.
          <span> Less waste.</span>
        </h2>

        <div className="steps">

          <div className="step">
            <div className="step-number">1</div>
            <h3>Historical Data</h3>
            <p>
              FoodBridge learns how many people usually
              eat on different days and occasions.
            </p>
          </div>

          <div className="step">
            <div className="step-number">2</div>
            <h3>AI Prediction</h3>
            <p>
              The system predicts tomorrow's expected
              meal demand.
            </p>
          </div>

          <div className="step">
            <div className="step-number">3</div>
            <h3>Smart Preparation</h3>
            <p>
              Kitchens prepare an optimized quantity
              instead of relying on guesswork.
            </p>
          </div>

          <div className="step">
            <div className="step-number">4</div>
            <h3>Rapid Donation</h3>
            <p>
              If surplus remains, QR-enabled volunteers
              connect it with NGOs before the food expires.
            </p>
          </div>

        </div>

      </section>


      {/* IMPACT */}
      <section id="impact" className="impact-section">

        <p className="section-tag">
          OUR IMPACT
        </p>

        <h2>
          Turning surplus into
          <span> impact.</span>
        </h2>

        <div className="impact-grid">

          <div className="impact-card">
            <strong>12,480</strong>
            <span>Meals Optimized</span>
          </div>

          <div className="impact-card">
            <strong>3,240</strong>
            <span>Meals Diverted</span>
          </div>

          <div className="impact-card">
            <strong>1,820</strong>
            <span>Meals Donated</span>
          </div>

          <div className="impact-card">
            <strong>48</strong>
            <span>NGO Partners</span>
          </div>

        </div>

      </section>


      {/* FINAL CTA */}
      <section className="cta-section">

        <h2>
          Let's build a world where
          <br />
          <span>food feeds people, not landfills.</span>
        </h2>

        <button className="primary-button">
          Get Started →
        </button>

      </section>


      {/* FOOTER */}
      <footer>

        <div className="logo">
          🌱 FoodBridge
        </div>

        <p>
          Predict. Prevent. Redistribute.
        </p>

        <p className="copyright">
          © 2026 FoodBridge
        </p>

      </footer>

    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/volunteer" element={<VolunteerDashboard />} />
        <Route path="/ngo" element={<NGODashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;