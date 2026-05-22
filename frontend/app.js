const API_BASE_URL = "https://6s3j04em1j.execute-api.us-east-1.amazonaws.com/Prod";

const loadRecordsButton = document.getElementById("load-records-btn");
const recordsStatus = document.getElementById("records-status");
const recordsList = document.getElementById("records-list");

async function loadRecords() {
  recordsStatus.textContent = "Loading records...";
  recordsList.innerHTML = "";

  console.log("Frontend connected successfully");
}

loadRecordsButton.addEventListener("click", loadRecords);
