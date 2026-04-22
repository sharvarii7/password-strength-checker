function Strength(password) {
  let i = 0;

  if (password.length > 6) i++;
  if (password.length >= 10) i++;

  if (/[A-Z]/.test(password)) i++;
  if (/[0-9]/.test(password)) i++;
  if (/[^A-Za-z0-9]/.test(password)) i++;

  return i;
}

// 📚 Common password list
const commonPasswords = [
  "123", "1234", "12345", "123456", "1234567", "12345678", "123456789", "1234567890",
  "password", "password1", "password123", "pass123", "pass@123",
  "admin", "admin123", "administrator",
  "qwerty", "qwerty123", "qwertyuiop",
  "abc123", "abcd1234", "abcdef", "abcdef123",
  "111111", "11111111", "000000", "00000000",
  "iloveyou", "iloveyou123", "love123",
  "welcome", "welcome123",
  "letmein", "letmein123",
  "monkey", "dragon", "sunshine", "princess", "football", "baseball",
  "master", "shadow", "superman", "batman",
  "login", "login123", "user", "user123",
  "test", "test123", "guest", "guest123",
  "root", "root123",
  "pass", "pass1234",
  "hello", "hello123",
  "india", "india123", "bharat", "bharat123",
  "krishna", "ram", "shiva",
  "123qwe", "qwe123", "1q2w3e4r",
  "zaq12wsx", "qazwsx",
  "asdfgh", "asdfghjkl",
  "zxcvbnm", "zxcvbn",
  "987654", "987654321",
  "password@123", "admin@123", "user@123"
];

// 🔐 Entropy calculation
function calculateEntropy(password) {
  let charset = 0;

  if (/[a-z]/.test(password)) charset += 26;
  if (/[A-Z]/.test(password)) charset += 26;
  if (/[0-9]/.test(password)) charset += 10;
  if (/[^a-zA-Z0-9]/.test(password)) charset += 32;

  if (charset === 0) return 0;

  return password.length * Math.log2(charset);
}

// ⏳ Crack time estimation
function estimateCrackTime(entropy) {
  const guessesPerSecond = 1e9;
  const totalGuesses = Math.pow(2, entropy);
  const seconds = totalGuesses / guessesPerSecond;

  if (seconds < 60) return "seconds";
  if (seconds < 3600) return "minutes";
  if (seconds < 86400) return "hours";
  if (seconds < 31536000) return "days";
  return "years";
}

let container = document.querySelector(".container");
let extraInfo = document.querySelector(".extraInfo"); // 👈 NEW

document.addEventListener("keyup", function () {
  let password = document.querySelector("#YourPassword").value;

  let strength = Strength(password);

  // 🎨 ORIGINAL UI LOGIC (untouched)
  if (strength <= 2) {
    container.classList.add("weak");
    container.classList.remove("moderate");
    container.classList.remove("strong");
  } else if (strength >= 2 && strength <= 4) {
    container.classList.remove("weak");
    container.classList.add("moderate");
    container.classList.remove("strong");
  } else {
    container.classList.remove("weak");
    container.classList.remove("moderate");
    container.classList.add("strong");
  }

  // 🧠 NEW FEATURES

 const lowerPass = password.toLowerCase();

// exact match OR contains common pattern OR too short
const isCommon =
  commonPasswords.includes(lowerPass) ||
  commonPasswords.some(p => lowerPass.includes(p)) ||
  password.length < 6;
  const entropy = calculateEntropy(password);
  const crackTime = estimateCrackTime(entropy);

  // 🧾 SHOW BELOW BAR (no tooltip anymore)
  extraInfo.innerHTML = `
    Entropy: ${entropy.toFixed(2)} bits <br>
    Crack Time: ${crackTime} <br>
    ${isCommon ? "❌ Common Password" : "✅ Uncommon Password"}
  `;

  // Debug (optional)
  console.log({
    password,
    entropy: entropy.toFixed(2),
    crackTime,
    common: isCommon
  });
});

// 👀 Show / Hide (unchanged)
let password = document.querySelector("#YourPassword");
let show = document.querySelector(".show");

show.onclick = function () {
  if (password.type === "password") {
    password.setAttribute("type", "text");
    show.classList.add("hide");
  } else {
    password.setAttribute("type", "password");
    show.classList.remove("hide");
  }
};