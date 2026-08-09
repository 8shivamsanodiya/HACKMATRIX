
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://127.0.0.1:5000";

function AdminDashboard() {
  const navigate = useNavigate();

  // =====================================================
  // MAIN MENU
  // =====================================================

  const [activeMenu, setActiveMenu] = useState("Dashboard");

  // =====================================================
  // PREDICTION
  // =====================================================

  const [attendance, setAttendance] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [predictionLoading, setPredictionLoading] = useState(false);

  // =====================================================
  // MEAL HISTORY
  // =====================================================

  const [mealHistory, setMealHistory] = useState([]);
  const [mealHistoryLoading, setMealHistoryLoading] = useState(false);

  const [mealDate, setMealDate] = useState("");
  const [mealPrepared, setMealPrepared] = useState("");
  const [mealConsumed, setMealConsumed] = useState("");
  const [mealSubmitting, setMealSubmitting] = useState(false);

  // =====================================================
  // DONATIONS
  // =====================================================

  const [donations, setDonations] = useState([]);

  const [donationSummary, setDonationSummary] = useState({
    total_donations: 0,
    total_meals_donated: 0,
    available_meals: 0,
    claimed_meals: 0,
  });

  const [donationDate, setDonationDate] = useState("");
  const [donationMeals, setDonationMeals] = useState("");
  const [donationDescription, setDonationDescription] = useState("");

  const [donationLoading, setDonationLoading] = useState(false);
  const [donationSubmitting, setDonationSubmitting] = useState(false);

  // =====================================================
  // VOLUNTEERS
  // =====================================================

  const [volunteers, setVolunteers] = useState([]);

  const [volunteerSummary, setVolunteerSummary] = useState({
    total: 0,
    available: 0,
    busy: 0,
    unavailable: 0,
  });

  const [volunteerName, setVolunteerName] = useState("");
  const [volunteerPhone, setVolunteerPhone] = useState("");
  const [volunteerRole, setVolunteerRole] = useState("");
  const [volunteerAvailability, setVolunteerAvailability] =
    useState("Available");

  const [volunteerLoading, setVolunteerLoading] = useState(false);
  const [volunteerSubmitting, setVolunteerSubmitting] = useState(false);

  // =====================================================
  // MENU ITEMS
  // =====================================================

  const menuItems = [
    {
      name: "Dashboard",
      icon: "▦",
    },
    {
      name: "Predictions",
      icon: "◉",
    },
    {
      name: "Meals",
      icon: "🍱",
    },
    {
      name: "Donations",
      icon: "♡",
    },
    {
      name: "Volunteers",
      icon: "♧",
    },
  ];

  // =====================================================
  // DATE HELPERS
  // =====================================================

  const getTodayDate = () => {
    const today = new Date();

    return today.toLocaleDateString("en-CA");
  };

  const getTomorrowDay = () => {
    const tomorrow = new Date();

    tomorrow.setDate(tomorrow.getDate() + 1);

    return tomorrow.toLocaleDateString("en-US", {
      weekday: "long",
    });
  };

  const getDayNameFromDate = (dateValue) => {
    if (!dateValue) {
      return "";
    }

    const date = new Date(`${dateValue}T00:00:00`);

    return date.toLocaleDateString("en-US", {
      weekday: "long",
    });
  };

  // =====================================================
  // PREDICTION
  // =====================================================

  const fetchPrediction = async () => {
    setPredictionLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/prediction`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          attendance:
            attendance === "" ? 0 : Number(attendance),

          day_name: getTomorrowDay(),
        }),
      });

      if (!response.ok) {
        throw new Error("Prediction request failed");
      }

      const data = await response.json();

      setPrediction(data);
    } catch (error) {
      console.error("Prediction error:", error);

      setPrediction(null);

      alert(
        "Could not connect to the FoodBridge backend."
      );
    } finally {
      setPredictionLoading(false);
    }
  };

  // =====================================================
  // MEAL HISTORY
  // =====================================================

  const fetchMealHistory = async () => {
    setMealHistoryLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/meals/history`
      );

      if (!response.ok) {
        throw new Error("Could not fetch meal history");
      }

      const data = await response.json();

      setMealHistory(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error("Meal history error:", error);

      setMealHistory([]);
    } finally {
      setMealHistoryLoading(false);
    }
  };

  // =====================================================
  // ADD MEAL RECORD
  // =====================================================

  const addMealRecord = async (event) => {
    event.preventDefault();

    if (!mealDate || !mealPrepared || !mealConsumed) {
      alert("Please fill all meal fields.");
      return;
    }

    if (
      Number(mealPrepared) < 0 ||
      Number(mealConsumed) < 0
    ) {
      alert("Meal values cannot be negative.");
      return;
    }

    if (
      Number(mealConsumed) >
      Number(mealPrepared)
    ) {
      alert(
        "Meals consumed cannot be greater than meals prepared."
      );
      return;
    }

    setMealSubmitting(true);

    try {
      const response = await fetch(
        `${API_URL}/api/meals/history`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            meal_date: mealDate,

            day_name:
              getDayNameFromDate(mealDate),

            meals_prepared:
              Number(mealPrepared),

            meals_consumed:
              Number(mealConsumed),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Could not add meal record"
        );
      }

      alert("Meal record added successfully.");

      setMealDate("");
      setMealPrepared("");
      setMealConsumed("");

      fetchMealHistory();
    } catch (error) {
      console.error("Add meal error:", error);

      alert(error.message);
    } finally {
      setMealSubmitting(false);
    }
  };

  // =====================================================
  // DONATIONS
  // =====================================================

  const fetchDonations = async () => {
    setDonationLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/donations`
      );

      if (!response.ok) {
        throw new Error("Could not fetch donations");
      }

      const data = await response.json();

      setDonations(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error("Donation error:", error);

      setDonations([]);
    } finally {
      setDonationLoading(false);
    }
  };

  const fetchDonationSummary = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/donations/summary`
      );

      if (!response.ok) {
        throw new Error(
          "Could not fetch donation summary"
        );
      }

      const data = await response.json();

      setDonationSummary({
        total_donations:
          data.total_donations ?? 0,

        total_meals_donated:
          data.total_meals_donated ?? 0,

        available_meals:
          data.available_meals ?? 0,

        claimed_meals:
          data.claimed_meals ?? 0,
      });
    } catch (error) {
      console.error(
        "Donation summary error:",
        error
      );
    }
  };

  // =====================================================
  // CREATE DONATION
  // =====================================================

  const createDonation = async (event) => {
    event.preventDefault();

    if (!donationDate || !donationMeals) {
      alert(
        "Please enter donation date and number of meals."
      );

      return;
    }

    setDonationSubmitting(true);

    try {
      const response = await fetch(
        `${API_URL}/api/donations`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            donation_date: donationDate,

            meals: Number(donationMeals),

            description:
              donationDescription,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Could not create donation"
        );
      }

      alert(
        "Donation created successfully."
      );

      setDonationDate("");
      setDonationMeals("");
      setDonationDescription("");

      fetchDonations();
      fetchDonationSummary();
    } catch (error) {
      console.error(
        "Create donation error:",
        error
      );

      alert(error.message);
    } finally {
      setDonationSubmitting(false);
    }
  };

  // =====================================================
  // UPDATE DONATION STATUS
  // =====================================================

  const updateDonationStatus = async (
    donationId,
    status
  ) => {
    try {
      const response = await fetch(
        `${API_URL}/api/donations/${donationId}/status`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Could not update donation"
        );
      }

      fetchDonations();
      fetchDonationSummary();
    } catch (error) {
      console.error(
        "Donation status error:",
        error
      );

      alert(error.message);
    }
  };

  // =====================================================
  // VOLUNTEERS
  // =====================================================

  const fetchVolunteers = async () => {
    setVolunteerLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/volunteers`
      );

      if (!response.ok) {
        throw new Error(
          "Could not fetch volunteers"
        );
      }

      const data = await response.json();

      setVolunteers(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "Volunteer fetch error:",
        error
      );

      setVolunteers([]);
    } finally {
      setVolunteerLoading(false);
    }
  };

  const fetchVolunteerSummary = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/volunteers/summary`
      );

      if (!response.ok) {
        throw new Error(
          "Could not fetch volunteer summary"
        );
      }

      const data = await response.json();

      setVolunteerSummary({
        total: data.total ?? 0,

        available:
          data.available ?? 0,

        busy:
          data.busy ?? 0,

        unavailable:
          data.unavailable ?? 0,
      });
    } catch (error) {
      console.error(
        "Volunteer summary error:",
        error
      );
    }
  };

  // =====================================================
  // CREATE VOLUNTEER
  // =====================================================

  const createVolunteer = async (event) => {
    event.preventDefault();

    if (!volunteerName.trim()) {
      alert("Volunteer name is required.");

      return;
    }

    setVolunteerSubmitting(true);

    try {
      const response = await fetch(
        `${API_URL}/api/volunteers`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name:
              volunteerName.trim(),

            phone:
              volunteerPhone.trim(),

            role:
              volunteerRole.trim(),

            availability:
              volunteerAvailability,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Could not add volunteer"
        );
      }

      alert(
        "Volunteer added successfully."
      );

      setVolunteerName("");
      setVolunteerPhone("");
      setVolunteerRole("");
      setVolunteerAvailability(
        "Available"
      );

      fetchVolunteers();
      fetchVolunteerSummary();
    } catch (error) {
      console.error(
        "Create volunteer error:",
        error
      );

      alert(error.message);
    } finally {
      setVolunteerSubmitting(false);
    }
  };

  // =====================================================
  // UPDATE VOLUNTEER AVAILABILITY
  // =====================================================

  const updateVolunteerAvailability = async (
    volunteerId,
    availability
  ) => {
    try {
      const response = await fetch(
        `${API_URL}/api/volunteers/${volunteerId}/availability`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            availability,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Could not update availability"
        );
      }

      fetchVolunteers();
      fetchVolunteerSummary();
    } catch (error) {
      console.error(
        "Availability update error:",
        error
      );

      alert(error.message);
    }
  };

  // =====================================================
  // UPDATE VOLUNTEER STATUS
  // =====================================================

  const updateVolunteerStatus = async (
    volunteerId,
    status
  ) => {
    try {
      const response = await fetch(
        `${API_URL}/api/volunteers/${volunteerId}/status`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Could not update volunteer status"
        );
      }

      fetchVolunteers();
      fetchVolunteerSummary();
    } catch (error) {
      console.error(
        "Volunteer status error:",
        error
      );

      alert(error.message);
    }
  };

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    fetchMealHistory();

    fetchDonations();
    fetchDonationSummary();

    fetchVolunteers();
    fetchVolunteerSummary();
  }, []);

  // =====================================================
  // DASHBOARD VIEW
  // =====================================================

  const renderDashboard = () => {
    return (
      <div>
        <div className="prediction-heading">
          <div>
            <p className="dashboard-label">
              FOODBRIDGE ADMIN
            </p>

            <h1>
              Welcome to FoodBridge 🌱
            </h1>

            <p>
              Predict demand, reduce food waste,
              manage donations and connect
              volunteers.
            </p>
          </div>
        </div>

        <div className="stat-grid">

          <div className="stat-card">
            <div className="stat-icon prediction">
              ◉
            </div>

            <div>
              <p>
                Meals in History
              </p>

              <strong>
                {mealHistory.length}
              </strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon saved">
              ♡
            </div>

            <div>
              <p>
                Meals Donated
              </p>

              <strong>
                {
                  donationSummary.total_meals_donated
                }
              </strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon prepared">
              🍱
            </div>

            <div>
              <p>
                Available Donations
              </p>

              <strong>
                {
                  donationSummary.available_meals
                }
              </strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon surplus">
              ♧
            </div>

            <div>
              <p>
                Available Volunteers
              </p>

              <strong>
                {
                  volunteerSummary.available
                }
              </strong>
            </div>
          </div>

        </div>

        <div className="dashboard-grid">

          <section className="panel">

            <div className="panel-header">
              <div>
                <p className="dashboard-label">
                  QUICK PREDICTION
                </p>

                <h2>
                  Tomorrow's Meal Demand
                </h2>
              </div>
            </div>

            <input
              type="number"
              min="0"
              placeholder="Expected attendance"
              value={attendance}
              onChange={(event) =>
                setAttendance(
                  event.target.value
                )
              }
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "12px",
              }}
            />

            <button
              className="donate-button"
              onClick={fetchPrediction}
              disabled={predictionLoading}
            >
              {predictionLoading
                ? "Calculating..."
                : "Predict Meals →"}
            </button>

            {prediction && (
              <div
                className="recommendation"
                style={{
                  marginTop: "20px",
                }}
              >
                <p>
                  Recommended meals
                </p>

                <div className="recommendation-number">
                  {
                    prediction.recommended_meals
                  }
                </div>

                <strong>
                  meals
                </strong>

                <p>
                  Predicted demand:{" "}
                  {prediction.predicted_demand}
                  <br />

                  Safety buffer:{" "}
                  {prediction.safety_buffer}
                </p>
              </div>
            )}

          </section>

          <section className="panel">

            <div className="panel-header">
              <div>
                <p className="dashboard-label">
                  DONATIONS
                </p>

                <h2>
                  Donation Overview
                </h2>
              </div>
            </div>

            <p>
              Total donations:{" "}
              {donationSummary.total_donations}
            </p>

            <p>
              Meals donated:{" "}
              {donationSummary.total_meals_donated}
            </p>

            <p>
              Available meals:{" "}
              {donationSummary.available_meals}
            </p>

            <p>
              Claimed meals:{" "}
              {donationSummary.claimed_meals}
            </p>

            <button
              className="small-button"
              onClick={() =>
                setActiveMenu("Donations")
              }
            >
              Manage Donations →
            </button>

          </section>

        </div>
      </div>
    );
  };

  // =====================================================
  // PREDICTIONS VIEW
  // =====================================================

  const renderPredictions = () => {
    return (
      <div className="prediction-page">

        <div className="prediction-heading">
          <div>
            <p className="dashboard-label">
              AI MEAL PREDICTION
            </p>

            <h1>
              Prepare the right amount.
            </h1>

            <p>
              Enter expected attendance and
              FoodBridge will estimate meal demand
              using historical consumption data.
            </p>
          </div>
        </div>

        <section className="panel">

          <div className="panel-header">
            <div>
              <p className="dashboard-label">
                PREDICTION INPUT
              </p>

              <h2>
                Expected Attendance
              </h2>
            </div>
          </div>

          <input
            type="number"
            min="0"
            placeholder="Enter expected attendance"
            value={attendance}
            onChange={(event) =>
              setAttendance(
                event.target.value
              )
            }
            style={{
              width: "100%",
              padding: "14px",
              fontSize: "16px",
            }}
          />

          <button
            className="donate-button"
            onClick={fetchPrediction}
            disabled={predictionLoading}
            style={{
              marginTop: "15px",
            }}
          >
            {predictionLoading
              ? "Calculating..."
              : "Generate Prediction →"}
          </button>

        </section>

        {prediction && (
          <div className="stat-grid">

            <div className="stat-card">
              <p>
                Expected Attendance
              </p>

              <strong>
                {prediction.expected_attendance}
              </strong>
            </div>

            <div className="stat-card">
              <p>
                Historical Average
              </p>

              <strong>
                {prediction.historical_average}
              </strong>
            </div>

            <div className="stat-card">
              <p>
                Predicted Demand
              </p>

              <strong>
                {prediction.predicted_demand}
              </strong>
            </div>

            <div className="stat-card">
              <p>
                Recommended Meals
              </p>

              <strong>
                {prediction.recommended_meals}
              </strong>
            </div>

          </div>
        )}

        {prediction && (
          <section className="panel">

            <h2>
              AI Recommendation
            </h2>

            <div className="recommendation">

              <p>
                FoodBridge recommends preparing:
              </p>

              <div className="recommendation-number">
                {prediction.recommended_meals}
              </div>

              <strong>
                meals for tomorrow
              </strong>

              <p>
                This includes a safety buffer of{" "}
                {prediction.safety_buffer} meals.
              </p>

            </div>

          </section>
        )}

      </div>
    );
  };

  // =====================================================
  // MEALS VIEW
  // =====================================================

  const renderMeals = () => {
    return (
      <div className="prediction-page">

        <div className="prediction-heading">
          <div>
            <p className="dashboard-label">
              MEAL MANAGEMENT
            </p>

            <h1>
              Meal History
            </h1>

            <p>
              Record prepared and consumed meals
              to improve future predictions.
            </p>
          </div>
        </div>

        <div className="dashboard-grid">

          <section className="panel">

            <div className="panel-header">
              <div>
                <p className="dashboard-label">
                  ADD RECORD
                </p>

                <h2>
                  Record Today's Meals
                </h2>
              </div>
            </div>

            <form onSubmit={addMealRecord}>

              <label>
                Date
              </label>

              <input
                type="date"
                value={mealDate}
                onChange={(event) =>
                  setMealDate(
                    event.target.value
                  )
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "15px",
                }}
              />

              <label>
                Meals Prepared
              </label>

              <input
                type="number"
                min="0"
                value={mealPrepared}
                onChange={(event) =>
                  setMealPrepared(
                    event.target.value
                  )
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "15px",
                }}
              />

              <label>
                Meals Consumed
              </label>

              <input
                type="number"
                min="0"
                value={mealConsumed}
                onChange={(event) =>
                  setMealConsumed(
                    event.target.value
                  )
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "15px",
                }}
              />

              <button
                type="submit"
                className="donate-button"
                disabled={mealSubmitting}
              >
                {mealSubmitting
                  ? "Saving..."
                  : "Save Meal Record →"}
              </button>

            </form>

          </section>

          <section className="panel">

            <div className="panel-header">
              <div>
                <p className="dashboard-label">
                  INFORMATION
                </p>

                <h2>
                  Why track meals?
                </h2>
              </div>
            </div>

            <p>
              FoodBridge uses historical meal
              consumption to improve demand
              prediction.
            </p>

            <p>
              The more accurate the historical
              data, the better the system can
              estimate future demand.
            </p>

          </section>

        </div>

        <section className="historical-section">

          <div className="historical-heading">

            <div>
              <p className="dashboard-label">
                HISTORY
              </p>

              <h2>
                Meal Records
              </h2>
            </div>

            <button
              className="small-button"
              onClick={fetchMealHistory}
            >
              ↻ Refresh
            </button>

          </div>

          <div className="historical-table">

            <div className="table-row table-header">
              <span>Date</span>
              <span>Day</span>
              <span>Prepared</span>
              <span>Consumed</span>
              <span>Surplus</span>
            </div>

            {mealHistoryLoading ? (
              <div className="table-row">
                <span>
                  Loading...
                </span>
              </div>
            ) : mealHistory.length === 0 ? (
              <div className="table-row">
                <span>
                  No meal records yet.
                </span>
              </div>
            ) : (
              mealHistory.map((meal) => (
                <div
                  className="table-row"
                  key={meal.id}
                >
                  <span>
                    {meal.meal_date}
                  </span>

                  <span>
                    {meal.day_name}
                  </span>

                  <span>
                    {meal.meals_prepared}
                  </span>

                  <span>
                    {meal.meals_consumed}
                  </span>

                  <strong>
                    {
                      meal.meals_prepared -
                      meal.meals_consumed
                    }
                  </strong>
                </div>
              ))
            )}

          </div>

        </section>

      </div>
    );
  };

  // =====================================================
  // DONATIONS VIEW
  // =====================================================

  const renderDonations = () => {
    return (
      <div className="prediction-page">

        <div className="prediction-heading">

          <div>
            <p className="dashboard-label">
              DONATION MANAGEMENT
            </p>

            <h1>
              Turn surplus into meals.
            </h1>

            <p>
              Convert available surplus food
              into donation records and track
              their status.
            </p>
          </div>

        </div>

        <div className="stat-grid">

          <div className="stat-card">
            <p>
              Total Donations
            </p>

            <strong>
              {donationSummary.total_donations}
            </strong>
          </div>

          <div className="stat-card">
            <p>
              Meals Donated
            </p>

            <strong>
              {donationSummary.total_meals_donated}
            </strong>
          </div>

          <div className="stat-card">
            <p>
              Available
            </p>

            <strong>
              {donationSummary.available_meals}
            </strong>
          </div>

          <div className="stat-card">
            <p>
              Claimed
            </p>

            <strong>
              {donationSummary.claimed_meals}
            </strong>
          </div>

        </div>

        <div className="dashboard-grid">

          <section className="panel">

            <div className="panel-header">
              <div>
                <p className="dashboard-label">
                  CREATE DONATION
                </p>

                <h2>
                  Donate Surplus Meals
                </h2>
              </div>
            </div>

            <form onSubmit={createDonation}>

              <label>
                Donation Date
              </label>

              <input
                type="date"
                value={donationDate}
                onChange={(event) =>
                  setDonationDate(
                    event.target.value
                  )
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "15px",
                }}
              />

              <label>
                Number of Meals
              </label>

              <input
                type="number"
                min="1"
                value={donationMeals}
                onChange={(event) =>
                  setDonationMeals(
                    event.target.value
                  )
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "15px",
                }}
              />

              <label>
                Description
              </label>

              <textarea
                placeholder="Example: Extra rice and vegetables"
                value={donationDescription}
                onChange={(event) =>
                  setDonationDescription(
                    event.target.value
                  )
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  minHeight: "100px",
                  marginBottom: "15px",
                }}
              />

              <button
                type="submit"
                className="donate-button"
                disabled={
                  donationSubmitting
                }
              >
                {donationSubmitting
                  ? "Creating..."
                  : "Create Donation →"}
              </button>

            </form>

          </section>

          <section className="panel">

            <p className="dashboard-label">
              SURPLUS
            </p>

            <h2>
              Available Food
            </h2>

            <div className="recommendation">

              <p>
                Currently available for
                donation
              </p>

              <div className="recommendation-number">
                {donationSummary.available_meals}
              </div>

              <strong>
                meals
              </strong>

            </div>

            <p>
              FoodBridge prevents donations
              from exceeding the available
              surplus.
            </p>

          </section>

        </div>

        <section className="historical-section">

          <div className="historical-heading">

            <div>
              <p className="dashboard-label">
                DONATION HISTORY
              </p>

              <h2>
                Donations
              </h2>
            </div>

            <button
              className="small-button"
              onClick={() => {
                fetchDonations();
                fetchDonationSummary();
              }}
            >
              ↻ Refresh
            </button>

          </div>

          <div className="historical-table">

            <div className="table-row table-header">
              <span>Date</span>
              <span>Meals</span>
              <span>Description</span>
              <span>Status</span>
              <span>Update</span>
            </div>

            {donationLoading ? (
              <div className="table-row">
                <span>
                  Loading...
                </span>
              </div>
            ) : donations.length === 0 ? (
              <div className="table-row">
                <span>
                  No donations yet.
                </span>
              </div>
            ) : (
              donations.map((donation) => (
                <div
                  className="table-row"
                  key={donation.id}
                >

                  <span>
                    {donation.donation_date}
                  </span>

                  <strong>
                    {donation.meals}
                  </strong>

                  <span>
                    {donation.description ||
                      "—"}
                  </span>

                  <span>
                    {donation.status}
                  </span>

                  <select
                    value={donation.status}
                    onChange={(event) =>
                      updateDonationStatus(
                        donation.id,
                        event.target.value
                      )
                    }
                    style={{
                      padding: "8px",
                    }}
                  >
                    <option value="Available">
                      Available
                    </option>

                    <option value="Claimed">
                      Claimed
                    </option>

                    <option value="Collected">
                      Collected
                    </option>

                    <option value="Cancelled">
                      Cancelled
                    </option>
                  </select>

                </div>
              ))
            )}

          </div>

        </section>

      </div>
    );
  };

  // =====================================================
  // VOLUNTEERS VIEW
  // =====================================================

  const renderVolunteers = () => {
    return (
      <div className="prediction-page">

        <div className="prediction-heading">

          <div>
            <p className="dashboard-label">
              VOLUNTEER MANAGEMENT
            </p>

            <h1>
              People make the difference.
            </h1>

            <p>
              Manage volunteers and track who
              is available to help with food
              collection and distribution.
            </p>
          </div>

        </div>

        <div className="stat-grid">

          <div className="stat-card">
            <p>
              Total Volunteers
            </p>

            <strong>
              {volunteerSummary.total}
            </strong>
          </div>

          <div className="stat-card">
            <p>
              Available
            </p>

            <strong>
              {volunteerSummary.available}
            </strong>
          </div>

          <div className="stat-card">
            <p>
              Busy
            </p>

            <strong>
              {volunteerSummary.busy}
            </strong>
          </div>

          <div className="stat-card">
            <p>
              Unavailable
            </p>

            <strong>
              {volunteerSummary.unavailable}
            </strong>
          </div>

        </div>

        <div className="dashboard-grid">

          <section className="panel">

            <div className="panel-header">

              <div>
                <p className="dashboard-label">
                  ADD VOLUNTEER
                </p>

                <h2>
                  Register a Volunteer
                </h2>
              </div>

            </div>

            <form onSubmit={createVolunteer}>

              <label>
                Volunteer Name
              </label>

              <input
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={volunteerName}
                onChange={(event) =>
                  setVolunteerName(
                    event.target.value
                  )
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "15px",
                }}
              />

              <label>
                Phone
              </label>

              <input
                type="text"
                placeholder="Phone number"
                value={volunteerPhone}
                onChange={(event) =>
                  setVolunteerPhone(
                    event.target.value
                  )
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "15px",
                }}
              />

              <label>
                Role
              </label>

              <input
                type="text"
                placeholder="e.g. Food Collection"
                value={volunteerRole}
                onChange={(event) =>
                  setVolunteerRole(
                    event.target.value
                  )
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "15px",
                }}
              />

              <label>
                Availability
              </label>

              <select
                value={
                  volunteerAvailability
                }
                onChange={(event) =>
                  setVolunteerAvailability(
                    event.target.value
                  )
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom: "15px",
                }}
              >

                <option value="Available">
                  Available
                </option>

                <option value="Busy">
                  Busy
                </option>

                <option value="Unavailable">
                  Unavailable
                </option>

              </select>

              <button
                type="submit"
                className="donate-button"
                disabled={
                  volunteerSubmitting
                }
              >
                {volunteerSubmitting
                  ? "Adding..."
                  : "Add Volunteer →"}
              </button>

            </form>

          </section>

          <section className="panel">

            <p className="dashboard-label">
              VOLUNTEER NETWORK
            </p>

            <h2>
              Available Volunteers
            </h2>

            <div className="recommendation">

              <p>
                Volunteers currently available
              </p>

              <div className="recommendation-number">
                {volunteerSummary.available}
              </div>

              <strong>
                ready to help
              </strong>

            </div>

            <p>
              Keep volunteer availability
              updated so FoodBridge can quickly
              identify people ready to help.
            </p>

          </section>

        </div>

        <section className="historical-section">

          <div className="historical-heading">

            <div>
              <p className="dashboard-label">
                VOLUNTEER LIST
              </p>

              <h2>
                Registered Volunteers
              </h2>
            </div>

            <button
              className="small-button"
              onClick={() => {
                fetchVolunteers();
                fetchVolunteerSummary();
              }}
            >
              ↻ Refresh
            </button>

          </div>

          <div className="historical-table">

            <div className="table-row table-header">

              <span>
                Name
              </span>

              <span>
                Phone
              </span>

              <span>
                Role
              </span>

              <span>
                Availability
              </span>

              <span>
                Status
              </span>

            </div>

            {volunteerLoading ? (

              <div className="table-row">
                <span>
                  Loading...
                </span>
              </div>

            ) : volunteers.length === 0 ? (

              <div className="table-row">
                <span>
                  No volunteers yet.
                </span>
              </div>

            ) : (

              volunteers.map((volunteer) => (

                <div
                  className="table-row"
                  key={volunteer.id}
                >

                  <strong>
                    {volunteer.name}
                  </strong>

                  <span>
                    {volunteer.phone ||
                      "Not provided"}
                  </span>

                  <span>
                    {volunteer.role ||
                      "Volunteer"}
                  </span>

                  <select
                    value={
                      volunteer.availability
                    }
                    onChange={(event) =>
                      updateVolunteerAvailability(
                        volunteer.id,
                        event.target.value
                      )
                    }
                    style={{
                      padding: "8px",
                    }}
                  >

                    <option value="Available">
                      Available
                    </option>

                    <option value="Busy">
                      Busy
                    </option>

                    <option value="Unavailable">
                      Unavailable
                    </option>

                  </select>

                  <select
                    value={
                      volunteer.status
                    }
                    onChange={(event) =>
                      updateVolunteerStatus(
                        volunteer.id,
                        event.target.value
                      )
                    }
                    style={{
                      padding: "8px",
                    }}
                  >

                    <option value="Active">
                      Active
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>

                  </select>

                </div>

              ))

            )}

          </div>

        </section>

      </div>
    );
  };

  // =====================================================
  // MAIN CONTENT
  // =====================================================

  const renderContent = () => {
    switch (activeMenu) {
      case "Predictions":
        return renderPredictions();

      case "Meals":
        return renderMeals();

      case "Donations":
        return renderDonations();

      case "Volunteers":
        return renderVolunteers();

      case "Dashboard":
      default:
        return renderDashboard();
    }
  };

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="dashboard-layout">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="sidebar-logo">
          🌱 FoodBridge
        </div>

        <p className="sidebar-label">
          ADMIN
        </p>

        <nav>

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

              <span className="menu-icon">
                {item.icon}
              </span>

              <span>
                {item.name}
              </span>

            </button>

          ))}

        </nav>

        <div className="sidebar-bottom">

          <button
            className="menu-item"
            onClick={() =>
              navigate("/")
            }
          >
            ← Home
          </button>

          <button
            className="menu-item"
            onClick={() =>
              navigate("/login")
            }
          >
            ⇥ Logout
          </button>

        </div>

      </aside>


      {/* MAIN AREA */}

      <main className="dashboard-main">

        <header className="dashboard-topbar">

          <div>
            <span>
              FoodBridge
            </span>

            <span>
              /
            </span>

            <strong>
              {activeMenu}
            </strong>
          </div>

          <div>
            🌱 Admin
          </div>

        </header>


        <div className="dashboard-content">

          {renderContent()}

        </div>

      </main>

    </div>
  );
}

export default AdminDashboard;