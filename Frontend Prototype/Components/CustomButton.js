export function CustomBtn({ title, onClick }) {
  const btn = document.createElement("button");
  btn.textContent = title;
  btn.className = "button";
  btn.onclick = onClick;
  return btn;
}
