
from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3

app = Flask(__name__)

CORS(app)

DATABASE = "foodbridge.db"


# =========================================================
# DATABASE CONNECTION
# =========================================================

def get_db_connection():
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
    return connection


# =========================================================
# CREATE DATABASE
# =========================================================

def initialize_database():

    connection = get_db_connection()

    connection.execute("""
        CREATE TABLE IF NOT EXISTS meal_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            meal_date TEXT NOT NULL,
            day_name TEXT NOT NULL,
            meals_prepared INTEGER NOT NULL,
            meals_consumed INTEGER NOT NULL
        )
    """)

    connection.commit()
    connection.close()


# =========================================================
# HOME
# =========================================================

@app.route("/")
def home():

    return jsonify({
        "message": "FoodBridge API is running 🌱"
    })


# =========================================================
# ADD MEAL RECORD
# =========================================================

@app.route("/api/meals/history", methods=["POST"])
def add_meal_record():

    data = request.get_json() or {}

    meal_date = data.get("meal_date")
    day_name = data.get("day_name")
    meals_prepared = data.get("meals_prepared")
    meals_consumed = data.get("meals_consumed")

    if not meal_date or not day_name:
        return jsonify({
            "error": "meal_date and day_name are required"
        }), 400

    try:
        meals_prepared = int(meals_prepared)
        meals_consumed = int(meals_consumed)
    except (TypeError, ValueError):

        return jsonify({
            "error": "Meal values must be numbers"
        }), 400

    if meals_prepared < 0 or meals_consumed < 0:

        return jsonify({
            "error": "Meal values cannot be negative"
        }), 400

    connection = get_db_connection()

    cursor = connection.execute("""
        INSERT INTO meal_history (
            meal_date,
            day_name,
            meals_prepared,
            meals_consumed
        )
        VALUES (?, ?, ?, ?)
    """, (
        meal_date,
        day_name,
        meals_prepared,
        meals_consumed
    ))

    connection.commit()

    new_id = cursor.lastrowid

    connection.close()

    return jsonify({
        "message": "Meal record added successfully 🌱",
        "id": new_id
    }), 201


# =========================================================
# GET ALL MEAL HISTORY
# =========================================================

@app.route("/api/meals/history", methods=["GET"])
def get_meal_history():

    connection = get_db_connection()

    meals = connection.execute("""
        SELECT *
        FROM meal_history
        ORDER BY meal_date DESC
    """).fetchall()

    connection.close()

    return jsonify([
        dict(meal)
        for meal in meals
    ])


# =========================================================
# DAY-WISE HISTORICAL AVERAGE
# =========================================================

@app.route("/api/meals/prediction/<day_name>")
def get_day_prediction(day_name):

    connection = get_db_connection()

    result = connection.execute("""
        SELECT
            AVG(meals_consumed) AS average_consumed,
            COUNT(*) AS record_count
        FROM meal_history
        WHERE LOWER(day_name) = LOWER(?)
    """, (day_name,)).fetchone()

    connection.close()

    average = result["average_consumed"]
    record_count = result["record_count"]

    if average is None:
        average = 0

    return jsonify({
        "day": day_name,
        "historical_average": round(average),
        "records": record_count
    })


# =========================================================
# SMART MEAL PREDICTION
# =========================================================

@app.route("/api/prediction", methods=["POST"])
def smart_prediction():

    data = request.get_json() or {}

    attendance = data.get("attendance", 0)
    day_name = data.get("day_name", "")

    # -----------------------------------------------------
    # Convert attendance safely
    # -----------------------------------------------------

    try:
        attendance = int(attendance)
    except (TypeError, ValueError):
        attendance = 0

    attendance = max(0, attendance)


    # =====================================================
    # ZERO ATTENDANCE
    # =====================================================

    if attendance == 0:

        return jsonify({
            "day": day_name,
            "expected_attendance": 0,
            "historical_average": 0,
            "historical_records": 0,
            "predicted_demand": 0,
            "safety_buffer": 0,
            "recommended_meals": 0
        })


    # =====================================================
    # GET HISTORICAL DATA
    # =====================================================

    connection = get_db_connection()

    result = connection.execute("""
        SELECT
            AVG(meals_consumed) AS average_consumed,
            COUNT(*) AS record_count
        FROM meal_history
        WHERE LOWER(day_name) = LOWER(?)
    """, (day_name,)).fetchone()

    connection.close()

    historical_average = result["average_consumed"]
    historical_records = result["record_count"]


    # =====================================================
    # NO HISTORICAL DATA
    # =====================================================

    if historical_average is None:

        historical_average = 0

        predicted_demand = attendance


    # =====================================================
    # HISTORICAL DATA EXISTS
    # =====================================================

    else:

        historical_average = round(
            historical_average
        )

        # Attendance is the main signal.
        # Historical data makes only a small adjustment.

        difference = (
            historical_average - attendance
        )

        adjustment = round(
            difference * 0.10
        )

        predicted_demand = (
            attendance + adjustment
        )

        # Keep prediction within +/- 10%
        # of expected attendance.

        minimum_demand = round(
            attendance * 0.90
        )

        maximum_demand = round(
            attendance * 1.10
        )

        predicted_demand = max(
            minimum_demand,
            predicted_demand
        )

        predicted_demand = min(
            maximum_demand,
            predicted_demand
        )


    # =====================================================
    # SAFETY BUFFER
    # =====================================================

    safety_buffer = round(
        predicted_demand * 0.05
    )

    recommended_meals = (
        predicted_demand +
        safety_buffer
    )


    # =====================================================
    # FINAL ZERO PROTECTION
    # =====================================================

    if attendance == 0:

        predicted_demand = 0
        safety_buffer = 0
        recommended_meals = 0


    # =====================================================
    # RESPONSE
    # =====================================================

    return jsonify({
        "day": day_name,
        "expected_attendance": attendance,
        "historical_average": historical_average,
        "historical_records": historical_records,
        "predicted_demand": predicted_demand,
        "safety_buffer": safety_buffer,
        "recommended_meals": recommended_meals
    })


# =========================================================
# WEEKLY HISTORY SUMMARY
# =========================================================

@app.route("/api/meals/history/summary")
def get_meal_history_summary():

    connection = get_db_connection()

    meals = connection.execute("""
        SELECT
            day_name,
            AVG(meals_prepared) AS average_prepared,
            AVG(meals_consumed) AS average_consumed,
            COUNT(*) AS record_count
        FROM meal_history
        GROUP BY LOWER(day_name)
        ORDER BY
            CASE LOWER(day_name)
                WHEN 'monday' THEN 1
                WHEN 'tuesday' THEN 2
                WHEN 'wednesday' THEN 3
                WHEN 'thursday' THEN 4
                WHEN 'friday' THEN 5
                WHEN 'saturday' THEN 6
                WHEN 'sunday' THEN 7
                ELSE 8
            END
    """).fetchall()

    connection.close()

    result = []

    for meal in meals:

        result.append({
            "day": meal["day_name"],
            "meals_prepared": round(
                meal["average_prepared"] or 0
            ),
            "meals_consumed": round(
                meal["average_consumed"] or 0
            ),
            "record_count": meal["record_count"]
        })

    return jsonify(result)


# =========================================================
# START SERVER
# =========================================================

if __name__ == "__main__":

    initialize_database()

    app.run(
        debug=True,
        port=5000
    )
