// 顏色轉 RGB
function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
}

// RGB 轉 HEX
function rgbToHex(rgb) {
    return (
        "#" +
        rgb
            .map(c => c.toString(16).padStart(2, "0"))
            .join("")
    );
}

// RGB 轉 HSL
function rgbToHsl([r, g, b]) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if(max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
            case g: h = ((b - r) / d + 2); break;
            case b: h = ((r - g) / d + 4); break;
        }
        h *= 60;
    }
    return [h, s, l];
}

// HSL 轉 RGB
function hslToRgb([h, s, l]) {
    s = Math.min(Math.max(s, 0), 1);
    l = Math.min(Math.max(l, 0), 1);

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c/2;
    let r1, g1, b1;

    if(h < 60){ r1=c; g1=x; b1=0; }
    else if(h < 120){ r1=x; g1=c; b1=0; }
    else if(h < 180){ r1=0; g1=c; b1=x; }
    else if(h < 240){ r1=0; g1=x; b1=c; }
    else if(h < 300){ r1=x; g1=0; b1=c; }
    else { r1=c; g1=0; b1=x; }

    const r = Math.round((r1 + m) * 255);
    const g = Math.round((g1 + m) * 255);
    const b = Math.round((b1 + m) * 255);
    return [r, g, b];
}

// HSL 調整色相
function shiftHue(rgb, deg) {
    let [h, s, l] = rgbToHsl(rgb);
    h = (h + deg) % 360;
    return hslToRgb([h, s, l]);
}

// 產生和諧搭配色 (帶標籤)
function generatePaletteWithLabels(baseHex) {
    const baseRgb = hexToRgb(baseHex);

    return [
        { label: "互補色", color: rgbToHex(shiftHue(baseRgb, 180)) },
        { label: "互補色", color: rgbToHex(shiftHue(baseRgb, 195)) },
        { label: "類似色", color: rgbToHex(shiftHue(baseRgb, 30)) },
        { label: "類似色", color: rgbToHex(shiftHue(baseRgb, -30)) },
        { label: "三角配色", color: rgbToHex(shiftHue(baseRgb, 120)) }
    ];
}

// 更新畫面
function updatePalette() {
    const baseColor = document.querySelector(".color-input").value;
    const paletteContainer = document.querySelector(".palette-container");
    paletteContainer.innerHTML = "";

    const palette = generatePaletteWithLabels(baseColor);

    palette.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("color-card");
        div.style.backgroundColor = item.color;

        // 文字標籤
        const labelSpan = document.createElement("span");
        labelSpan.textContent = item.label;
        labelSpan.style.fontSize = "0.6rem";
        labelSpan.style.fontWeight = "400";
        labelSpan.style.position = "absolute";
        labelSpan.style.bottom = "4px";
        labelSpan.style.left = "50%";
        labelSpan.style.transform = "translateX(-50%)";
        labelSpan.style.backgroundColor = "rgba(0,0,0,0.3)";
        labelSpan.style.padding = "2px 4px";
        labelSpan.style.borderRadius = "4px";

        // 為卡片相對定位
        div.style.position = "relative";

        div.textContent = item.color;
        div.appendChild(labelSpan);
        paletteContainer.appendChild(div);
    });
}

// 綁定事件
document.querySelector(".generate-btn").addEventListener("click", updatePalette);

// 初始生成
updatePalette();
