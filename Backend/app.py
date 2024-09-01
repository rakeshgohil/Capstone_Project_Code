from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
from user import User

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Create an instance of the User class
user_model = User()

@app.route('/register', methods=['POST'])
def register_user():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')

    if not username or not password or not email:
        return jsonify({"error": "All fields are required"}), 400

    response, status = user_model.create_user(username, password, email)
    return jsonify(response), status

@app.route('/login', methods=['POST'])
def login_user():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    response, status = user_model.login_user(username, password)
    return jsonify(response), status

if __name__ == '__main__':
    app.run(debug=True)
