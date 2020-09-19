// SETUP
let url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
let req = new XMLHttpRequest();

let data;
let values = [];

let heightScale;
let xScale;
let xAxisScale;
let yAxisScale;

let width = 800;
let height = 600;
let padding = 40;

let svg = d3.select("svg");

let drawCanvas = () => {
  svg.attr("width", width);
  svg.attr("height", height);
};

let generateScales = () => {
  // Create y and x axis
  heightScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(values, (item) => {
        return item[1];
      }),
    ])
    .range([0, height - 2 * padding]);

  xScale = d3
    .scaleLinear()
    .domain([0, values.length - 1])
    .range([padding, width - padding]);

  // Create scale for x axis to be drawn
  let datesArray = values.map((item) => new Date(item[0]));
  console.log(datesArray);
  xAxisScale = d3
    .scaleTime()
    .domain([d3.min(datesArray), d3.max(datesArray)])
    .range([padding, width - padding]);

  // Create scale for y axis
  yAxisScale = d3
    .scaleLinear()
    .domain([0, d3.max(values, (item) => item[1])])
    .range([height - padding, padding]);
};

let drawBars = () => {};

let generateAxes = () => {
  let xAxis = d3.axisBottom(xAxisScale);
  svg
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + (height - padding) + ")");
};

// EXECUTION
// create JS object from data
req.open("GET", url, true);
req.onload = () => {
  data = JSON.parse(req.responseText);
  values = data.data;
  console.log(values);
  drawCanvas();
  generateScales();
  drawBars();
  generateAxes();
};
req.send();
