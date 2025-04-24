// Convert hex color to HSL
function hexToHSL(hex) {
  // Remove the # if present
  hex = hex.replace(/^#/, '');
  
  // Parse the hex values
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  
  // Find the min and max values to compute the lightness
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  
  let h, s;
  
  if (max === min) {
    // Achromatic (gray)
    h = s = 0;
  } else {
    // Calculate hue and saturation
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: h = 0;
    }
    
    h /= 6;
  }
  
  // Convert to degrees and percentages
  const hDeg = Math.round(h * 360);
  const sPct = Math.round(s * 100);
  const lPct = Math.round(l * 100);
  
  return { h: hDeg, s: sPct, l: lPct, hslString: `${hDeg} ${sPct}% ${lPct}%` };
}

const hex = "#507286";
const result = hexToHSL(hex);

console.log(`Hex: ${hex}`);
console.log(`HSL: ${result.hslString}`);
console.log(`H: ${result.h}, S: ${result.s}%, L: ${result.l}%`);