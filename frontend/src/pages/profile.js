// Basic profile renderer for tab
import { html, render } from "lit";

export function renderProfile() {
  const profileSection = document.getElementById("profile");
  render(html`
    <div class="profile-desc">View and Update your personal information</div>
    <div class="profile-card">
      <form class="profile-form">
  <input class="profile-input" type="text" value="John" placeholder="First Name" readonly>
  <input class="profile-input" type="text" value="Natural and Agricultural Science" placeholder="Faculty" readonly>
  <input class="profile-input" type="text" value="Doe" placeholder="Last Name" readonly>
  <input class="profile-input" type="text" value="Biological Sciences" placeholder="Department" readonly>
  <input class="profile-input" type="text" value="12345678" placeholder="University No" readonly>
  <input class="profile-input" type="password" value="Password" placeholder="Password">
  <input class="profile-input" type="email" value="johndoe@nwu.ac.za" placeholder="Email">
  <input class="profile-input" type="password" value="Re-enter Password" placeholder="Re-enter Password">
  <input class="profile-input" type="text" value="0721389459" placeholder="Cellphone No" style="grid-column: 1 / 2;">
  <button class="profile-save-btn" type="submit" style="grid-column: 2 / 3;">Save</button>
      </form>
    </div>
  `, profileSection);
}
