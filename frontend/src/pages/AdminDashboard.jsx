import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [attendance, setAttendance] = useState("");

  // Temporary historical data.
  // Later this will come from our database.
  const historicalAverage = 485;
  const safetyMargin = 0.05;

  // Simple MVP prediction formula.
  // Later we will replace this with an actual ML model.
  const numericAttendance =
  attendance === "" ? 0 : Number(attendance);

let predictedDemand = 0;
let recommendedMeals = 0;

if (numericAttendance > 0) {
  predictedDemand = Math.round(
    numericAttendance * 0.5 +
    historicalAverage * 0.5
  );

  recommendedMeals = Math.ceil(
    predictedDemand * (1 + safetyMargin)
  );
}
  const predictionData = [
    { day: "Mon", meals: 500 },
    { day: "Tue", meals: 520 },
    { day: "Wed", meals: 470 },
    { day: "Thu", meals: 530 },
    { day: "Fri", meals: 600 },
    { day: "Sat", meals: 450 },
    { day: "Sun", meals: 510 },
  ];

  const menuItems = [
    { name: "Dashboard", icon: "▦" },
    { name: "Predictions", icon: "◉" },
    { name: "Meals", icon: "🍱" },
    { name: "Donations", icon: "♡" },
    { name: "Volunteers", icon: "♧" },
  ];

  // -----------------------------
  // PREDICTIONS PAGE
  // -----------------------------

  const renderPredictions = () => {
    return (
      <div className="prediction-page">

        <div className="prediction-heading">

          <div>
            <p className="dashboard-label">
              AI MEAL FORECAST
            </p>

            <h1>
              Prepare smarter. Waste less.
            </h1>

            <p>
              FoodBridge analyzes historical meal demand
              to recommend how many meals the kitchen
              should prepare.
            </p>
          </div>

        </div>


        <div className="prediction-layout">

          {/* INPUT CARD */}

          <div className="prediction-input-card">

            <h2>
              Tomorrow's Expected Attendance
            </h2>

            <p>
              Enter the estimated number of people
              expected to eat tomorrow.
            </p>

            <label>
              Expected attendance
            </label>

            <input
  type="number"
  min="0"
  placeholder="Enter expected attendance"
  value={attendance}
  onChange={(event) => {
    const value = event.target.value;

    if (value === "") {
      setAttendance("");
      return;
    }

    const number = Number(value);

    if (number >= 0) {
      setAttendance(number);
    }
  }}
/>
            

            <div className="prediction-info">

              <div>
                <span>
                  Historical average
                </span>

                <strong>
                  {historicalAverage} meals
                </strong>
              </div>

              <div>
                <span>
                  Safety margin
                </span>

                <strong>
                  5%
                </strong>
              </div>

            </div>

          </div>


          {/* RESULT CARD */}

          <div className="prediction-result-card">

            <div className="result-ai">
              ✦ AI RECOMMENDATION
            </div>

            <p>
              Based on historical demand and
              expected attendance, FoodBridge
              recommends preparing:
            </p>

            <div className="result-number">
  {attendance === "" ? "—" : recommendedMeals}
</div>

<span className="result-unit">
  {attendance === "" ? "waiting for input" : "meals"}
</span>


            <div className="calculation">

              <span>
                Predicted demand
              </span>

              <strong>
                {predictedDemand}
              </strong>

            </div>


            <div className="calculation">

              <span>
                Safety buffer
              </span>

              <strong>
                +{recommendedMeals - predictedDemand}
              </strong>

            </div>


            <div className="prediction-confidence">

              <span>
                Prediction confidence
              </span>

              <strong>
                87%
              </strong>

            </div>

          </div>

        </div>


        {/* EXPLANATION */}

        <div className="prediction-explanation">

          <div className="explanation-icon">
            🌱
          </div>

          <div>

            <h3>
              Why this matters
            </h3>

            <p>
              Preparing too many meals creates food waste.
              Preparing too few can leave people without food.
              FoodBridge balances both using historical demand
              patterns and a controlled safety margin.
            </p>

          </div>

        </div>


        {/* HISTORICAL DATA */}

        <div className="historical-section">

          <div className="historical-heading">

            <div>
              <p className="dashboard-label">
                HISTORICAL DATA
              </p>

              <h2>
                Previous Meal Demand
              </h2>
            </div>

            <span>
              Last 7 days
            </span>

          </div>


          <div className="historical-table">

            <div className="table-row table-header">

              <span>
                Day
              </span>

              <span>
                Meals Consumed
              </span>

              <span>
                Pattern
              </span>

            </div>


            {predictionData.map((item, index) => (

              <div
                className="table-row"
                key={item.day}
              >

                <span>
                  {item.day}
                </span>

                <strong>
                  {item.meals}
                </strong>

                <span className="pattern">

                  {index > 0 &&
                  item.meals > predictionData[index - 1].meals
                    ? "↑ Higher"
                    : index === 0
                    ? "—"
                    : "↓ Lower"}

                </span>

              </div>

            ))}

          </div>

        </div>

      </div>
    );
  };


  // -----------------------------
  // NORMAL DASHBOARD
  // -----------------------------

  const renderDashboard = () => {
    return (
      <>

        {/* HEADER */}

        <header className="dashboard-header">

          <div>

            <p className="dashboard-date">
              Sunday, August 9, 2026
            </p>

            <h1>
              Good morning, Kitchen Team 👋
            </h1>

          </div>


          <div className="header-actions">

            <button className="notification">
              🔔
              <span></span>
            </button>


            <div className="profile">

              <div className="profile-avatar">
                K
              </div>

              <div>

                <strong>
                  Kitchen Admin
                </strong>

                <small>
                  Central Kitchen
                </small>

              </div>

            </div>

          </div>

        </header>


        {/* TODAY'S MEAL PLAN */}

        <section className="dashboard-section">

          <div className="dashboard-section-heading">

            <div>

              <p className="dashboard-label">
                TODAY'S MEAL PLAN
              </p>

              <h2>
                Sunday Demand Overview
              </h2>

            </div>


            <span className="status-badge">
              ● AI ANALYSIS ACTIVE
            </span>

          </div>


          {/* STAT CARDS */}

          <div className="stat-grid">


            <div className="stat-card">

              <div className="stat-icon prediction">
                ◉
              </div>

              <div>

                <p>
                  Predicted Demand
                </p>

                <strong>
                  510
                </strong>

                <span>
                  {" "}meals
                </span>

              </div>

              <small className="positive">
                ↑ 4.2% vs last Sunday
              </small>

            </div>


            <div className="stat-card">

              <div className="stat-icon prepared">
                🍱
              </div>

              <div>

                <p>
                  Meals Prepared
                </p>

                <strong>
                  495
                </strong>

                <span>
                  {" "}meals
                </span>

              </div>

              <small>
                97% of prediction
              </small>

            </div>


            <div className="stat-card">

              <div className="stat-icon surplus">
                ♻
              </div>

              <div>

                <p>
                  Current Surplus
                </p>

                <strong>
                  15
                </strong>

                <span>
                  {" "}meals
                </span>

              </div>

              <small className="warning">
                Requires action
              </small>

            </div>


            <div className="stat-card">

              <div className="stat-icon saved">
                🌱
              </div>

              <div>

                <p>
                  Meals Saved
                </p>

                <strong>
                  1,820
                </strong>

                <span>
                  {" "}this month
                </span>

              </div>

              <small className="positive">
                ↑ 18% this month
              </small>

            </div>

          </div>

        </section>


        {/* CHART + AI */}

        <div className="dashboard-grid">


          {/* WEEKLY CHART */}

          <section className="panel prediction-panel">

            <div className="panel-header">

              <div>

                <p className="dashboard-label">
                  AI FORECAST
                </p>

                <h2>
                  Weekly Meal Demand
                </h2>

              </div>


              <button className="small-button">
                This Week ▾
              </button>

            </div>


            <div className="chart">

              <div className="chart-y-axis">

                <span>
                  600
                </span>

                <span>
                  500
                </span>

                <span>
                  400
                </span>

                <span>
                  300
                </span>

              </div>


              <div className="chart-area">

                <div className="grid-line"></div>
                <div className="grid-line"></div>
                <div className="grid-line"></div>
                <div className="grid-line"></div>


                <div className="bars">

                  {predictionData.map((item) => (

                    <div
                      className="bar-group"
                      key={item.day}
                    >

                      <div
                        className={
                          item.day === "Sun"
                            ? "bar today"
                            : "bar"
                        }
                        style={{
                          height: `${(item.meals / 600) * 100}%`,
                        }}
                      ></div>

                      <span>
                        {item.day}
                      </span>

                    </div>

                  ))}

                </div>

              </div>

            </div>


            <div className="chart-footer">

              <div>

                <span className="legend-dot"></span>

                Predicted meals

              </div>


              <strong>
                Average: 511 meals/day
              </strong>

            </div>

          </section>


          {/* AI RECOMMENDATION */}

          <section className="panel ai-panel">

            <div className="ai-header">

              <div className="ai-icon">
                ✦
              </div>

              <div>

                <p className="dashboard-label">
                  AI RECOMMENDATION
                </p>

                <h2>
                  Tomorrow's Plan
                </h2>

              </div>

            </div>


            <div className="recommendation">

              <p>
                Based on historical attendance,
                day-of-week patterns and recent demand:
              </p>


              <div className="recommendation-number">
                {recommendedMeals}
                <span>
                  {" "}meals
                </span>
              </div>


              <strong>
                Recommended preparation
              </strong>


              <div className="confidence-bar">

                <div
                  style={{
                    width: "87%",
                  }}
                ></div>

              </div>


              <div className="confidence-text">

                <span>
                  Prediction confidence
                </span>

                <strong>
                  87%
                </strong>

              </div>

            </div>


            <div className="ai-note">

              💡

              <span>
                Preparing around {recommendedMeals} meals
                could reduce expected surplus while
                maintaining a small safety margin.
              </span>

            </div>

          </section>

        </div>


        {/* SURPLUS */}

        <section className="surplus-section">

          <div className="surplus-header">

            <div>

              <p className="dashboard-label">
                SURPLUS MONITOR
              </p>

              <h2>
                Food requiring attention
              </h2>

            </div>


            <span className="surplus-status">
              ⚠ 15 meals available
            </span>

          </div>


          <div className="surplus-card">


            <div className="food-info">

              <div className="food-image">
                🍱
              </div>

              <div>

                <h3>
                  Prepared Meals
                </h3>

                <p>
                  Central Kitchen • Batch #FB-0908
                </p>

              </div>

            </div>


            <div className="expiry">

              <span>
                BEST BEFORE
              </span>

              <strong>
                01:45 PM
              </strong>

              <small>
                Today
              </small>

            </div>


            <div className="countdown">

              <span>
                TIME REMAINING
              </span>

              <strong>
                01:12:34
              </strong>

            </div>


            <button className="donate-button">

              Generate Donation QR →

            </button>

          </div>

        </section>

      </>
    );
  };


  // -----------------------------
  // MAIN RENDER
  // -----------------------------

  return (

    <div className="dashboard">


      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="dashboard-logo">
          🌱 FoodBridge
        </div>


        <div className="role-label">
          KITCHEN ADMIN
        </div>


        <nav className="sidebar-nav">

          {menuItems.map((item) => (

            <button
              key={item.name}
              className={
                activeMenu === item.name
                  ? "menu-item active"
                  : "menu-item"
              }
              onClick={() =>
                setActiveMenu(item.name)
              }
            >

              <span>
                {item.icon}
              </span>

              <span>
                {item.name}
              </span>

            </button>

          ))}

        </nav>


        <div className="sidebar-bottom">

          <button className="menu-item">

            <span>
              ⚙
            </span>

            <span>
              Settings
            </span>

          </button>


          <button
            className="menu-item logout"
            onClick={() => navigate("/")}
          >

            <span>
              ↪
            </span>

            <span>
              Logout
            </span>

          </button>

        </div>

      </aside>


      {/* MAIN */}

      <main className="dashboard-main">

        {activeMenu === "Predictions"
          ? renderPredictions()
          : renderDashboard()}

      </main>

    </div>
  );
}

export default AdminDashboard;