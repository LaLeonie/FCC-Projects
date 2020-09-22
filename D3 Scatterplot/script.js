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
const xScale = d3.scaleLinear().range([0, visWidth]);
const yScale = d3.scaleTime().range([0, visHeight]);

//create time converter function
const parseYear = d3.timeParse("%Y"); //converst time to Date object
const parseTime = d3.timeParse("%M:%S");
const timeToYear = d3.timeFormat("%Y");
const timeToMinAndSec = d3.timeFormat("%M:%S");

/* DATA SET
 * data set is array of objects with time, place, seconds, name, year
 * Turn data into array [time, seconds, year]
 */

// Get Data
let url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
d3.json(url).then((data) => {
  let dataset = [];
  data.map((d) => dataset.push([d.Time, d.Seconds, d.Year]));
  drawChart(dataset);
});

let drawChart = (dataArray) => {
  /**
   * data is an array containing 275+ arrays
   * each data[i] array nests a three dimensional array
   * d[i][0] contains information regarding time in min:sec format
   * d[i][1] contains information regarding time in sec format
   * d[i][2] contains information about the year
   */

  // format data
  dataArray.forEach((d) => {
    d[0] = parseTime(d[0]);
    d[1] = new Date(d[1] * 1000);
    d[2] = d[2];
  });

  console.log(dataArray);

  //set domain
  xScale.domain(d3.extent(dataArray, (d) => d[2]));
  yScale.domain(d3.extent(dataArray, (d) => d[0])).tickFormat(function (d, i) {
    return data[i];
  });

  //draw axis
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  const yAxis = d3.axisLeft(yScale);

  canvasContent
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0,${visHeight})`)
    .call(xAxis);

  canvasContent.append("g").attr("id", "y-axis").call(yAxis);

  //draw points
  canvasContent
    .selectAll("circle")
    .data(dataArray)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("r", "5")
    .attr("data-xvalue", (d) => d[2])
    .attr("data-yvalue", (d) => d[1])
    .attr("cx", (d, i) => xScale(d[2]));
};
