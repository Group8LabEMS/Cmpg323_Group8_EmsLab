// Basic profile renderer for tab
import { html, render } from "lit";

export function renderProfile() {
  const profileSection = document.getElementById("profile");
  render(html`   
      <form class="profile-form">
        <input class="inputField" type="text" value="John" placeholder="First Name" readonly>
        <input class="inputField" type="text" value="Doe" placeholder="Last Name" readonly>
        <input class="inputField" type="text" value="12345678" placeholder="University No" readonly>
        <input class="inputField" type="password" value="Password" placeholder="Password">
        <input class="inputField" type="email" value="johndoe@nwu.ac.za" placeholder="Email">
        <input class="inputField" type="password" value="Re-enter Password" placeholder="Re-enter Password">
        <input class="inputField" type="text" value="0721389459" placeholder="Cellphone No" style="grid-column: 1 / 2;">
        <button class="primary-button" type="submit" style="grid-column: 2 / 3;">Save</button>
      </form>
  `, profileSection);
}
