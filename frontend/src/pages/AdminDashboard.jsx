
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


function AdminDashboard() {

  const navigate = useNavigate();


  // =====================================================
  // STATE
  // =====================================================

  const [activeMenu, setActiveMenu] =
    useState("Dashboard");

  const [attendance, setAttendance] =
    useState("");

  const [historicalAverage, setHistoricalAverage] =
    useState(null);

  const [historicalRecords, setHistoricalRecords] =
    useState(0);

  const [predictionLoading, setPredictionLoading] =
    useState(false);

  const [predictedDemand, setPredictedDemand] =
    useState(0);

  const [recommendedMeals, setRecommendedMeals] =
    useState(0);

  const [safetyBuffer, setSafetyBuffer] =
    useState(0);

  const [predictionDay, setPredictionDay] =
    useState("");

  const [historySummary, setHistorySummary] =
    useState([]);

  const [historyLoading, setHistoryLoading] =
    useState(false);


  // =====================================================
  // TEMPORARY DASHBOARD CHART DATA
  // =====================================================

  const predictionData = [
    { day: "Mon", meals: 500 },
    { day: "Tue", meals: 520 },
    { day: "Wed", meals: 470 },
    { day: "Thu", meals: 530 },
    { day: "Fri", meals: 600 },
    { day: "Sat", meals: 450 },
    { day: "Sun", meals: 510 }
  ];


  // =====================================================
  // SIDEBAR
  // =====================================================

  const menuItems = [
    {
      name: "Dashboard",
      icon: "▦"
    },
    {
      name: "Predictions",
      icon: "◉"
    },
    {
      name: "Meals",
      icon: "🍱"
    },
    {
      name: "Donations",
      icon: "♡"
    },
    {
      name: "Volunteers",
      icon: "♧"
    }
  ];


  // =====================================================
  // GET TOMORROW
  // =====================================================

  const getTomorrowDay = () => {

    const tomorrow = new Date();

    tomorrow.setDate(
      tomorrow.getDate() + 1
    );

    return tomorrow.toLocaleDateString(
      "en-US",
      {
        weekday: "long"
      }
    );
  };


  // =====================================================
  // FETCH PREDICTION
  // =====================================================

  const fetchPrediction = async () => {

    setPredictionLoading(true);

    try {

      const tomorrowDay =
        getTomorrowDay();

      setPredictionDay(
        tomorrowDay
      );


      const response = await fetch(
        "http://127.0.0.1:5000/api/prediction",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

            attendance:
              attendance === ""
                ? 0
                : Number(attendance),

            day_name:
              tomorrowDay

          })
        }
      );


      if (!response.ok) {

        throw new Error(
          `Prediction API error: ${response.status}`
        );

      }


      const data =
        await response.json();


      setHistoricalAverage(
        data.historical_average
      );

      setHistoricalRecords(
        data.historical_records
      );

      setPredictedDemand(
        data.predicted_demand
      );

      setRecommendedMeals(
        data.recommended_meals
      );

      setSafetyBuffer(
        data.safety_buffer
      );


    } catch (error) {

      console.error(
        "Prediction error:",
        error
      );

      setHistoricalAverage(null);

      setHistoricalRecords(0);

      setPredictedDemand(0);

      setRecommendedMeals(0);

      setSafetyBuffer(0);


    } finally {

      setPredictionLoading(false);

    }

  };


  // =====================================================
  // FETCH HISTORY
  // =====================================================

  const fetchHistorySummary =
    async () => {

      setHistoryLoading(true);

      try {

        const response =
          await fetch(
            "http://127.0.0.1:5000/api/meals/history/summary"
          );


        if (!response.ok) {

          throw new Error(
            `History API error: ${response.status}`
          );

        }


        const data =
          await response.json();


        setHistorySummary(
          data
        );


      } catch (error) {

        console.error(
          "History error:",
          error
        );

        setHistorySummary([]);


      } finally {

        setHistoryLoading(false);

      }

    };


  // =====================================================
  // LOAD PREDICTION WHEN ATTENDANCE CHANGES
  // =====================================================

  useEffect(() => {

    fetchPrediction();

  }, [attendance]);


  // =====================================================
  // LOAD HISTORY ONCE
  // =====================================================

  useEffect(() => {

    fetchHistorySummary();

  }, []);


  // =====================================================
  // PREDICTIONS PAGE
  // =====================================================

  const renderPredictions =
    () => {

      return (

        <div className="prediction-page">


          {/* HEADER */}

          <div className="prediction-heading">

            <div>

              <p className="dashboard-label">
                AI MEAL FORECAST
              </p>

              <h1>
                Prepare smarter. Waste less.
              </h1>

              <p>
                FoodBridge analyzes historical
                meal demand and expected
                attendance to recommend
                how many meals the kitchen
                should prepare.
              </p>

            </div>

          </div>


          {/* MAIN PREDICTION */}

          <div className="prediction-layout">


            {/* INPUT */}

            <div className="prediction-input-card">

              <h2>
                Tomorrow's Expected Attendance
              </h2>

              <p>
                Enter the estimated number
                of people expected to eat
                tomorrow.
              </p>


              <label>
                Expected attendance
              </label>


              <input
                type="number"
                min="0"
                step="1"
                placeholder="Enter expected attendance"

                value={attendance}

                onChange={(event) => {

                  const value =
                    event.target.value;


                  if (value === "") {

                    setAttendance("");

                    return;

                  }


                  const number =
                    Number(value);


                  if (
                    Number.isInteger(number) &&
                    number >= 0
                  ) {

                    setAttendance(
                      number
                    );

                  }

                }}

              />


              {/* INFO */}

              <div className="prediction-info">


                <div>

                  <span>
                    Prediction day
                  </span>

                  <strong>
                    {
                      predictionDay ||
                      "Tomorrow"
                    }
                  </strong>

                </div>


                <div>

                  <span>
                    Historical average
                  </span>

                  <strong>

                    {predictionLoading

                      ? "Loading..."

                      : historicalRecords > 0

                      ? `${historicalAverage} meals`

                      : "No data yet"

                    }

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


            {/* RESULT */}

            <div className="prediction-result-card">


              <div className="result-ai">
                ✦ AI RECOMMENDATION
              </div>


              <p>

                {attendance === ""

                  ? "Enter expected attendance to calculate the recommended meal preparation."

                  : historicalRecords > 0

                  ? `Based on historical ${predictionDay} demand and expected attendance:`

                  : `No historical ${predictionDay} data exists yet. Attendance is being used as the primary estimate.`

                }

              </p>


              {/* BIG NUMBER */}

              <div className="result-number">

                {attendance === ""

                  ? "—"

                  : predictionLoading

                  ? "..."

                  : recommendedMeals

                }


                {attendance !== "" &&
                  !predictionLoading && (

                    <span>
                      {" "}meals
                    </span>

                  )}

              </div>


              {/* PREDICTED DEMAND */}

              <div className="calculation">

                <span>
                  Predicted demand
                </span>

                <strong>

                  {attendance === ""

                    ? "—"

                    : predictedDemand

                  }

                </strong>

              </div>


              {/* SAFETY */}

              <div className="calculation">

                <span>
                  Safety buffer
                </span>

                <strong>

                  {attendance === ""

                    ? "—"

                    : `+${safetyBuffer}`

                  }

                </strong>

              </div>


              {/* CONFIDENCE */}

              <div className="prediction-confidence">

                <span>
                  Prediction confidence
                </span>

                <strong>

                  {attendance === ""

                    ? "Waiting for input"

                    : historicalRecords > 0

                    ? "87%"

                    : "Attendance based"

                  }

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
                Preparing too many meals creates
                food waste. Preparing too few can
                leave people without food. FoodBridge
                uses expected attendance as the
                primary signal and historical patterns
                as supporting information.
              </p>

            </div>


          </div>


          {/* HISTORY */}

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
                Database records
              </span>

            </div>


            <div className="historical-table">


              <div className="table-row table-header">

                <span>
                  Day
                </span>

                <span>
                  Avg. Meals Consumed
                </span>

                <span>
                  Pattern
                </span>

              </div>


              {historyLoading ? (

                <div className="table-row">

                  <span>
                    Loading...
                  </span>

                  <span>
                    Fetching database
                  </span>

                  <span>
                    —
                  </span>

                </div>


              ) : historySummary.length === 0 ? (

                <div className="table-row">

                  <span>
                    No records
                  </span>

                  <span>
                    Add meal history
                  </span>

                  <span>
                    —
                  </span>

                </div>


              ) : (

                historySummary.map(
                  (item) => (

                    <div
                      className="table-row"
                      key={item.day}
                    >

                      <span>
                        {item.day}
                      </span>


                      <strong>
                        {item.meals_consumed}
                      </strong>


                      <span className="pattern">

                        {item.meals_consumed >
                        item.meals_prepared

                          ? "⚠ Check data"

                          : item.meals_consumed ===
                            item.meals_prepared

                          ? "✓ Balanced"

                          : "↓ Surplus"

                        }

                      </span>

                    </div>

                  )

                )

              )}

            </div>

          </div>


        </div>

      );

    };


  // =====================================================
  // NORMAL DASHBOARD
  // =====================================================

  const renderDashboard =
    () => {

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


          {/* TODAY */}

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


            {/* STATS */}

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


          {/* CHART */}

          <div className="dashboard-grid">


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

                  <span>600</span>
                  <span>500</span>
                  <span>400</span>
                  <span>300</span>

                </div>


                <div className="chart-area">


                  <div className="grid-line"></div>
                  <div className="grid-line"></div>
                  <div className="grid-line"></div>
                  <div className="grid-line"></div>


                  <div className="bars">


                    {predictionData.map(
                      (item) => (

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
                              height:
                                `${(item.meals / 600) * 100}%`
                            }}

                          ></div>


                          <span>
                            {item.day}
                          </span>


                        </div>

                      )
                    )}


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


            {/* AI PANEL */}

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
                  day-of-week patterns and recent
                  demand:
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
                      width: "87%"
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

                  Preparing around{" "}
                  {recommendedMeals} meals could
                  reduce expected surplus while
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


  // =====================================================
  // MAIN RENDER
  // =====================================================

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


          {menuItems.map(
            (item) => (

              <button
                key={item.name}

                className={
                  activeMenu === item.name
                    ? "menu-item active"
                    : "menu-item"
                }

                onClick={() =>
                  setActiveMenu(
                    item.name
                  )
                }

              >

                <span>
                  {item.icon}
                </span>

                <span>
                  {item.name}
                </span>

              </button>

            )
          )}


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

            onClick={() =>
              navigate("/")
            }

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

          : renderDashboard()

        }

      </main>


    </div>

  );

}


export default AdminDashboard;
