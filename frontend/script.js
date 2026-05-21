// -----------------------------
// Strength logic (UI + logic)
// -----------------------------
function getStrengthLabel(password) {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;

  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return "Weak";
  if (score <= 4) return "Moderate";
  return "Strong";
}


// -----------------------------
// Suggestions
// -----------------------------
function generateSuggestions(password) {
  let suggestions = [];

  if (password.length < 8)
    suggestions.push("Use at least 8 characters");

  if (!/[a-z]/.test(password))
    suggestions.push("Add lowercase letters");

  if (!/[A-Z]/.test(password))
    suggestions.push("Add uppercase letters");

  if (!/[0-9]/.test(password))
    suggestions.push("Include numbers");

  if (!/[^A-Za-z0-9]/.test(password))
    suggestions.push("Add special characters (!@#$ etc.)");

  return suggestions;
}


// -----------------------------
// Smart password generator
// -----------------------------
function generatePassword(password) {
  let base = password || "secure";

  if (!/[A-Z]/.test(base)) {
    base = base.charAt(0).toUpperCase() + base.slice(1);
  }

  const replacements = {
    a: "@", s: "$", o: "0", i: "1", e: "3"
  };

  let newPass = "";

  for (let c of base) {
    if (replacements[c.toLowerCase()] && Math.random() > 0.5) {
      newPass += replacements[c.toLowerCase()];
    } else {
      newPass += c;
    }
  }

  let digits = Math.floor(Math.random() * 900 + 100);
  let symbols = "!@#$%^&*";

  newPass += symbols[Math.floor(Math.random() * symbols.length)];
  newPass += symbols[Math.floor(Math.random() * symbols.length)];
  newPass += digits;

  if (newPass.length < 8) {
    newPass += Math.random().toString(36).slice(-4);
  }

  return newPass;
}


// -----------------------------
// Backend call (ONLY on click)
// -----------------------------
async function checkBreach(password) {
  const res = await fetch("http://127.0.0.1:5000/check", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ password })
  });

  return await res.json();
}


// -----------------------------
// DOM
// -----------------------------
let container = document.querySelector(".container");
let extraInfo = document.querySelector(".extraInfo");
let input = document.querySelector("#YourPassword");
let breachBtn = document.getElementById("breachBtn");
let breachResult = document.getElementById("breachResult");

input.addEventListener("keyup", function () {
  if (input.value.length === 0) {
  breachBtn.classList.add("disabled");
} else {
  breachBtn.classList.remove("disabled");
}
});

// -----------------------------
// FRONTEND LOGIC 
// -----------------------------
input.addEventListener("keyup", function () {

  let password = input.value;

  if (password.length === 0) {
    extraInfo.innerHTML = "";
    breachResult.innerHTML = "";
    return;
  }

  let strength = getStrengthLabel(password);
  let suggestions = generateSuggestions(password);

  container.classList.remove("weak", "moderate", "strong");

  if (strength === "Weak") container.classList.add("weak");
  else if (strength === "Moderate") container.classList.add("moderate");
  else container.classList.add("strong");

  // 🔥 FIXED LOGIC
  if (strength === "Strong") {

    extraInfo.innerHTML = `
      <strong>Strength:</strong> ${strength} <br><br>
      Strong password ✅
    `;

  } else {

    let example = generatePassword(password);

    extraInfo.innerHTML = `
      <strong>Strength:</strong> ${strength} <br><br>

      <strong>Suggestions:</strong><br>
      ${
        suggestions.length > 0
          ? "<ul>" + suggestions.map(s => `<li>${s}</li>`).join("") + "</ul>"
          : "No suggestions needed"
      }

      <br><strong>Suggested Strong Password:</strong><br>
      <span style="color:#00ff99; font-weight:bold;">
        ${example}
      </span>
    `;
  }
});


// -----------------------------
// BACKEND BUTTON (SMART USAGE)
// -----------------------------
breachBtn.addEventListener("click", async function () {

  let password = input.value;

  if (!password) {
    breachResult.innerText = "Enter a password first";
    return;
  }

  breachResult.innerText = "Checking...";

  try {
    const data = await checkBreach(password);

    if (data.cracked) {
      breachResult.innerHTML = "❌ Found in breached passwords";
      breachResult.style.color = "red";
    } else {
      breachResult.innerHTML = "✅ Not found in known breaches";
      breachResult.style.color = "lightgreen";
    }

  } catch (err) {
    breachResult.innerText = "⚠️ Backend not reachable";
    console.error(err);
  }
});


// -----------------------------
// Show/Hide password
// -----------------------------
let show = document.querySelector(".show");

show.onclick = function () {
  if (input.type === "password") {
    input.type = "text";
    show.classList.add("hide");
  } else {
    input.type = "password";
    show.classList.remove("hide");
  }
};