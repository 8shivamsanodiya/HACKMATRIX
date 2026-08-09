
from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3

import os

app = Flask(__name__)

CORS(app)





DATABASE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "foodbridge.db")


def get_db_connection():
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
    return connection

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

    connection.execute("""
        CREATE TABLE IF NOT EXISTS donations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            donation_date TEXT NOT NULL,
            meals INTEGER NOT NULL,
            description TEXT,
            status TEXT NOT NULL DEFAULT 'Available',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    connection.execute("""
        CREATE TABLE IF NOT EXISTS volunteers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT,
            availability TEXT NOT NULL DEFAULT 'Available',
            role TEXT,
            status TEXT NOT NULL DEFAULT 'Active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    connection.commit()
    connection.close()

@app.route("/")
def home():

    return jsonify({
        "message": "FoodBridge API is running 🌱"
    })

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

    if meals_consumed > meals_prepared:

        return jsonify({
            "error": "Meals consumed cannot be greater than meals prepared"
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

@app.route("/api/prediction", methods=["POST"])
def smart_prediction():

    data = request.get_json() or {}

    attendance = data.get("attendance", 0)
    day_name = data.get("day_name", "")

    try:
        attendance = int(attendance)
    except (TypeError, ValueError):
        attendance = 0

    attendance = max(0, attendance)

    connection = get_db_connection()

    result = connection.execute("""
        SELECT
            AVG(meals_consumed) AS average_consumed,
            COUNT(*) AS record_count
        FROM meal_history
        WHERE LOWER(day_name) = LOWER(?)
    """, (day_name,)).fetchone()

    connection.close()

    historical_average = result["average_consumed"] if result else None
    historical_records = result["record_count"] if result else 0


    if attendance == 0:
        if historical_average is not None and historical_records > 0:
            historical_average = round(historical_average)
            predicted_demand = historical_average
            safety_buffer = round(predicted_demand * 0.05)
            recommended_meals = predicted_demand + safety_buffer

            return jsonify({
                "day": day_name,
                "expected_attendance": 0,
                "historical_average": historical_average,
                "historical_records": historical_records,
                "predicted_demand": predicted_demand,
                "safety_buffer": safety_buffer,
                "recommended_meals": recommended_meals,
                "prediction_type": "historical_baseline"
            })
        else:
            return jsonify({
                "day": day_name,
                "expected_attendance": 0,
                "historical_average": 0,
                "historical_records": 0,
                "predicted_demand": 0,
                "safety_buffer": 0,
                "recommended_meals": 0,
                "prediction_type": "no_data"
            })


    if historical_average is None:
        historical_average = 0
        predicted_demand = attendance
    else:
        historical_average = round(historical_average)
        difference = historical_average - attendance
        adjustment = round(difference * 0.10)
        predicted_demand = attendance + adjustment

        
        minimum_demand = round(attendance * 0.90)
        maximum_demand = round(attendance * 1.10)
        predicted_demand = max(minimum_demand, predicted_demand)
        predicted_demand = min(maximum_demand, predicted_demand)

    safety_buffer = round(predicted_demand * 0.05)
    recommended_meals = predicted_demand + safety_buffer

    return jsonify({
        "day": day_name,
        "expected_attendance": attendance,
        "historical_average": historical_average,
        "historical_records": historical_records,
        "predicted_demand": predicted_demand,
        "safety_buffer": safety_buffer,
        "recommended_meals": recommended_meals,
        "prediction_type": "attendance_adjusted"
    })

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

@app.route("/api/donations", methods=["POST"])
def create_donation():

    data = request.get_json() or {}

    donation_date = data.get("donation_date")
    meals = data.get("meals")
    description = data.get("description", "")

    if not donation_date:

        return jsonify({
            "error": "donation_date is required"
        }), 400

    try:

        meals = int(meals)

    except (TypeError, ValueError):

        return jsonify({
            "error": "Meals must be a valid number"
        }), 400

    if meals <= 0:

        return jsonify({
            "error": "Donation meals must be greater than 0"
        }), 400

    connection = get_db_connection()

    result = connection.execute("""
        SELECT
            COALESCE(
                SUM(meals_prepared - meals_consumed),
                0
            ) AS total_surplus
        FROM meal_history
    """).fetchone()

    total_surplus = int(
        result["total_surplus"] or 0
    )

    donated_result = connection.execute("""
        SELECT
            COALESCE(SUM(meals), 0) AS donated_meals
        FROM donations
        WHERE status != 'Cancelled'
    """).fetchone()

    donated_meals = int(
        donated_result["donated_meals"] or 0
    )

    available_surplus = max(
        0,
        total_surplus - donated_meals
    )

    if meals > available_surplus:

        connection.close()

        return jsonify({
            "error": (
                f"Only {available_surplus} surplus meals "
                "are currently available."
            )
        }), 400

    cursor = connection.execute("""
        INSERT INTO donations (
            donation_date,
            meals,
            description,
            status
        )
        VALUES (?, ?, ?, ?)
    """, (
        donation_date,
        meals,
        description,
        "Available"
    ))

    connection.commit()

    donation_id = cursor.lastrowid

    connection.close()

    return jsonify({
        "message": "Donation created successfully 🌱",
        "id": donation_id,
        "meals": meals,
        "status": "Available"
    }), 201


@app.route("/api/donations", methods=["GET"])
def get_donations():

    connection = get_db_connection()

    donations = connection.execute("""
        SELECT *
        FROM donations
        ORDER BY donation_date DESC, id DESC
    """).fetchall()

    connection.close()

    return jsonify([
        dict(donation)
        for donation in donations
    ])


@app.route("/api/donations/<int:donation_id>/status", methods=["PUT"])
def update_donation_status(donation_id):

    data = request.get_json() or {}

    status = data.get("status")

    allowed_statuses = [
        "Available",
        "Claimed",
        "Collected",
        "Cancelled"
    ]

    if status not in allowed_statuses:

        return jsonify({
            "error": (
                "Invalid status. Allowed values: "
                "Available, Claimed, Collected, Cancelled"
            )
        }), 400

    connection = get_db_connection()

    donation = connection.execute("""
        SELECT *
        FROM donations
        WHERE id = ?
    """, (donation_id,)).fetchone()

    if donation is None:

        connection.close()

        return jsonify({
            "error": "Donation not found"
        }), 404

    connection.execute("""
        UPDATE donations
        SET status = ?
        WHERE id = ?
    """, (
        status,
        donation_id
    ))

    connection.commit()

    connection.close()

    return jsonify({
        "message": "Donation status updated successfully",
        "id": donation_id,
        "status": status
    })

@app.route("/api/donations/summary", methods=["GET"])
def get_donation_summary():

    connection = get_db_connection()

    result = connection.execute("""
        SELECT
            COUNT(*) AS total_donations,
            COALESCE(SUM(meals), 0) AS total_meals_donated
        FROM donations
        WHERE status != 'Cancelled'
    """).fetchone()

    available = connection.execute("""
        SELECT
            COALESCE(SUM(meals), 0) AS available_meals
        FROM donations
        WHERE status = 'Available'
    """).fetchone()

    claimed = connection.execute("""
        SELECT
            COALESCE(SUM(meals), 0) AS claimed_meals
        FROM donations
        WHERE status IN ('Claimed', 'Collected')
    """).fetchone()

    connection.close()

    return jsonify({
        "total_donations": result["total_donations"],
        "total_meals_donated": result["total_meals_donated"],
        "available_meals": available["available_meals"],
        "claimed_meals": claimed["claimed_meals"]
    })


@app.route("/api/volunteers", methods=["POST"])
def create_volunteer():

    data = request.get_json() or {}

    name = data.get("name")
    phone = data.get("phone", "")
    availability = data.get(
        "availability",
        "Available"
    )
    role = data.get("role", "")

    if not name or not str(name).strip():

        return jsonify({
            "error": "Volunteer name is required"
        }), 400

    name = str(name).strip()

    allowed_availability = [
        "Available",
        "Busy",
        "Unavailable"
    ]

    if availability not in allowed_availability:

        return jsonify({
            "error": (
                "Invalid availability. Allowed values: "
                "Available, Busy, Unavailable"
            )
        }), 400
    
    connection = get_db_connection()

    cursor = connection.execute("""
        INSERT INTO volunteers (
            name,
            phone,
            availability,
            role,
            status
        )
        VALUES (?, ?, ?, ?, ?)
    """, (
        name,
        phone,
        availability,
        role,
        "Active"
    ))

    connection.commit()

    volunteer_id = cursor.lastrowid

    connection.close()

    return jsonify({
        "message": "Volunteer added successfully 🌱",
        "id": volunteer_id
    }), 201


@app.route("/api/volunteers", methods=["GET"])
def get_volunteers():

    connection = get_db_connection()

    volunteers = connection.execute("""
        SELECT *
        FROM volunteers
        ORDER BY id DESC
    """).fetchall()

    connection.close()

    return jsonify([
        dict(volunteer)
        for volunteer in volunteers
    ])

@app.route(
    "/api/volunteers/<int:volunteer_id>/availability",
    methods=["PUT"]
)
def update_volunteer_availability(volunteer_id):

    data = request.get_json() or {}

    availability = data.get("availability")

    allowed_availability = [
        "Available",
        "Busy",
        "Unavailable"
    ]

    if availability not in allowed_availability:

        return jsonify({
            "error": (
                "Invalid availability. Allowed values: "
                "Available, Busy, Unavailable"
            )
        }), 400

    connection = get_db_connection()

    volunteer = connection.execute("""
        SELECT *
        FROM volunteers
        WHERE id = ?
    """, (volunteer_id,)).fetchone()

    if volunteer is None:

        connection.close()

        return jsonify({
            "error": "Volunteer not found"
        }), 404

    connection.execute("""
        UPDATE volunteers
        SET availability = ?
        WHERE id = ?
    """, (
        availability,
        volunteer_id
    ))

    connection.commit()

    connection.close()

    return jsonify({
        "message": "Volunteer availability updated successfully",
        "id": volunteer_id,
        "availability": availability
    })

@app.route(
    "/api/volunteers/<int:volunteer_id>/status",
    methods=["PUT"]
)
def update_volunteer_status(volunteer_id):

    data = request.get_json() or {}

    status = data.get("status")

    allowed_statuses = [
        "Active",
        "Inactive"
    ]

    if status not in allowed_statuses:

        return jsonify({
            "error": (
                "Invalid status. Allowed values: "
                "Active, Inactive"
            )
        }), 400

    connection = get_db_connection()

    volunteer = connection.execute("""
        SELECT *
        FROM volunteers
        WHERE id = ?
    """, (volunteer_id,)).fetchone()

    if volunteer is None:

        connection.close()

        return jsonify({
            "error": "Volunteer not found"
        }), 404

    connection.execute("""
        UPDATE volunteers
        SET status = ?
        WHERE id = ?
    """, (
        status,
        volunteer_id
    ))

    connection.commit()

    connection.close()

    return jsonify({
        "message": "Volunteer status updated successfully",
        "id": volunteer_id,
        "status": status
    })

@app.route("/api/volunteers/summary", methods=["GET"])
def get_volunteer_summary():

    connection = get_db_connection()

    total = connection.execute("""
        SELECT COUNT(*) AS total
        FROM volunteers
    """).fetchone()

    available = connection.execute("""
        SELECT COUNT(*) AS available
        FROM volunteers
        WHERE availability = 'Available'
        AND status = 'Active'
    """).fetchone()

    busy = connection.execute("""
        SELECT COUNT(*) AS busy
        FROM volunteers
        WHERE availability = 'Busy'
        AND status = 'Active'
    """).fetchone()

    unavailable = connection.execute("""
        SELECT COUNT(*) AS unavailable
        FROM volunteers
        WHERE availability = 'Unavailable'
        OR status = 'Inactive'
    """).fetchone()

    connection.close()

    return jsonify({
        "total": total["total"],
        "available": available["available"],
        "busy": busy["busy"],
        "unavailable": unavailable["unavailable"]
    })


initialize_database()


if __name__ == "__main__":

    app.run(
        debug=True,
        port=5000
    )
