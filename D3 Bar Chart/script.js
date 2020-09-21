/* SETUP steps
 * select svg tag and assign to variable
 * Define position and size of canvas and position content
 * Define scales
 * Define functions to handle/convert times
 */

// SETUP
let url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

let svg = d3.select("svg");
let container = d3.select(".container");

const margin = {
  top: 20,
  right: 20,
  bottom: 20,
  left: 50,
};

// width and height of vizualisation is canvas size - margin
const width = 800 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// define position and size of svg canvas
const containerCanvas = svg.attr(
  "viewBox",
  `0 0 ${width + margin.left + margin.right}  ${
    height + margin.top + margin.bottom
  }`
);

// create subcanvas for content and define position
const canvasContents = containerCanvas
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Create scales
const xScale = d3.scaleTime().range([0, width]);
const yScale = d3.scaleLinear().range([height, 0]);

// Define a parse function to parse dates from dataset
const parseTime = d3.timeParse("%Y-%m-%d"); //converst time to Date object
const formatTime = d3.timeFormat("%Y-%m-%d"); //converst date Object to string

/** DATA
 * Retrieve data with d3.json and call drawBarChart function
 * Define a function which draws the data visualization based on the data array
 * plot the chart by including rectangle elements in the SVG in the established area
 * include a tooltip through a div (the tooltip should appear on the basis of the mouseenter and mouseout events, on the rectangle elements)
 */

d3.json("/data.json").then(function (data) {
  dataset = data.data;
  drawBarChart(dataset);
});

function drawBarChart(data) {
  /**
   * data is an array containing 275+ arrays
   * each data[i] array nests a two dimensional array
   * d[i][0] contains information regarding the date of the GDP measurement
   * d[i][1] contains information regarding the value of the GDP
   */

  // format data
  data.forEach((d) => {
    d[0] = parseTime(d[0]);
    d[1] = +d[1];
  });

  // set domain
  xScale.domain(d3.extent(data, (d) => d[0]));
  yScale.domain(d3.extent(data, (d) => d[1])).nice();

  // draw axes
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  canvasContents
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(xAxis);

  canvasContents.append("g").attr("id", "y-axis").call(yAxis);

  //create tooltip
  const tooltip = container.append("div").attr("id", "tooltip");

  //plot chart
  canvasContents
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .on("mouseenter", (data) => {
      barData = data.target.__data__;
      tooltip
        .style("opacity", 1)
        .style("left", `${data.layerX - 100}px`)
        .style("top", `${data.layerY - 40}px`)
        .attr("data-date", formatTime(barData[0]))
        .text(() => {
          let year = barData[0].getFullYear();
          let quarter =
            barData[0].getMonth() == 0
              ? "Q1"
              : barData[0].getMonth() == 3
              ? "Q2"
              : barData[0].getMonth() == 6
              ? "Q3"
              : "Q4";

          return `${year} ${quarter} ${barData[1]}`;
        });
    })
    .on("mouseout", () => {
      tooltip.style("opacity", 0);
    })
    .attr("class", "bar")
    .attr("data-date", (d) => formatTime(d[0]))
    .attr("data-gdp", (d) => d[1])
    .attr("x", (d) => xScale(new Date(d[0])))
    .attr("width", width / data.length)
    .attr("y", (d) => yScale(d[1]))
    .attr("height", (d) => height - yScale(d[1]));
}
