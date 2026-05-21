from flask import Flask, request, jsonify
from flask_cors import CORS
from cracker import crack_password

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "Backend running"

@app.route('/check', methods=['POST'])
def check():
    data = request.json
    password = data.get("password")

    result = crack_password(password)

    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)