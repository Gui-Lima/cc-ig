# cc-ig

## How to run
Just paste this code in any browser's console and press enter, then call the function you want with the values you want.

## Examples

### Rgb to Hsi
Converting the color grey(100, 100, 100) to hsi through our function outputs {h: 0, s: 0, i : 100}, which outputs the same grey.
More good test values are 
* (0,0,0) -> (0,0,0)
* (255, 255, 255) -> (0, 0, 255)
* (224, 82, 132) -> (339.69, 0.4, 146)


### Hsi to Rgb
The same tests as above work as they do the opposite direction.


### Rgb to Lab
Converting the same color grey(100, 100, 100) to lab through lab using our function outputs {l: 42.37, a: 0.0026, b: -0.0052} which is indeed the same grey.
More good test values are
* (0, 0, 0) -> (0, 0, 0)
* (255, 255, 255) -> (100, 0.0052, -0.010408)
* (132, 255, 48) -> (90.15, -65.54, 79.333)

### Lab to Rgb
The same tests as above work as they do the opposite direction.


You can check the results using http://colorizer.org
