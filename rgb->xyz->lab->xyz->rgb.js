/* CONSTANTS */
const MAX_RGB = 255
const MAX_XYZ = 100

const reference_x =  95.047;
const reference_y = 100.000;
const reference_z = 108.883;

/* RGB -> XYZ -> LAB -> XYZ -> RGB*/

// To convert rgb to lab, first we need to convert rgb to xyz, then xyz to lab

//To convert rgb to xyz, we need to do simple calculations and decisions
const rgbToXyz = (r,g,b) => {
    const normalized_r = r/MAX_RGB
    const normalized_g = g/MAX_RGB
    const normalized_b = b/MAX_RGB

    const true_r = normalized_r > 0.04045 ? Math.pow(((normalized_r + 0.055) /1.055), 2.4) : normalized_r / 12.92 
    const true_g = normalized_g > 0.04045 ?Math.pow(((normalized_g + 0.055) /1.055), 2.4) : normalized_g / 12.92
    const true_b = normalized_b > 0.04045 ?Math.pow(((normalized_b + 0.055) /1.055), 2.4) : normalized_b / 12.92

    const x = true_r * MAX_XYZ * 0.4124 + true_g * MAX_XYZ * 0.3576 + true_b * MAX_XYZ * 0.1805
    const y = true_r * MAX_XYZ * 0.2126  + true_g * MAX_XYZ * 0.7152  + true_b * MAX_XYZ * 0.0722
    const z = true_r * MAX_XYZ * 0.0193  + true_g * MAX_XYZ * 0.1192  + true_b * MAX_XYZ * 0.9505

    return {x, y, z}
}

//Same with xyz to Lab, with the addition to these reference values. I've used common reference values.
const xyzToLab = (x, y, z) => {
    const normalized_x = x /reference_x
    const normalized_y = y /reference_y
    const normalized_z = z /reference_z

    const true_x = normalized_x > 0.008856 ? Math.pow(normalized_x, 1/3) : (7.787 * normalized_x) + (16/116)
    const true_y = normalized_y > 0.008856 ? Math.pow(normalized_y, 1/3) : (7.787 * normalized_y) + (16/116)
    const true_z = normalized_z > 0.008856 ? Math.pow(normalized_z, 1/3) : (7.787 * normalized_z) + (16/116)

    const l = (116 * true_y) - 16
    const a = 500 * (true_x - true_y)
    const b = 200 * (true_y - true_z)

    return {l,a,b}
}

const rgbToLab = (r, g, b) => {
    const {x, y, z} = rgbToXyz(r, g, b)
    return xyzToLab(x, y, z)
}


const labToXyz = (l, a, b) => {
    const y = (l + 16) / 116
    const x = a /500 + y
    const z = y - b / 200
    
    const true_y = Math.pow(y, 3) > 0.008856 ? Math.pow(y, 3) : (y - 16 / 116) / 7.787
    const true_x = Math.pow(x, 3) > 0.008856 ? Math.pow(x, 3) : (x - 16 / 116) / 7.787
    const true_z = Math.pow(z, 3) > 0.008856 ? Math.pow(z, 3) : (z - 16 / 116) / 7.787

    return {x: true_x * reference_x, y : true_y * reference_y, z: true_z * reference_z}
}

const xyzToRgb = (x,y,z) => {
    const normalized_x = x / MAX_XYZ
    const normalized_y = y / MAX_XYZ
    const normalized_z = z / MAX_XYZ

    const r = normalized_x *  3.2406 + normalized_y * -1.5372 + normalized_z * -0.4986
    const g = normalized_x * -0.9689 + normalized_y *  1.8758 + normalized_z *  0.0415
    const b = normalized_x *  0.0557 + normalized_y * -0.2040 + normalized_z *  1.0570

    const true_r = r > 0.0031308 ? 1.055 * (Math.pow(r, 1/2.4)) - 0.055 : 12.92 * r
    const true_g = g > 0.0031308 ? 1.055 * (Math.pow(g, 1/2.4)) - 0.055 : 12.92 * g
    const true_b = b > 0.0031308 ? 1.055 * (Math.pow(b, 1/2.4)) - 0.055 : 12.92 * b

    return {r: true_r * MAX_RGB, g: true_g * MAX_RGB, b: true_b * MAX_RGB}
}

const labToRgb = (l, a, b) => {
    const {x, y, z} = labToXyz(l,a ,b)
    return xyzToRgb(x, y, z)
}


/*

Reference values

Observer	2 (CIE 1931)	10 (CIE 1964)	Note
Illuminant	X2	Y2	Z2	       X10	Y10	 Z10	 
A	109.850	100.000	35.585	111.144	100.000	35.200	Incandescent/tungsten
B	99.0927	100.000	85.313	99.178;	100.000	84.3493	Old direct sunlight at noon
C	98.074	100.000	118.232	97.285	100.000	116.145	Old daylight
D50	96.422	100.000	82.521	96.720	100.000	81.427	ICC profile PCS
D55	95.682	100.000	92.149	95.799	100.000	90.926	Mid-morning daylight
D65	95.047	100.000	108.883	94.811	100.000	107.304	Daylight, sRGB, Adobe-RGB
D75	94.972	100.000	122.638	94.416	100.000	120.641	North sky daylight
E	100.000	100.000	100.000	100.000	100.000	100.000	Equal energy
F1	92.834	100.000	103.665	94.791	100.000	103.191	Daylight Fluorescent
F2	99.187	100.000	67.395	103.280	100.000	69.026	Cool fluorescent
F3	103.754	100.000	49.861	108.968	100.000	51.965	White Fluorescent
F4	109.147	100.000	38.813	114.961	100.000	40.963	Warm White Fluorescent
F5	90.872	100.000	98.723	93.369	100.000	98.636	Daylight Fluorescent
F6	97.309	100.000	60.191	102.148	100.000	62.074	Lite White Fluorescent
F7	95.044	100.000	108.755	95.792	100.000	107.687	Daylight fluorescent, D65 simulator
F8	96.413	100.000	82.333	97.115	100.000	81.135	Sylvania F40, D50 simulator
F9	100.365	100.000	67.868	102.116	100.000	67.826	Cool White Fluorescent
F10	96.174	100.000	81.712	99.001	100.000	83.134	Ultralume 50, Philips TL85
F11	100.966	100.000	64.370	103.866	100.000	65.627	Ultralume 40, Philips TL84
F12	108.046	100.000	39.228	111.428	100.000	40.353	Ultralume 30, Philips TL83
*/
