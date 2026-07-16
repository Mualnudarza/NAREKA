const display = document.getElementById("display");
let expression = "";

document.getElementById("keys").addEventListener("click", (e) => {
  const key = e.target.dataset.key;
  if (!key) return;

  if (key === "C") {
    expression = "";
  } else if (key === "=") {
    try {
      expression = String(Function('"use strict";return (' + expression + ')')());
    } catch {
      expression = "Error";
    }
  } else {
    expression += key;
  }
  display.value = expression || "0";
});
