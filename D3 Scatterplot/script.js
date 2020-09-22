/* SETUP steps
 * select svg tag and assign to variable
 * Define position and size of canvas and position content
 * Define scales
 */

let svg = d3.select("svg");
let container = d3.select(".container");

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
  data.forEach((d) => {
    d.Seconds = new Date(d.Seconds * 1000);
    d.URL = d.URL == "" ? false : true;
  });
  drawChart(data);
});

let drawChart = (dataObj) => {
  /** DATA FORMAT
  Time: "37:15",
  Place: 3,
  Seconds: 2235,
  Name: "Marco Pantani",
  Year: 1994,
  Nationality: "ITA",
  Doping: "Alleged drug use during 1994 due to high hermatocrit levels",
  URL: "https://en.wikipedia.org/wiki/Marco_Pantani#Alleged_drug_use"
   */

  //set domain
  xScale.domain([
    d3.min(dataObj, (d) => d.Year) - 1,
    d3.max(dataObj, (d) => d.Year) + 1,
  ]);
  yScale.domain(d3.extent(dataObj, (d) => d.Seconds));

  //draw axis
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

  canvasContent
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0,${visHeight})`)
    .call(xAxis);

  canvasContent.append("g").attr("id", "y-axis").call(yAxis);
  const tooltip = container.append("div").attr("id", "tooltip");

  //draw points
  canvasContent
    .selectAll("circle")
    .data(dataObj)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("r", "5")
    .attr("data-xvalue", (d) => d.Year)
    .attr("data-yvalue", (d) => d.Seconds)
    .attr("cx", (d) => xScale(d.Year))
    .attr("cy", (d) => yScale(d.Seconds))
    .attr("fill", (d) => {
      return d.URL == false ? colors[0] : colors[1];
    })
    .on("mouseover", (d) => {
      let data = d.target.__data__;
      console.log(d);
      tooltip
        .style("opacity", "1")
        .style("left", `${d.layerX + 10}px`)
        .style("top", `${d.layerY - 50}px`)
        .attr("data-year", data.Year)
        .html(() => {
          return `<h3>${data.Name}</h3><h4>Year: ${data.Year}, Time: ${data.Time} </h4><p>${data.Doping}</p>`;
        });
    })
    .on("mouseout", () => {
      d3.select("#tooltip").style("opacity", "0");
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
