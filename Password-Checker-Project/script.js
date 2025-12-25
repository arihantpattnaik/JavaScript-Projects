// Selecting DOM elements
const input = document.querySelector("#password");
const strength = document.querySelector("#strength");
const submitBtn = document.querySelector("#submit-button");
const togglePassword = document.querySelector("#toggle-password");

// Calculate strength
function calcStrength(password) {
  let score = 0;

  // Check length
  if (password.length >= 8) score++;

  // Check for numbers
  if (/\d/.test(password)) score++;

  // Check for special characters
  if (/[!@#$%^&*]/.test(password)) score++;

  return score;
}

// UI update function
function renderStrength(score) {
  strength.classList.remove("hidden", "weak", "medium", "strong");

  if (score <= 1) {
    strength.textContent = "Weak";
    strength.classList.add("weak");
    submitBtn.disabled = true;
  } else if (score === 2) {
    strength.textContent = "Medium";
    strength.classList.add("medium");
    submitBtn.disabled = true;
  } else {
    strength.textContent = "Strong";
    strength.classList.add("strong");
    submitBtn.disabled = false;
  }
}

// Listen to user input
input.addEventListener("input", () => {
  const password = input.value;

  // Hide strength if empty
  if (password.length === 0) {
    strength.classList.add("hidden");
    return;
  }

  const score = calcStrength(password);
  renderStrength(score);
});

togglePassword.addEventListener("click", () => {
    const isPassword = input.type === "password";
    input.type = isPassword ? "text" : "password";
    togglePassword.textContent = isPassword ? "🙈" : "👁️";
});