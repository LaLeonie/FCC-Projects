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
  // Create y and x scales for translation
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

  // Create scale for y axis to be drawn
  yAxisScale = d3
    .scaleLinear()
    .domain([0, d3.max(values, (item) => item[1])])
    .range([height - padding, padding]);
};

let drawBars = () => {
  svg
    .selectAll("rect")
    .data(values) // associate data array with all rectangle values
    .enter() // for each data value that does not have a rectangle
    .append("rect") // create a rectangle
    .attr("class", "bar")
    .attr("width", width - (2 * padding) / values.length);
};

let generateAxes = () => {
  let xAxis = d3.axisBottom(xAxisScale);
  let yAxis = d3.axisLeft(yAxisScale);

  svg
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + (height - padding) + ")");

  svg
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", "translate(" + padding + ",0)");
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
