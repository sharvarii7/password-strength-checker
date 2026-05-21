# Password Strength Checker 🔐

A simple and interactive web application that evaluates password strength in real-time and helps users create more secure credentials.

The project combines frontend password analysis with a Python Flask backend to simulate real-world password security testing. It analyzes password complexity, estimates crack resistance, detects breached passwords using the RockYou dataset, and provides secure password generation features.

The goal of this project is to promote better password practices and demonstrate how weak or commonly used passwords can be vulnerable to dictionary-based attacks and brute-force cracking techniques.

--------

## FEATURES 📌

* Password strength detection (Weak / Medium / Strong)
* Entropy calculation (measures password randomness)
* Crack time estimation using brute-force logic
* Breached password detection using the RockYou dataset
* SHA-256 password hashing
* Dictionary-based password cracking simulation using Hashcat
* Password generator for creating strong passwords
* Show / Hide password toggle
* Responsive and clean user interface

--------

## HOW IT WORKS 🧠

### Password Strength Analysis

The application evaluates passwords based on:

* Length
* Uppercase and lowercase characters
* Numbers
* Special characters

It then calculates entropy and estimates password strength.

### Breached Password Detection

When the user clicks the **"Check if Breached"** button:

* The password is hashed using SHA-256
* The hash is checked against passwords from the RockYou dataset
* Hashcat performs a dictionary attack simulation
* If the password exists in the dataset, it is marked as compromised

### Password Generator

The application can generate strong random passwords containing:

* Uppercase letters
* Lowercase letters
* Numbers
* Symbols

--------

## TECH STACK 💻

### Frontend

* HTML
* CSS
* JavaScript

### Backend

* Python
* Flask
* Flask-CORS
* Hashlib
* Hashcat

--------

## PROJECT STRUCTURE 📂

password-strength-checker/  
│── backend/  
│   │── app.py  
│   │── cracker.py  
│   │── hash.txt  
│   │── rockyou.txt  
│   │── kernels/  
│  
│── frontend/  
│   │── index.html  
│   │── style.css  
│   │── script.js  
│   │── generator.js  
│   │── bg.jpeg  
│  
│── .gitignore  
│── README.md  

--------

## DATASET 📚

This project uses the **RockYou password dataset** for breached password detection.


--------

## SETUP ⚙️

### 1. Clone the repository

```bash
git clone https://github.com/sharvarii7/password-strength-checker.git
```

### 2. Open the project folder

```bash
cd password-strength-checker
```

### 3. Install required Python packages

```bash
pip install flask flask-cors
```

### 4. Download the RockYou dataset

Download the `rockyou.txt` dataset from:

Dataset Link:  
[[Rockyou.txt download](https://www.kaggle.com/code/wjburns/eda-rockyou-txt)]

After downloading, place the file inside the `backend` folder:

```text
backend/rockyou.txt
```

### 5. Download and configure Hashcat

Download Hashcat from:

https://hashcat.net/hashcat/

Extract Hashcat and update the following paths inside `backend/cracker.py` according to your system:

```python
HASHCAT_PATH = r"YOUR_HASHCAT_PATH"
HASHCAT_DIR = r"YOUR_HASHCAT_DIRECTORY"
WORDLIST = r"YOUR_ROCKYOU_PATH"
```

### 6. Run the Flask backend

Open terminal inside the `backend` folder and run:

```bash
python app.py
```

The backend server will start at:

```text
http://127.0.0.1:5000
```

### 7. Run the frontend

Open `frontend/index.html` in your browser.

--------
