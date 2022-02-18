/* CONSTANTS */

const FULL_CIRCLE = 360
const MAX_RGB = 255

/* AUXILIARY FUNCTIONS  */

//Since most trigonometry functions give their result back in rad, and the formulas work with dgs, we need this conversion
const radToDg = (rad) => {
    return rad * 180/Math.PI
}

const cosInDg = x => {
    return radToDg(Math.cos(x))
}

// The hsiToRgb function can return above 255 values that must be truncated to 255.
const minTo255 = ({r, g ,b}) => {
    return {r: Math.min(r, MAX_RGB), g: Math.min(g, MAX_RGB), b : Math.min(b, MAX_RGB)}
}

/* RGB -> HSI -> RGB*/

// To convert rgb to hsi we need to do simple calculations
const rgbToHsi = (r, g, b) => {
	const i = (r + g + b) / 3
	const s = i > 0 ? 1 - Math.min(Math.min(r,g), b)/i : 0

	const temp = (r-0.5*g-0.5*b) / Math.sqrt(Math.pow(r, 2) + Math.pow(g, 2) + Math.pow(b, 2) - r*g - r*b - g*b)

    // If the sqrt result is 0
    if(isNaN(temp)){
        return {h:0, s, i}
    }
	const h = g >= b ? radToDg(Math.acos(temp)) : 360 - radToDg(Math.acos(temp))

return {h, s, i}
}

// To convert hsi to rgb though, we need to make decisions based on the degree passed in the hue value
const hsiToRgb = (h, s, i) => {
    let rgb = {r: 0, g: 0, b: 0}

    if(h >= FULL_CIRCLE){
        h = h - 360
    }

	if(h === 0){
        rgb = {r: i + 2*i*s, g: i - i*s, b: i - i*s}	
	}
	else if(h < 120) {
		rgb = {r: i + i * s * cosInDg(h)/cosInDg(60 - h), g: i + i * s * (1- cosInDg(h)/cosInDg(60-h)), b: i - i*s}
	}
    else if(h === 120){
        rgb =  {r: i - i*s, g: i + 2 * i * s, b: i - i*s}
    }
    else if(h < 240){
        rgb =  {r: i - i*s, g : i + i * s * cosInDg(h-120)/cosInDg(180-h), b: i + i *s*(1-cosInDg(h-120)/cosInDg(180-h))}
    }
    else if(h === 240){
        rgb =  {r: i - i*s, g: i - i*s, b: i+2*i*s}
    }
    else if(h < 360){
        rgb = {r: i + i *s*(1-cosInDg(h -240)/cosInDg(300-h)), g: i - i *s, b: i + i * s * cosInDg(h - 240)/cosInDg(300-h)}
    }

    return minTo255(rgb)
}
