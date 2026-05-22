const API_BASE_URL = "https://6s3j04em1j.execute-api.us-east-1.amazonaws.com/Prod";

const COGNITO_DOMAIN = "https://dave-image-processing-2026-login.auth.us-east-1.amazoncognito.com";
const CLIENT_ID = "5ncgqado8hfnsaeggrbkb1elfs";
const REDIRECT_URI = "https://dchdkjcdj76c0.cloudfront.net";

const loginButton = document.getElementById("login-btn");
const loadRecordsButton = document.getElementById("load-records-btn");
const uploadButton = document.getElementById("upload-btn");

const recordsStatus = document.getElementById("records-status");
const recordsList = document.getElementById("records-list");

const fileInput = document.getElementById("file-input");

function login() {
  const loginUrl =
    `${COGNITO_DOMAIN}/oauth2/authorize?` +
    `client_id=${CLIENT_ID}&` +
    `response_type=code&` +
    `scope=openid+email+profile&` +
    `redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;

  window.location.href = loginUrl;
}

async function exchangeCodeForToken() {
  const params = new URLSearchParams(window.location.search);

  const code = params.get("code");

  if (!code) {
    return;
  }

  recordsStatus.textContent = "Completing login...";

  const tokenUrl = `${COGNITO_DOMAIN}/oauth2/token`;

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: CLIENT_ID,
    code: code,
    redirect_uri: REDIRECT_URI
  });

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: body
  });

  const data = await response.json();

  localStorage.setItem("id_token", data.id_token);

  recordsStatus.textContent = "Logged in successfully";

  window.history.replaceState({}, document.title, REDIRECT_URI);
}

async function loadRecords() {
  recordsStatus.textContent = "Loading records...";

  recordsList.innerHTML = "";

  const token = localStorage.getItem("id_token");

  try {
    const response = await fetch(`${API_BASE_URL}/records`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log("Response status:", response.status);

    const data = await response.json();

    console.log("Records response:", data);

    recordsStatus.textContent =
      `Loaded ${data.records.length} records`;

    for (const record of data.records) {
      const li = document.createElement("li");

      li.innerHTML = `
        <strong>Status:</strong> ${record.status}<br>
        <strong>Image ID:</strong> ${record.image_id}<br>
        <strong>Created:</strong> ${record.created_at}<br>
        <strong>Processed:</strong> ${record.processed_at || "Not processed yet"}
      `;

      recordsList.appendChild(li);
    }

  } catch (error) {
    console.error("Failed to load records:", error);

    recordsStatus.textContent =
      "Failed to load records";
  }
}

async function uploadImage() {
  const file = fileInput.files[0];

  if (!file) {
    alert("Please select a file");

    return;
  }

  recordsStatus.textContent =
    "Requesting upload URL...";

  const token = localStorage.getItem("id_token");

  try {

    const uploadUrlResponse = await fetch(
      `${API_BASE_URL}/upload-url`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const uploadData =
      await uploadUrlResponse.json();

    console.log(
      "Upload URL response:",
      uploadData
    );

    recordsStatus.textContent =
      "Uploading image to S3...";

    await fetch(uploadData.upload_url, {
      method: "PUT",
      headers: {
        "Content-Type": "image/jpeg"
      },
      body: file
    });

    recordsStatus.textContent =
      "Upload complete";

  } catch (error) {

    console.error(
      "Upload failed:",
      error
    );

    recordsStatus.textContent =
      "Upload failed";
  }
}

loginButton.addEventListener("click", login);

loadRecordsButton.addEventListener(
  "click",
  loadRecords
);

uploadButton.addEventListener(
  "click",
  uploadImage
);

exchangeCodeForToken();
