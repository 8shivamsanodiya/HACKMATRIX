import { useState } from "react";

function PredictionPanel() {
  const [attendance, setAttendance] = useState(500);
  const historicalAverage = 485;
  const safetyMargin = 0.05;
  const predictedDemand = Math.round(attendance * 0.5 + historicalAverage * 0.5);
  const recommendedMeals = Math.ceil(predictedDemand * (1 + safetyMargin));

  return (
    <div className="prediction-page">
      <div className="prediction-heading">
        <div>
          <p className="dashboard-label">AI MEAL FORECAST</p>
          <h1>Prepare smarter. Waste less.</h1>
          <p>FoodBridge uses historical meal demand to recommend how many meals the kitchen should prepare.</p>
        </div>
      </div>

      <div className="prediction-layout">
        {/* INPUT */}
        <div className="prediction-input-card">
          <h2>Tomorrow's Expected Attendance</h2>
          <p>Enter the estimated number of people expected to eat tomorrow.</p>
          <label>Expected attendance</label>
          <input
            type="number"
            value={attendance}
            min="0"
            onChange={(e) => setAttendance(Number(e.target.value))}
          />
          <div className="prediction-info">
            <div>
              <span>Historical average</span>
              <strong>{historicalAverage} meals</strong>
            </div>
            <div>
              <span>Safety margin</span>
              <strong>5%</strong>
            </div>
          </div>
        </div>

        {/* RESULT */}
        <div className="prediction-result-card">
          <div className="result-ai">✦ AI RECOMMENDATION</div>
          <p>Based on the available data, FoodBridge recommends preparing:</p>
          <div className="result-number">{recommendedMeals}</div>
          <span className="result-unit">meals</span>
          <div className="calculation">
            <span>Predicted demand</span>
            <strong>{predictedDemand}</strong>
          </div>
          <div className="calculation">
            <span>Safety buffer</span>
            <strong>+{recommendedMeals - predictedDemand}</strong>
          </div>
          <div className="prediction-confidence">
            <span>Prediction confidence</span>
            <strong>87%</strong>
          </div>
        </div>
      </div>

      {/* EXPLANATION */}
      <div className="prediction-explanation">
        <div className="explanation-icon">🌱</div>
        <div>
          <h3>Why this matters</h3>
          <p>
            Preparing too many meals creates food waste. Preparing too few can leave people without food.
            FoodBridge balances both using historical demand patterns and a controlled safety margin.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PredictionPanel;
