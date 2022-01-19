// Elements
const computersSelectElement = document.getElementById("computersSelect");
const balanceElement = document.getElementById("showBalance");
const salaryElement = document.getElementById("showSalary");
const priceElement = document.getElementById("buyPrice");
const productInfoElement = document.getElementById("productInfo");
const featuresElement = document.getElementById("features");
const computerImageElement = document.getElementById("computerImage");
const loanButtonElement = document.getElementById("loanButton");
const workButtonElement = document.getElementById("workButton");
const bankButtonElement = document.getElementById("bankButton");
const buyButtonElement = document.getElementById("buyButton");
const repayLoanButtonElement = document.getElementById("repayLoanButton");
const showLoanElement = document.getElementById("showLoan");
const loanAmountElement = document.getElementById("loanAmount");

// Global variables
let bankBalance = 0;
let salary = 0;
let loan = 0;
let computers = [];

// Fetch data (computers) from Noroff REST API
fetch("https://noroff-komputer-store-api.herokuapp.com/computers")
  .then((response) => response.json())
  .then((data) => (computers = data))
  .then((computers) => addComputersToSelect(computers))
  .catch(function (error) {
    console.error("Something went wrong: ", error);
  });

// Add computers to select
const addComputersToSelect = (computers) => {
  computers.forEach((computer) => addComputerToSelect(computer));
  // Trigger change computer for updated data
  computersSelectElement.dispatchEvent(new Event("change"));
};

const addComputerToSelect = (computer) => {
  const computerElement = document.createElement("option");
  computerElement.value = computer.id;
  computerElement.appendChild(document.createTextNode(computer.title));
  computersSelectElement.appendChild(computerElement);
};
// Change selected computer
const handleComputerSelect = (e) => {
  const selectedComputer = computers[e.target.selectedIndex];
  // List a feature per line
  featuresElement.innerHTML = selectedComputer.specs.join("<br>");
  computerImageElement.innerHTML = `<img src="https://noroff-komputer-store-api.herokuapp.com/${selectedComputer.image}" 
  onError="this.onerror=null;this.src='./images/brokenImage.png';" alt="computer">`; // on image error use alternate "brokenImage"
  priceElement.innerText = Number(selectedComputer.price);
  productInfoElement.innerHTML = `<h3>${selectedComputer.title}</h3><p>${selectedComputer.description}`;
};

// Update values in Komputer store
const updateBankAndWork = () => {
  salaryElement.innerText = salary;
  balanceElement.innerText = bankBalance;
  salaryElement.innerText = salary;
  loanAmountElement.innerText = loan;
  console.log("updated");
};
// Loan exists
const showLoan = () => {
  showLoanElement.hidden = false;
  repayLoanButtonElement.hidden = false;
};
// Loan hidden
const hideLoan = () => {
  repayLoanButtonElement.hidden = true;
  showLoanElement.hidden = true;
};

// Loan: only one loan that is not over double of bankBalance
const handleGetLoan = () => {
  if (loan === 0) {
    const getLoan = Number(
      window.prompt("Please enter the loan amount you are applying for:", "")
    );
    if (getLoan <= bankBalance * 2) {
      if (getLoan != "") {
        loan = getLoan;
        alert("The loan you have applied for has been approved.");
        bankBalance += loan;
        showLoan();
      }
      updateBankAndWork();
    } else {
      alert(`Unfortunately, the Bank is unable to issue the amount you requested.
    Maximum amount is double of your balance.\n\nThe amount must be in numbers!`);
    }
  } else {
    alert(
      `A new loan cannot be granted until the previous loan has been repaid.`
    );
  }
};
// Loan repayment
const handleRepayLoan = () => {
  if (loan >= salary) {
    loan -= salary;
    salary = 0;
  } else {
    bankBalance += salary - loan;
    loan = 0;
    salary = 0;
    hideLoan();
  }
  updateBankAndWork();
};

// One click is worth of 100! (hire me)
const handleWork = () => {
  salary += 100;
  salaryElement.innerText = salary;
};

// Salary transfer to bank, if loan exists 10% of salary is deducted for loan repay
const handleBankMoney = () => {
  if (loan == 0) {
    bankBalance += Number(salaryElement.innerText);
    salary = 0;
  } else {
    alert(
      `You have outstanding loan: ${loan} and 10% of your salary has been deducted for loan repay.`
    );
    if (loan >= Number(salaryElement.innerText) * 0.1) {
      bankBalance += Number(salaryElement.innerText) * 0.9;
      loan -= Number(salaryElement.innerText) * 0.1;
      salary = 0;
    } else {
      bankBalance += Number(salaryElement.innerText) - loan;
      loan = 0;
      salary = 0;
      // hide loan
      hideLoan();
    }
  }
  updateBankAndWork();
};
// Buying is possible if enough funds for selected computer
const handleBuyComputer = () => {
  const computerPrice = Number(priceElement.innerText);
  if (bankBalance >= computerPrice) {
    alert(`Purchase accepted.\nYou are now the owner of the new laptop!`);
    bankBalance -= computerPrice;
    updateBankAndWork();
  } else {
    alert(
      `  Purchase rejected.
  Selected laptop has more features than you can afford at the moment.\n
  You may want to look at other options ...`
    );
  }
};

// Hide loan elements and set values on init
hideLoan();
updateBankAndWork();

// Event Listeners
computersSelectElement.addEventListener("change", handleComputerSelect);
loanButtonElement.addEventListener("click", handleGetLoan);
workButtonElement.addEventListener("click", handleWork);
bankButtonElement.addEventListener("click", handleBankMoney);
buyButtonElement.addEventListener("click", handleBuyComputer);
repayLoanButtonElement.addEventListener("click", handleRepayLoan);
