// Basic profile renderer for tab
import { html, render } from "lit";

export function renderProfile() {
  const profileSection = document.getElementById("profile");
  const template = html`
    <p>This is your profile page. User details and settings will appear here.</p>
  `;
  render(template, profileSection);
}
