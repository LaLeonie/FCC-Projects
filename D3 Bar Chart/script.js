// SETUP
let url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
let req = new XMLHttpRequest();

let data;
let values;

let heightScale;
let xScale;
let xAxisScale;
let yAxisScale;

let width = 800;
let height = 600;
let padding = 40;

// Selections
let svg = d3.select("svg");

let drawCanvas = () => {
  svg.attr("width", width);
  svg.attr("height", height);
};

let generateScales = () => {};

let drawBars = () => {};

// Generate x and y axis
let generateAxes = () => {};

// EXECUTION
// create JS object from data
req.open("GET", url, true);
req.onload = () => {
  console.log(req.responseText);
};
req.send();
