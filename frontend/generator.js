function generatePassword(password) {
  let base = password;

  if (!/[A-Z]/.test(base))
    base = base.charAt(0).toUpperCase() + base.slice(1);

  let replacements = {
    a: "@",
    s: "$",
    o: "0",
    i: "1",
    e: "3"
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

  if (newPass.length < 8)
    newPass += Math.random().toString(36).slice(-4);

  return newPass;
}