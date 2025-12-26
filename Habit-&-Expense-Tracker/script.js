// ======================
// APP STATE
// ======================
const AppState = {
  nexthabitId: 1,
  nextexpenseId: 1,
  habit: [],       // {id, name, completedDates: []}
  categories: [],  // {id, name}
  expense: []      // {id, categoryId, amount, date}
};

// ======================
// DOM ELEMENTS - HABIT
// ======================
const HabitNameInput = document.getElementById("habit-name");
const RegisterHabitBtn = document.getElementById("register-habit-btn");
const SelectHabit = document.getElementById("habit-select");
const HabitDate = document.getElementById("habit-date");
const MarkCompleteBtn = document.getElementById("mark-complete-btn");
const HabitHistory = document.getElementById("habit-history");

// ======================
// DOM ELEMENTS - EXPENSE
// ======================
const ExpenseCategoryInput = document.getElementById("expense-category");
const AddCategoryBtn = document.getElementById("add-category-btn");
const CategorySelect = document.getElementById("category-select");
const ExpenseAmountInput = document.getElementById("expense-amount");
const ExpenseDateInput = document.getElementById("expense-date");
const AddExpenseBtn = document.getElementById("add-expense-btn");
const ExpenseHistory = document.getElementById("expense-history");

// ======================
// SAVE & LOAD STATE
// ======================
function saveState() {
  localStorage.setItem("App_Data", JSON.stringify(AppState));
}

function loadState() {
  const data = localStorage.getItem("App_Data");
  if (data) {
    const parsed = JSON.parse(data);
    AppState.nexthabitId = parsed.nexthabitId;
    AppState.nextexpenseId = parsed.nextexpenseId;
    AppState.habit = parsed.habit;
    AppState.categories = parsed.categories || [];
    AppState.expense = parsed.expense || [];
  }
}

// ======================
// HABIT TRACKER FUNCTIONS
// ======================
function addHabit() {
  const name = HabitNameInput.value.trim();
  if (!name) return;

  AppState.habit.push({
    id: AppState.nexthabitId++,
    name: name,
    completedDates: []
  });

  HabitNameInput.value = "";
  saveState();
  renderHabitDropdown();
  renderHabitHistory();
}

function renderHabitDropdown() {
  SelectHabit.innerHTML = "<option value=''>Select Habit</option>";
  for (let habit of AppState.habit) {
    const option = document.createElement("option");
    option.value = habit.id;
    option.textContent = habit.name;
    SelectHabit.appendChild(option);
  }
}

function markHabitCompleted() {
  const habitId = Number(SelectHabit.value);
  const date = HabitDate.value;

  if (!habitId || !date) return;

  const habit = AppState.habit.find(h => h.id === habitId);
  if (!habit.completedDates.includes(date)) {
    habit.completedDates.push(date);
  }

  HabitDate.value = "";
  saveState();
  renderHabitHistory();
}

function renderHabitHistory() {
  HabitHistory.innerHTML = "";
  for (let habit of AppState.habit) {
    const li = document.createElement("li");
    li.style.color = "white";
    li.textContent = `${habit.name} - Completed on: ${habit.completedDates.join(", ")}`;
    HabitHistory.appendChild(li);
  }
}

// ======================
// EXPENSE TRACKER FUNCTIONS
// ======================
function addCategory() {
  const name = ExpenseCategoryInput.value.trim();
  if (!name) return;

  AppState.categories.push({
    id: AppState.nextexpenseId++,
    name: name
  });

  ExpenseCategoryInput.value = "";
  saveState();
  renderCategoryDropdown();
}

function renderCategoryDropdown() {
  CategorySelect.innerHTML = "<option value=''>Select Category</option>";
  for (let cat of AppState.categories) {
    const option = document.createElement("option");
    option.value = cat.id;
    option.textContent = cat.name;
    CategorySelect.appendChild(option);
  }
}

function addExpense() {
  const categoryId = Number(CategorySelect.value);
  const amount = Number(ExpenseAmountInput.value);
  const date = ExpenseDateInput.value;

  if (!categoryId || !amount || !date) return;

  AppState.expense.push({
    id: AppState.nextexpenseId++,
    categoryId: categoryId,
    amount: amount,
    date: date
  });

  ExpenseAmountInput.value = "";
  ExpenseDateInput.value = "";
  saveState();
  renderExpenseHistory();
}

function renderExpenseHistory() {
  ExpenseHistory.innerHTML = "";
  for (let exp of AppState.expense) {
    const cat = AppState.categories.find(c => c.id === exp.categoryId);
    const li = document.createElement("li");
    li.style.color = "white";
    li.textContent = `${cat ? cat.name : "Unknown"} - ₹${exp.amount} on ${exp.date}`;
    ExpenseHistory.appendChild(li);
  }
}

// ======================
// EVENT LISTENERS
// ======================
RegisterHabitBtn.addEventListener("click", addHabit);
MarkCompleteBtn.addEventListener("click", markHabitCompleted);

AddCategoryBtn.addEventListener("click", addCategory);
AddExpenseBtn.addEventListener("click", addExpense);

// ======================
// INITIAL LOAD
// ======================
loadState();
renderHabitDropdown();
renderHabitHistory();
renderCategoryDropdown();
renderExpenseHistory();

