// ================== STORAGE ==================
let people = [];
let expenses = [];
let balances = {};   // ⭐ NEW
let personId = 1;

// ================== DOM ELEMENTS ==================
const payeeInput = document.getElementById("payee-name");
const addPersonBtn = document.getElementById("addPersonBtn");
const amountInput = document.getElementById("amount");
const payerSelect = document.getElementById("payer");
const addExpenseBtn = document.getElementById("add-amount");
const output = document.getElementById("output");
const splitSelection = document.getElementById("split-selection");

// ================== ADD PERSON ==================
addPersonBtn.addEventListener("click", () => {
  const name = payeeInput.value.trim();
  if (name === "") return;

  const newPerson = { id: personId++, name };
  people.push(newPerson);

  balances[newPerson.id] = 0; // ⭐ initialize balance

  payeeInput.value = "";
  updatePayerDropdown();
  updateSplitSelection();
});

// ================== UPDATE DROPDOWN ==================
function updatePayerDropdown() {
  payerSelect.innerHTML = "";
  for (let i = 0; i < people.length; i++) {
    const option = document.createElement("option");
    option.value = people[i].id;
    option.textContent = people[i].name;
    payerSelect.appendChild(option);
  }
}

// ================== SPLIT SELECTION ==================
function updateSplitSelection() {
  splitSelection.innerHTML = "<h4 style='color:white'>Split With:</h4>";

  for (let i = 0; i < people.length; i++) {
    const person = people[i];

    const label = document.createElement("label");
    label.style.display = "block";
    label.style.color = "white";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = person.id;
    checkbox.checked = true;

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(" " + person.name));
    splitSelection.appendChild(label);
  }
}

// ================== ADD EXPENSE ==================
addExpenseBtn.addEventListener("click", () => {
  const amount = Number(amountInput.value);
  const payerId = Number(payerSelect.value);

  if (amount <= 0) return;

  const selectedIds = [];
  const checkboxes = splitSelection.querySelectorAll("input[type='checkbox']");

  checkboxes.forEach(cb => {
    if (cb.checked) selectedIds.push(Number(cb.value));
  });

  if (selectedIds.length === 0) return;

  expenses.push({ payerId, amount, participants: selectedIds });

  calculateBalances();
  displayBalances();

  amountInput.value = "";
});

// ================== CORE LOGIC ==================
function calculateBalances() {
  // Reset balances
  for (let id in balances) {
    balances[id] = 0;
  }

  // Recalculate from scratch (safe & clean)
  for (let i = 0; i < expenses.length; i++) {
    const expense = expenses[i];
    const share = expense.amount / expense.participants.length;

    // Participants owe their share
    for (let j = 0; j < expense.participants.length; j++) {
      balances[expense.participants[j]] -= share;
    }

    // Payer gets full amount
    balances[expense.payerId] += expense.amount;
  }
}

// ================== DISPLAY RESULT ==================
function displayBalances() {
  output.innerHTML = "<h4 style='color:white'>Net Balances:</h4>";

  for (let i = 0; i < people.length; i++) {
    const person = people[i];
    const balance = balances[person.id].toFixed(2);

    const line = document.createElement("p");
    line.style.color = "white";

    if (balance > 0) {
      line.textContent = `${person.name} should receive ₹${balance}`;
    } else if (balance < 0) {
      line.textContent = `${person.name} owes ₹${Math.abs(balance)}`;
    } else {
      line.textContent = `${person.name} is settled`;
    }

    output.appendChild(line);
  }
}
