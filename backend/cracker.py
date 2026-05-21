import hashlib
import subprocess
import time
import os

HASHCAT_PATH = r"C:\hashcat\hashcat-7.1.2\hashcat.exe"
HASHCAT_DIR = r"C:\hashcat\hashcat-7.1.2"

WORDLIST = r"C:\Users\sharv\Password_strength\backend\rockyou.txt"

HASH_FILE = "hash.txt"

# --- Fast rockyou lookup (loads once) ---
WORDLIST = r"C:\Users\sharv\Password_strength\backend\rockyou.txt"

COMMON_PASSWORDS = set()

def load_wordlist():
    global COMMON_PASSWORDS
    if COMMON_PASSWORDS:
        return  # already loaded

    with open(WORDLIST, "r", encoding="latin-1", errors="ignore") as f:
        # strip newlines, ignore empty lines
        COMMON_PASSWORDS = {line.strip() for line in f if line.strip()}

load_wordlist()

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()


def run_hashcat(args):
    subprocess.run(
        args,
        capture_output=True,
        text=True,
        cwd=HASHCAT_DIR
    )


def check_cracked():
    result = subprocess.run(
        [
            HASHCAT_PATH,
            "-m", "1400",
            HASH_FILE,
            "--show"
        ],
        capture_output=True,
        text=True,
        cwd=HASHCAT_DIR
    )
    return result.stdout.strip()


def estimate_strength(password):
    length = len(password)

    charset = 0
    if any(c.islower() for c in password):
        charset += 26
    if any(c.isupper() for c in password):
        charset += 26
    if any(c.isdigit() for c in password):
        charset += 10
    if any(not c.isalnum() for c in password):
        charset += 32

    combinations = charset ** length

    if combinations < 1e6:
        return "Weak"
    elif combinations < 1e10:
        return "Medium"
    else:
        return "Strong"


def crack_password(password):
    hash_value = hash_password(password)

    # write hash inside hashcat directory
    hash_path = os.path.join(HASHCAT_DIR, HASH_FILE)
    with open(hash_path, "w") as f:
        f.write(hash_value.strip())

    # -----------------------------
    # 1. Dictionary Attack (rockyou)
    # -----------------------------
    start = time.perf_counter()

    run_hashcat([
        HASHCAT_PATH,
        "-m", "1400",
        "-a", "0",
        HASH_FILE,
        WORDLIST,
        "--force"
    ])

    dict_result = check_cracked()

    end = time.perf_counter()
    dict_time = round(end - start, 2)

    if dict_result:
        return {
            "cracked": True,
            "time": dict_time,
            "method": "Found in breached passwords",
            "strength": "Weak"
        }

    # -----------------------------
    # 2. Estimated Strength
    # -----------------------------
    strength = estimate_strength(password)

    return {
        "cracked": False,
        "time": dict_time,
        "method": "Estimated Strength",
        "strength": strength
    }