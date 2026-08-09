import { useEffect, useState } from "react";

function MealHistory() {

  const [meals, setMeals] = useState([]);

  const [form, setForm] = useState({
    meal_date: "",
    meals_prepared: "",
    meals_consumed: ""
  });

  const [loading, setLoading] = useState(false);

  // ----------------------------------------
  // GET DATA FROM FLASK
  // ----------------------------------------

  const fetchMeals = async () => {

    try {

      const response = await fetch(
        "https://hackmatrixfood.onrender.com/api/meals/history"
      );

      const data = await response.json();

      setMeals(data);

    } catch (error) {

      console.error(
        "Could not fetch meal history:",
        error
      );

    }
  };


  // Load data when page opens
  useEffect(() => {

    fetchMeals();

  }, []);


  // ----------------------------------------
  // HANDLE INPUT
  // ----------------------------------------

  const handleChange = (event) => {

    setForm({
      ...form,
      [event.target.name]: event.target.value
    });

  };


  // ----------------------------------------
  // SUBMIT RECORD
  // ----------------------------------------

  const handleSubmit = async (event) => {

    event.preventDefault();

    if (
      !form.meal_date ||
      !form.meals_prepared ||
      !form.meals_consumed
    ) {

      alert("Please fill all fields.");

      return;
    }


    setLoading(true);


    const date = new Date(form.meal_date);

    const dayName = date.toLocaleDateString(
      "en-US",
      {
        weekday: "long"
      }
    );


    try {

      const response = await fetch(
        "https://hackmatrixfood.onrender.com/api/meals/history",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            meal_date: form.meal_date,

            day_name: dayName,

            meals_prepared:
              Number(form.meals_prepared),

            meals_consumed:
              Number(form.meals_consumed)

          })
        }
      );


      const result = await response.json();


      if (!response.ok) {

        throw new Error(
          result.message || "Failed to save record"
        );

      }


      alert(
        "Meal record saved successfully 🌱"
      );


      setForm({
        meal_date: "",
        meals_prepared: "",
        meals_consumed: ""
      });


      fetchMeals();


    } catch (error) {

      console.error(error);

      alert(
        "Could not save meal record."
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="meal-history-page">

      <div className="meal-history-header">

        <div>

          <p className="dashboard-label">
            FOODBRIDGE DATA
          </p>

          <h1>
            Meal History
          </h1>

          <p>
            Record daily meal preparation and
            consumption to improve future demand
            predictions.
          </p>

        </div>

      </div>


      {/* -------------------------------- */}
      {/* ADD RECORD */}
      {/* -------------------------------- */}

      <div className="meal-history-grid">


        <div className="meal-form-card">

          <h2>
            Add Meal Record
          </h2>

          <p>
            Enter today's kitchen data.
          </p>


          <form onSubmit={handleSubmit}>


            <label>
              Date
            </label>

            <input
              type="date"
              name="meal_date"
              value={form.meal_date}
              onChange={handleChange}
            />


            <label>
              Meals Prepared
            </label>

            <input
              type="number"
              name="meals_prepared"
              min="0"
              placeholder="e.g. 500"
              value={form.meals_prepared}
              onChange={handleChange}
            />


            <label>
              Meals Consumed
            </label>

            <input
              type="number"
              name="meals_consumed"
              min="0"
              placeholder="e.g. 487"
              value={form.meals_consumed}
              onChange={handleChange}
            />


            <button
              type="submit"
              disabled={loading}
            >

              {loading
                ? "Saving..."
                : "Save Meal Record →"}

            </button>

          </form>

        </div>


        {/* -------------------------------- */}
        {/* SUMMARY */}
        {/* -------------------------------- */}

        <div className="meal-summary-card">

          <div className="summary-icon">
            🌱
          </div>

          <h2>
            Why we collect this data
          </h2>

          <p>
            FoodBridge learns from previous meal
            demand to help kitchens prepare the
            right amount of food.
          </p>


          <div className="summary-point">

            <strong>
              📊 Historical demand
            </strong>

            <span>
              Understand meal patterns by day.
            </span>

          </div>


          <div className="summary-point">

            <strong>
              🤖 Better predictions
            </strong>

            <span>
              Improve future meal recommendations.
            </span>

          </div>


          <div className="summary-point">

            <strong>
              ♻ Less food waste
            </strong>

            <span>
              Avoid unnecessary food preparation.
            </span>

          </div>

        </div>

      </div>


      {/* -------------------------------- */}
      {/* HISTORY TABLE */}
      {/* -------------------------------- */}

      <div className="meal-history-table-section">

        <div className="table-section-heading">

          <div>

            <p className="dashboard-label">
              DATABASE
            </p>

            <h2>
              Previous Records
            </h2>

          </div>

          <span>
            {meals.length} records
          </span>

        </div>


        <div className="meal-history-table">

          <div className="meal-table-row meal-table-header">

            <span>
              Date
            </span>

            <span>
              Day
            </span>

            <span>
              Prepared
            </span>

            <span>
              Consumed
            </span>

            <span>
              Surplus
            </span>

          </div>


          {meals.length === 0 ? (

            <div className="empty-history">
              No meal records yet.
            </div>

          ) : (

            meals.map((meal) => {

              const surplus =
                meal.meals_prepared -
                meal.meals_consumed;


              return (

                <div
                  className="meal-table-row"
                  key={meal.id}
                >

                  <span>
                    {meal.meal_date}
                  </span>

                  <strong>
                    {meal.day_name}
                  </strong>

                  <span>
                    {meal.meals_prepared}
                  </span>

                  <span>
                    {meal.meals_consumed}
                  </span>

                  <span
                    className={
                      surplus > 0
                        ? "surplus-value"
                        : "no-surplus"
                    }
                  >

                    {surplus}

                  </span>

                </div>

              );

            })

          )}

        </div>

      </div>

    </div>

  );

}

export default MealHistory;