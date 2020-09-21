/* SETUP steps
 * select svg tag and assign to variable
 * Define position and size of canvas and position content
 * Define scales
 */

let svg = d3.select("svg");
let container = d3.select("container");

const width = 800;
const height = 400;
const margin = {
  top: 20,
  right: 20,
  bottom: 20,
  left: 50,
};

let visWidth = width - margin.right - margin.left;
let visHeight = height - margin.top - margin.bottom;

const containerCanvas = svg.attr("viewBox", `0 0 ${width} ${height}`);
const canvasContent = containerCanvas
  .append("g")
  .attr("transform", `translate(${margin.left} ${margin.top})`);

// Create scales
const xScale = d3.scaleTime().range([0, visWidth]);
const yScale = d3.scaleTime().range([visHeight, 0]);

/* DATA SET
 * data set is array of objects with time, place, seconds, name, year
 * Turn data into array with year and times in minutes
 */

// Get Data
let url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
d3.json(url).then((data) => {
  let dataset = [];
  data.map((d) => dataset.push([d.Time, d.Seconds, d.Year]));
  console.log(dataset);
  drawChart(dataset);
});

let drawChart = (dataArray) => {};
