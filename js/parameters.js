

var FPS = 10;
var wallPadding = 20; //pixels of wall padding to show wall interactions


var parameters = {
    'dt': 1.0 / FPS,
    'mass': 1, 
    'kernelSize': 500, 
    'gasConstantK': 1000000000,
    'viscosityConstant': 1000,
    'restDensity': 0,
    'sigma': 0.072,
    'nThreshold': 0.02,
    'gravity': [0, 9.82], 
    'leftBound': 0,
    'rightBound': 100,
    'bottomBound': 0, 
    'topBound': 100,
    'wallDamper': 0.8,
    'cellGrid' : []
}