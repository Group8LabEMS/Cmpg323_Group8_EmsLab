import { showAlert } from "../Components/CustomAlert";

//SEPARATING THE BUSINESS LOGIC
export function LoginUser(username, role) {
  // Validate student/staff number (8 digits only)
  if (!/^\d{8}$/.test(username)) {
    showAlert("Invalid number. Please enter an 8-digit student/staff number.");
    // errorEl.textContent =
    //   "Invalid number. Please enter an 8-digit student/staff number.";
    return;
  }

  if (!role) {
    showAlert("Please select a role.");
    // errorEl.textContent = "Please select a role.";

    return;
  }

  if (!username || !role) {
    showAlert("All fields required");
    return;
  }

  console.log(username, role);
  currentUser = { username, role };
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  window.location.href = "index.html";
}
