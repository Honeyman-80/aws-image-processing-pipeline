const API_BASE_URL = "https://6s3j04em1j.execute-api.us-east-1.amazonaws.com/Prod";

const COGNITO_DOMAIN = "https://dave-image-processing-2026-login.auth.us-east-1.amazoncognito.com";
const CLIENT_ID = "5ncgqado8hfnsaeggrbkb1elfs";
const REDIRECT_URI = "https://dchdkjcdj76c0.cloudfront.net";

const loginButton = document.getElementById("login-btn");
const loadRecordsButton = document.getElementById("load-records-btn");
const recordsStatus = document.getElementById("records-status");
const recordsList = document.getElementById("records-list");

function login() {
  const loginUrl =
    `${COGNITO_DOMAIN}/login?` +
    `client_id=${CLIENT_ID}&` +
    `response_type=code&` +
    `scope=openid+email+profile&` +
    `redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;

  window.location.href = loginUrl;
}

async function loadRecords() {
  recordsStatus.textContent = "Loading records...";
  recordsList.innerHTML = "";

  try {
    const response = await fetch(`${API_BASE_URL}/records`);

    console.log("Response status:", response.status);

    const data = await response.json();

    console.log("Records response:", data);

    recordsStatus.textContent = `Loaded ${data.records.length} records`;
  } catch (error) {
    console.error("Failed to load records:", error);

    recordsStatus.textContent = "Failed to load records";
  }
}

loginButton.addEventListener("click", login);
loadRecordsButton.addEventListener("click", loadRecords);
