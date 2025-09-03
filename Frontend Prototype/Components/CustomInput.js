
export function CustomInput({
  placeholder,
  id,
  type = "text",
  value,
  onChange,
}) {
  const input = document.createElement("input");
  input.value = value;
  input.type = type;
  input.placeholder = placeholder;
  input.className = "input";
  input.id = id;

  input.addEventListener("input", (e) => {
    if (onChange) onChange(e.target.value);
  });

  return input;
}
