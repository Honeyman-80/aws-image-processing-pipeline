async function loadRecords() {
  recordsStatus.textContent = "Loading records...";
  recordsList.innerHTML = "";

  try {
    const response = await fetch(
      `${API_BASE_URL}/records`
    );

    console.log("Response status:", response.status);

    const data = await response.json();

    console.log("Records response:", data);

    recordsStatus.textContent = `Loaded ${data.records.length} records`;
  } catch (error) {
    console.error("Failed to load records:", error);

    recordsStatus.textContent = "Failed to load records";
  }
}
