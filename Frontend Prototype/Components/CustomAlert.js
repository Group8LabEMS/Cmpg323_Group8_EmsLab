export function showAlert(message, type = "success") {
  let alertBox = document.getElementById("custom-alert");

  if (!alertBox) {
    alertBox = document.createElement("div");
    alertBox.id = "custom-alert";
    alertBox.className = "custom-alert";
    document.body.appendChild(alertBox);
  }

  alertBox.className = "custom-alert " + type;
  alertBox.textContent = message;
  alertBox.style.display = "block";

  // HiDe after 3 seconds
  setTimeout(() => {
    alertBox.style.display = "none";
  }, 3000);
}
