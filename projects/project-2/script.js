const chart = document.getElementById("chart");
for (let i = 0; i < 12; i++) {
  const bar = document.createElement("div");
  const height = 20 + Math.round(Math.random() * 80);
  bar.style.height = height + "%";
  bar.title = "Bulan " + (i + 1) + ": " + height;
  chart.appendChild(bar);
}
