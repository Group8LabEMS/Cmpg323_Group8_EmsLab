// Basic profile renderer for tab
import { html, render } from "lit";

export function renderProfile() {
  const profileSection = document.getElementById("profile");
  render(html`
    <div class="card-header">
      <h2 class="card-title">Profile</h2>
      <div class="card-subtitle">View and update your personal information</div>
    </div>
    <div class="card">
      <form class="profile-form" style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md); align-items: end;">
        <div class="form-group">
          <label class="form-label">First Name</label>
          <input class="form-input form-input-full" type="text" value="John" placeholder="First Name" readonly>
        </div>
        <div class="form-group">
          <label class="form-label">Last Name</label>
          <input class="form-input form-input-full" type="text" value="Doe" placeholder="Last Name" readonly>
        </div>
        <div class="form-group">
          <label class="form-label">University Number</label>
          <input class="form-input form-input-full" type="text" value="12345678" placeholder="University No" readonly>
        </div>
        <div class="form-group">
          <label class="form-label">Email</label>
          <input class="form-input form-input-full" type="email" value="johndoe@nwu.ac.za" placeholder="Email">
        </div>
        <div class="form-group">
          <label class="form-label">Password</label>
          <input class="form-input form-input-full" type="password" placeholder="New Password">
        </div>
        <div class="form-group">
          <label class="form-label">Confirm Password</label>
          <input class="form-input form-input-full" type="password" placeholder="Confirm New Password">
        </div>
        <div class="form-group">
          <label class="form-label">Cellphone Number</label>
          <input class="form-input form-input-full" type="text" value="0721389459" placeholder="Cellphone No">
        </div>
        <div class="form-group">
          <button class="btn btn-primary" type="submit">Save Changes</button>
        </div>
      </form>
    </div>
  `, profileSection);
}
