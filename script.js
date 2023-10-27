let clipboard = new ClipboardJS("#copy");

let colorViewer = document.getElementById("colorViewer");
let colCode = document.getElementById("colCode");
let generatedColour = "#212121";
let colorHistoryUL = document.getElementById("colorHistoryUL");

let colorHistory = [];
if (localStorage.getItem("colorHistory") !== null) {
  colorHistory = JSON.parse(localStorage.getItem("colorHistory"));
} else {
  colorHistory = ["#212121"];
}

const setAsCurrent = (e) => {
  colorViewer.style.backgroundColor = e;
  colCode.textContent = e;
};

const createElement = (color) => {
  colorViewer.style.backgroundColor = color[0];
  colCode.textContent = color[0];
  colorHistoryUL.innerHTML = "";
  colorHistory.forEach((color) => {
    let createdEl = document.createElement("li");
    createdEl.textContent = color;
    createdEl.style.backgroundColor = color;
    colorHistoryUL.appendChild(createdEl);
  });
};
createElement(colorHistory);

let refresh = document
  .getElementById("refresh")
  .addEventListener("click", (e) => {
    const hexString = "0123456789ABCDEF";
    generatedColour = "#";
    for (let i = 1; i <= 6; i++) {
      generatedColour += hexString.charAt(Math.floor(Math.random() * 16));
    }
    colorHistory.unshift(generatedColour);
    if (colorHistory.length > 10) {
      colorHistory.pop();
    }
    createElement(colorHistory);
    localStorage.setItem("colorHistory", JSON.stringify(colorHistory));

    document.querySelectorAll("li").forEach((li) => {
      li.addEventListener("click", (e) => {
        setAsCurrent(e.target.textContent);
      });
    });
  });

document.getElementById("clearHistory").addEventListener("click", (e) => {
  colorHistory = ["#212121"];
  createElement(colorHistory);
  localStorage.setItem("colorHistory", JSON.stringify(colorHistory));
});
