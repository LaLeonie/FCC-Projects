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
  bottom: 50,
  left: 80,
};

let colors = ["#B66D0D", "#679436"];

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
  data.map((d) => dataset.push([d.Time, d.Seconds, d.Year, d.Doping]));
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
    d[3] = d[3] == "" ? false : true;
  });
  console.log(dataArray);

  //set domain
  xScale.domain([
    d3.min(dataArray, (d) => d[2]) - 1,
    d3.max(dataArray, (d) => d[2]) + 1,
  ]);
  yScale.domain(d3.extent(dataArray, (d) => d[1]));

  //draw axis
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

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
    .attr("cx", (d, i) => xScale(d[2]))
    .attr("cy", (d) => yScale(d[1]))
    .attr("fill", (d) => {
      return d[3] == false ? colors[0] : colors[1];
    });

  // Add label to axis
  canvasContent
    .append("text")
    .attr("transform", `translate(${visWidth / 2},${visHeight + 40})`)
    .style("text-anchor", "middle")
    .text("Year");

  canvasContent
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - 50)
    .attr("x", 0 - visHeight / 2)
    .style("text-anchor", "middle")
    .text("Time");

  //Add legend

  let legendContainer = canvasContent.append("g").attr("id", "legend");

  let legend = legendContainer
    .selectAll("#legend")
    .data(colors)
    .enter()
    .append("g")
    .attr("class", "legend-label")
    .attr("transform", function (d, i) {
      return "translate(0," + (height / 2 - i * 20) + ")";
    });

  legend
    .append("rect")
    .attr("x", visWidth - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", (d) => d);

  legend
    .append("text")
    .attr("x", visWidth - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function (d) {
      if (d == "#B66D0D") return "Riders with doping allegations";
      else {
        return "No doping allegations";
      }
    });
};
