// ======================= DOM ELEMENTS =======================

// Family Members
const memberNameInput = document.querySelector("#member-name-input");
const selectChoice = document.querySelector("#select-choice");
const addMemberButton = document.querySelector("#add-member-button");
const deleteMemberButton = document.querySelector("#delete-member-button");
const deleteMemberSelect = document.querySelector("#to-delete-option");
const memberPointsList = document.querySelector("#member-points-list");

// Tasks
const taskNameInput = document.querySelector("#task-name");
const assignedMemberSelect = document.querySelector("#assigned-member");
const completionDateInput = document.querySelector("#completion-date");
const addTaskButton = document.querySelector("#add-task-button");
const taskList = document.querySelector("#task-list");

// Expenses
const expenseNameInput = document.querySelector("#expense-name");
const expenseAmountInput = document.querySelector("#expense-amount");
const adultCheckboxContainer = document.querySelector("#adult-checkboxes");
const addExpenseBtn = document.querySelector("#add-expense-btn");
const expenseList = document.querySelector("#expense-list");

// Investments
const invPerson = document.querySelector("#inv-person");
const invAmount = document.querySelector("#inv-amount");
const invDate = document.querySelector("#inv-date");
const invType = document.querySelector("#inv-type");
const addInvestmentBtn = document.querySelector("#add-investment-btn");
const investmentList = document.querySelector("#investment-list");

// ======================= APP STATE =======================
const AppState = {
  members: [],
  tasks: [],
  expenses: [],
  investments: [],
  nextMemberId: 1,
  nextTaskId: 1
};

// ======================= FAMILY MEMBERS =======================
function addFamilyMember() {
  const name = memberNameInput.value.trim();
  const category = selectChoice.value;

  if (!name || !category) return;

  AppState.members.push({
    id: AppState.nextMemberId++,
    name,
    isAdult: category === "Adult",
    points: 0
  });

  memberNameInput.value = "";
  selectChoice.value = "";

  updateMemberDropdowns();
  updateMemberPoints();
  renderAdultCheckboxes();
}

function deleteFamilyMember() {
  const id = parseInt(deleteMemberSelect.value);
  if (!id) return;

  for (let i = 0; i < AppState.members.length; i++) {
    if (AppState.members[i].id === id) {
      AppState.members.splice(i, 1);
      break;
    }
  }

  updateMemberDropdowns();
  updateMemberPoints();
  renderAdultCheckboxes();
}

function updateMemberDropdowns() {
  deleteMemberSelect.innerHTML = `<option value="">Select Member to Delete</option>`;
  assignedMemberSelect.innerHTML = `<option value="">Select Member</option>`;

  AppState.members.forEach(m => {
    const delOpt = document.createElement("option");
    delOpt.value = m.id;
    delOpt.textContent = m.name;
    deleteMemberSelect.appendChild(delOpt);

    const taskOpt = document.createElement("option");
    taskOpt.value = m.id;
    taskOpt.textContent = m.name;
    assignedMemberSelect.appendChild(taskOpt);
  });
}

function updateMemberPoints() {
  memberPointsList.innerHTML = "";
  AppState.members.forEach(m => {
    const div = document.createElement("div");
    div.className = "member-points";
    div.textContent = `${m.name} → ${m.points} points`;
    memberPointsList.appendChild(div);
  });
}

// ======================= TASK MANAGER =======================
function addTask() {
  const name = taskNameInput.value.trim();
  const memberId = parseInt(assignedMemberSelect.value);
  const date = completionDateInput.value;

  if (!name || !memberId || !date) return;

  AppState.tasks.push({
    id: AppState.nextTaskId++,
    name,
    memberId,
    date,
    completed: false
  });

  taskNameInput.value = "";
  assignedMemberSelect.value = "";
  completionDateInput.value = "";

  renderTasks();
}

