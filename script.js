let colorViewer = document.getElementById("colorViewer");
let colCode = document.getElementById("colCode");
let clipboard = new ClipboardJS("#copy");
let generatedColour = "#212121";
let colorHistoryUL = document.getElementById("colorHistoryUL");

let refresh = document
  .getElementById("refresh")
  .addEventListener("click", (e) => {
    const hexString = "0123456789ABCDEF";
    generatedColour = "#";
    for (let i = 1; i <= 6; i++) {
      generatedColour += hexString.charAt(Math.floor(Math.random() * 16));
    }
    colorViewer.style.backgroundColor = generatedColour;
    colCode.innerText = generatedColour;

    let createdEl = document.createElement("li");
    createdEl.textContent = generatedColour;
    createdEl.style.backgroundColor = generatedColour;
    if (colorHistoryUL.children.length >= 9) {
      colorHistoryUL.removeChild(colorHistoryUL.lastChild);
    }
    colorHistoryUL.insertBefore(createdEl, colorHistoryUL.firstChild);
  });
