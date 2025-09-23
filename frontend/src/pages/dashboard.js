// Basic dashboard renderer for tab
import { html, render } from "lit";

export function renderDashboard() {
  const dashboardSection = document.getElementById("dashboard");
  const template = html`
    <p>Welcome to your dashboard. Overview and quick links will appear here.</p>
  `;
  render(template, dashboardSection);
}