function renderTasks() {
  taskList.innerHTML = "";

  AppState.tasks.forEach(task => {
    const li = document.createElement("li");
    li.className = "task-item" + (task.completed ? " completed" : "");

    const member = AppState.members.find(m => m.id === task.memberId);

    li.innerHTML = `
      <span>
        ${task.name}<br>
        Assigned to: ${member ? member.name : "N/A"}<br>
        Due: ${task.date}
      </span>
      <button class="complete-btn">${task.completed ? "Undo" : "Complete"}</button>
    `;

    li.querySelector("button").addEventListener("click", () => {
      toggleTaskCompletion(task.id);
    });

    taskList.appendChild(li);
  });
}

function toggleTaskCompletion(taskId) {
  for (let i = 0; i < AppState.tasks.length; i++) {
    if (AppState.tasks[i].id === taskId) {
      AppState.tasks[i].completed = !AppState.tasks[i].completed;

      const member = AppState.members.find(
        m => m.id === AppState.tasks[i].memberId
      );

      if (member) {
        member.points += AppState.tasks[i].completed ? 1 : -1;
      }
      break;
    }
  }

  renderTasks();
  updateMemberPoints();
}

// ======================= EXPENSE TRACKER =======================
function renderAdultCheckboxes() {
  adultCheckboxContainer.innerHTML = "<strong>Divide Among Adults:</strong>";

  AppState.members.forEach(m => {
    if (m.isAdult) {
      const div = document.createElement("div");
      div.className = "adult-check";
      div.innerHTML = `
        <input type="checkbox" value="${m.id}" checked />
        <label>${m.name}</label>
      `;
      adultCheckboxContainer.appendChild(div);
    }
  });
}

function addExpense() {
  const name = expenseNameInput.value.trim();
  const amount = parseFloat(expenseAmountInput.value);

  if (!name || !amount) return;

  const selectedAdults = [];
  adultCheckboxContainer.querySelectorAll("input:checked").forEach(cb => {
    selectedAdults.push(parseInt(cb.value));
  });

  if (selectedAdults.length === 0) return;

  AppState.expenses.push({
    name,
    amount,
    adults: selectedAdults
  });

  expenseNameInput.value = "";
  expenseAmountInput.value = "";

  renderExpenses();
}

function renderExpenses() {
  expenseList.innerHTML = "";

  AppState.expenses.forEach(e => {
    const share = (e.amount / e.adults.length).toFixed(2);
    const names = e.adults
      .map(id => AppState.members.find(m => m.id === id)?.name)
      .join(", ");

    const li = document.createElement("li");
    li.className = "expense-item";
    li.textContent = `${e.name} → ₹${e.amount} | ₹${share} each (${names})`;

    expenseList.appendChild(li);
  });
}

// ======================= INVESTMENTS =======================
function addInvestment() {
  if (!invPerson.value || !invAmount.value || !invDate.value) return;

  AppState.investments.push({
    person: invPerson.value,
    amount: invAmount.value,
    date: invDate.value,
    type: invType.value
  });

  invPerson.value = "";
  invAmount.value = "";
  invDate.value = "";

  renderInvestments();
}

function renderInvestments() {
  investmentList.innerHTML = "";

  AppState.investments.forEach(i => {
    const li = document.createElement("li");
    li.className = "expense-item";
    li.textContent = `${i.type}: ${i.person} | ₹${i.amount} | Since ${i.date}`;
    investmentList.appendChild(li);
  });
}

// ======================= NOTIFICATIONS =======================
function checkTodayTasks() {
  const today = new Date().toISOString().split("T")[0];

  AppState.tasks.forEach(task => {
    if (task.date === today && !task.completed) {
      alert(`⚠️ Task due today: ${task.name}`);
    }
  });
}

// Instant notification (manual use)
function instantNotify(message) {
  alert(`🚨 ${message}`);
}

// ======================= EVENT LISTENERS =======================
addMemberButton.addEventListener("click", addFamilyMember);
deleteMemberButton.addEventListener("click", deleteFamilyMember);
addTaskButton.addEventListener("click", addTask);
addExpenseBtn.addEventListener("click", addExpense);
addInvestmentBtn.addEventListener("click", addInvestment);

// ======================= INIT =======================
renderAdultCheckboxes();
checkTodayTasks();
