import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import NGODashboard from "./pages/NGODashboard";
import MealHistory from "./pages/MealHistory";

function Home() {
  return (
    <div className="app">
      <nav className="navbar">
        <Link to="/" className="logo">
          <span className="logo-mark">🌱</span>
          <span>FoodBridge</span>
        </Link>
        <div className="nav-links">
          <a href="#problem">The Problem</a>
          <a href="#solution">Our Solution</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#impact">Impact</a>
        </div>
        <Link to="/login" className="nav-button">Get Started</Link>
      </nav>

      <main>
        <section className="hero">
          <div className="hero-background">
            <div className="hero-orb hero-orb-one"></div>
            <div className="hero-orb hero-orb-two"></div>
            <div className="hero-grid"></div>
          </div>
          <div className="hero-content">
            <div className="hero-eyebrow">
              <span className="status-dot"></span>
              AI-POWERED FOOD WASTE PREVENTION
            </div>
            <h1>Feed People.<br /><span>Not Landfills.</span></h1>
            <p className="hero-description">
              FoodBridge uses AI-powered demand prediction to help kitchens prepare the right amount of food — then quickly redirect unavoidable surplus to people who need it.
            </p>
            <div className="hero-buttons">
              <Link to="/login" className="primary-button">Explore FoodBridge <span>→</span></Link>
              <a href="#how-it-works" className="secondary-button">
                <span className="play-icon">▶</span> See How It Works
              </a>
            </div>
            <div className="hero-trust">
              <div className="trust-item">
                <strong>AI</strong>
                <span>Demand Prediction</span>
              </div>
              <div className="trust-divider"></div>
              <div className="trust-item">
                <strong>QR</strong>
                <span>Rapid Redistribution</span>
              </div>
              <div className="trust-divider"></div>
              <div className="trust-item">
                <strong>24/7</strong>
                <span>Food Monitoring</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-glow"></div>
            <div className="prediction-card">
              <div className="card-header">
                <div className="ai-title">
                  <div className="ai-symbol">✦</div>
                  <div>
                    <strong>AI Prediction</strong>
                    <span>FoodBridge Intelligence</span>
                  </div>
                </div>
                <span className="live"><span></span>LIVE</span>
              </div>
              <div className="prediction-label">TOMORROW'S EXPECTED DEMAND</div>
              <div className="meal-number">510 <span>meals</span></div>
              <div className="prediction-chart">
                <div className="chart-line chart-line-one"></div>
                <div className="chart-line chart-line-two"></div>
                <div className="chart-line chart-line-three"></div>
                <div className="chart-bars">
                  <span style={{ height: "35%" }}></span>
                  <span style={{ height: "48%" }}></span>
                  <span style={{ height: "42%" }}></span>
                  <span style={{ height: "64%" }}></span>
                  <span style={{ height: "57%" }}></span>
                  <span style={{ height: "76%" }}></span>
                  <span className="active-bar" style={{ height: "88%" }}></span>
                </div>
              </div>
              <div className="prediction-footer">
                <div>
                  <span>Prediction confidence</span>
                  <strong>87%</strong>
                </div>
                <div className="confidence-ring">87</div>
              </div>
            </div>

            <div className="flow-card">
              <div className="flow-item"><div className="flow-icon">🍱</div><span>Prepare</span></div>
              <div className="flow-arrow">→</div>
              <div className="flow-item"><div className="flow-icon">🥗</div><span>Consume</span></div>
              <div className="flow-arrow">→</div>
              <div className="flow-item"><div className="flow-icon">📱</div><span>Donate</span></div>
            </div>

            <div className="floating-stat floating-stat-one">
              <span>♻</span>
              <div>
                <strong>32%</strong>
                <small>less waste</small>
              </div>
            </div>
            <div className="floating-stat floating-stat-two">
              <span>♥</span>
              <div>
                <strong>1.8K</strong>
                <small>meals donated</small>
              </div>
            </div>
          </div>
        </section>

        <section id="problem" className="problem-section">
          <div className="section-intro">
            <div>
              <p className="section-tag">THE PROBLEM</p>
              <h2>Food waste isn't just<br /><span>wasted food.</span></h2>
            </div>
            <p className="section-description">
              Every uneaten meal represents wasted water, energy, land, transportation, labour and cooking resources.
            </p>
          </div>
          <div className="problem-cards">
            <div className="problem-card">
              <div className="problem-card-number">01</div>
              <div className="problem-icon">💧</div>
              <h3>Wasted Water</h3>
              <p>Water used to grow and prepare food is wasted when that food is never eaten.</p>
              <div className="card-line"></div>
            </div>
            <div className="problem-card featured">
              <div className="problem-card-number">02</div>
              <div className="problem-icon">⚡</div>
              <h3>Wasted Energy</h3>
              <p>Energy used in farming, transportation, refrigeration and cooking is lost.</p>
              <div className="card-line"></div>
            </div>
            <div className="problem-card">
              <div className="problem-card-number">03</div>
              <div className="problem-icon">🌍</div>
              <h3>Climate Impact</h3>
              <p>Food waste contributes to greenhouse gas emissions throughout its lifecycle.</p>
              <div className="card-line"></div>
            </div>
          </div>
        </section>

        <section id="solution" className="solution-section">
          <div className="solution-background"></div>
          <div className="solution-content">
            <p className="section-tag">OUR APPROACH</p>
            <h2>Prevent waste<br /><span>before it happens.</span></h2>
            <p className="solution-description">
              Instead of waiting for food to become surplus, FoodBridge predicts demand using historical meal consumption data.
            </p>
            <div className="solution-flow">
              <div className="solution-step">
                <div className="solution-number">01</div>
                <div className="solution-icon">◈</div>
                <span>Predict</span>
                <p>AI forecasts meal demand.</p>
              </div>
              <div className="solution-connector"></div>
              <div className="solution-step">
                <div className="solution-number">02</div>
                <div className="solution-icon">◇</div>
                <span>Prepare</span>
                <p>Kitchen prepares closer to demand.</p>
              </div>
              <div className="solution-connector"></div>
              <div className="solution-step">
                <div className="solution-number">03</div>
                <div className="solution-icon">✦</div>
                <span>Redistribute</span>
                <p>Surplus reaches NGOs quickly.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="how-section">
          <div className="how-background"></div>
          <div className="how-header">
            <div>
              <p className="section-tag">HOW FOODBRIDGE WORKS</p>
              <h2>One loop.<br /><span>Less waste.</span></h2>
            </div>
            <p>
              From historical data to real-world redistribution, every step is designed to keep food moving toward people instead of landfills.
            </p>
          </div>
          <div className="steps">
            <div className="step">
              <div className="step-top">
                <div className="step-number">01</div>
                <div className="step-icon">▦</div>
              </div>
              <h3>Historical Data</h3>
              <p>FoodBridge learns how many people usually eat on different days and occasions.</p>
            </div>
            <div className="step">
              <div className="step-top">
                <div className="step-number">02</div>
                <div className="step-icon">✦</div>
              </div>
              <h3>AI Prediction</h3>
              <p>The system predicts tomorrow's expected meal demand.</p>
            </div>
            <div className="step">
              <div className="step-top">
                <div className="step-number">03</div>
                <div className="step-icon">⌁</div>
              </div>
              <h3>Smart Preparation</h3>
              <p>Kitchens prepare an optimized quantity instead of relying on guesswork.</p>
            </div>
            <div className="step">
              <div className="step-top">
                <div className="step-number">04</div>
                <div className="step-icon">♥</div>
              </div>
              <h3>Rapid Donation</h3>
              <p>QR-enabled volunteers connect surplus food with NGOs before it expires.</p>
            </div>
          </div>
        </section>

        <section id="impact" className="impact-section">
          <div className="impact-header">
            <div>
              <p className="section-tag">OUR IMPACT</p>
              <h2>Turning surplus into<br /><span>impact.</span></h2>
            </div>
            <div className="impact-message">
              <span className="impact-dot"></span>
              Building a measurable food rescue network.
            </div>
          </div>
          <div className="impact-grid">
            <div className="impact-card">
              <span className="impact-label">MEALS OPTIMIZED</span>
              <strong>12,480</strong>
              <small>+18.4% this month</small>
            </div>
            <div className="impact-card">
              <span className="impact-label">MEALS DIVERTED</span>
              <strong>3,240</strong>
              <small>from potential waste</small>
            </div>
            <div className="impact-card">
              <span className="impact-label">MEALS DONATED</span>
              <strong>1,820</strong>
              <small>reaching communities</small>
            </div>
            <div className="impact-card highlight">
              <span className="impact-label">NGO PARTNERS</span>
              <strong>48</strong>
              <small>and growing</small>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-glow"></div>
          <p className="section-tag">JOIN THE FOODBRIDGE NETWORK</p>
          <h2>Let's build a world where<br /><span>food feeds people, not landfills.</span></h2>
          <p className="cta-description">Predict smarter. Prevent waste. Redistribute faster.</p>
          <Link to="/login" className="primary-button cta-button">Get Started <span>→</span></Link>
        </section>
      </main>

      <footer>
        <div className="footer-brand">
          <Link to="/" className="logo">
            <span className="logo-mark">🌱</span>
            <span>FoodBridge</span>
          </Link>
          <p>Predict. Prevent. Redistribute.</p>
        </div>
        <div className="footer-center">
          <span>AI-powered food waste prevention</span>
        </div>
        <p className="copyright">© 2026 FoodBridge</p>
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
        <Route path="/meal-history" element={<MealHistory />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;