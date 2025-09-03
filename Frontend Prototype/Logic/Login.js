import { showAlert } from "../Components/CustomAlert";

export default function login(event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const role = document.getElementById("role").value;
  if (!username || !role) {
    showAlert("All fields required");
    return;
  }

  currentUser = { username, role };
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  window.location.href = "index.html";
}
