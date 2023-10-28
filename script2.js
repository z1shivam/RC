const clipboard = new ClipboardJS("#copy");
const clipboard2 = new ClipboardJS("#hsl");
const clipboard3 = new ClipboardJS("#rgb");

const colorViewer = document.getElementById("colorViewer");
const colCode = document.getElementById("colCode");
const colorHistoryUL = document.getElementById("colorHistoryUL");
const hslBtn = document.getElementById("hslBtn");
const rgbBtn = document.getElementById("rgbBtn");

let colorHistory = JSON.parse(localStorage.getItem("colorHistory")) || ["#212121"];

function hexToRGBHSL(hex) {
    hex = hex.replace(/^#/, "");
    const r = parseInt(hex.slice(0, 2), 16) / 255;
    const g = parseInt(hex.slice(2, 4), 16) / 255;
    const b = parseInt(hex.slice(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // Achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }

        h /= 6;
    }

    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    const colorRange = generateColorRange(h, s);

    return {
        rgb: `RGB(${r * 255}, ${g * 255}, ${b * 255})`,
        hsl: `HSL(${h}, ${s}%, ${l}%)`,
        colorRange: colorRange,
    };
}

function hslToRgb(h, s, l) {
    let r, g, b;

    if (s === 0) {
        r = g = b = l;
    } else {
        const hueToRgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hueToRgb(p, q, h + 1 / 3);
        g = hueToRgb(p, q, h);
        b = hueToRgb(p, q, h - 1 / 3);
    }

    const toHex = (x) => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    };

    return "#" + toHex(r) + toHex(g) + toHex(b);
}

function generateColorRange(hue, saturation) {
    const hexCodes = [];
    const lightnessStep = 10;

    for (let i = 10; i <= 80; i += lightnessStep) {
        const lightness = i;
        const color = hslToRgb(hue / 360, saturation / 100, lightness / 100);
        hexCodes.unshift(color);
    }

    return hexCodes;
}

const setAsCurrent = (e) => {
    colorViewer.style.backgroundColor = e;
    colCode.textContent = e;
    const { rgb, hsl } = hexToRGBHSL(e);
    rgbBtn.innerText = rgb;
    hslBtn.innerText = hsl;
    colorChanger(hexToRGBHSL(e).colorRange);
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
    document.querySelectorAll("li").forEach((li) => {
        li.addEventListener("click", (e) => {
            setAsCurrent(e.target.textContent);
        });
    });
};
createElement(colorHistory);

const refresh = () => {
    const hexString = "0123456789ABCDEF";
    generatedColour = "#";
    for (let i = 1; i <= 6; i++) {
        generatedColour += hexString.charAt(Math.floor(Math.random() * 16));
    }
    colorHistory.unshift(generatedColour);
    if (colorHistory.length > 10) {
        colorHistory.pop();
    }
    const { rgb, hsl, colorRange } = hexToRGBHSL(generatedColour);
    rgbBtn.innerText = rgb;
    hslBtn.innerText = hsl;
    colorChanger(colorRange);
    createElement(colorHistory);
    localStorage.setItem("colorHistory", JSON.stringify(colorHistory));
    document.querySelectorAll("li").forEach((li) => {
        li.addEventListener("click", (e) => {
            setAsCurrent(e.target.textContent);
        });
    });
};

document.getElementById("refresh").addEventListener("click", refresh);
document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        refresh();
    }
});

document.getElementById("clearHistory").addEventListener("click", () => {
    // colorHistory = ["#212121"];
    // createElement(colorHistory);
    // colorChanger(hexToRGBHSL(colorHistory[0]).colorRange);
    // localStorage.setItem("colorHistory", JSON.stringify(colorHistory));
    localStorage.clear();
    location.reload();
});

const colorChanger = (colorRange) => {
    const colorBlock = document.getElementById("colorGrid").children;
    for (let i = 0; i < colorBlock.length; i++) {
        if (i === 0 || i === 1) {
            colorBlock[i].style.color = "#212121";
        }
        colorBlock[i].style.backgroundColor = colorRange[i];
        colorBlock[i].innerText = colorRange[i];
    }
};

colorChanger(hexToRGBHSL(colorHistory[0]).colorRange);

const colorBlocks = document.querySelectorAll(".colorBlock");
colorBlocks.forEach((colorBlock) => {
    colorBlock.addEventListener("click", (e) => {
        colorViewer.style.backgroundColor = e.target.textContent;
        colCode.textContent = e.target.textContent;
        const { rgb, hsl } = hexToRGBHSL(e.target.textContent);
        rgbBtn.innerText = rgb;
        hslBtn.innerText = hsl;
    });
});
