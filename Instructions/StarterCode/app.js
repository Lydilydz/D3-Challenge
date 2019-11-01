// @TODO: YOUR CODE HERE!
// Creating the chart
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 60,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// space for placing words
var labelArea = 110;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  // .select(".chart")
  // 
  .select("#scatter")
  .attr("class", "chart")
  // 
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "age";

// function used for updating x-scale var upon click on axis label
function xScale(smokersData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(smokersData, d => d[chosenXAxis]) * 0.8,
    d3.max(smokersData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXaxis]));

  return circlesGroup;
}

// 
function renderCircles(textGroup, newXScale, chosenXaxis) {

  textGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXaxis]));

  return textGroup;
}
// 
// text group start 

function renderCircles(textGroup, newXScale, chosenXaxis) {

  textGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXaxis]));

  return textGroup;
}
// finish

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup,textGroup) {

  if (chosenXAxis === "age") {
    var label = "Average Age of smoker:";
  }
  else {
    var label = "Smokers Average Income";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function (d) {
      console.log(d)
      return (`${d.abbr}<br>${label} ${d[chosenXAxis]}`);
    });

  circlesGroup.call(toolTip);
  // test
  circlesGroup 

    // Hover rules
    .on("mouseover", function (d) {
      // Show the tooltip
      toolTip.show(d);

    })
    .on("mouseout", function (d) {
      // Remove the tooltip
      toolTip.hide(d);

    });

  return circlesGroup;
  return textGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("data.csv").then(function (smokersData, err) {
  if (err) throw err;

  // parse data
  smokersData.forEach(function (data) {
    data.age = +data.age;
    data.smokes = +data.smokes;

  });
var sData= smokersData;
  // xLinearScale function above csv import
  var xLinearScale = xScale(smokersData, chosenXAxis);

  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(smokersData, d => d.smokes)])
    .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(smokersData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.smokes))
    .attr("r", 16)
    .attr("fill", "pink")
    .attr("opacity", ".5");
// console.log(smokersData)

   var textGroup= chartGroup.selectAll("text.textC")
    .data(sData)
    .enter()
    .append("text")
    .attr("class","textC")
    .text(d => {
      console.log(d)
      return d.abbr;
    })
    .attr("x", d => xLinearScale(d[chosenXAxis]) - 10)
    .attr("y", d => yLinearScale(d.smokes));

  // Create group for  2 x- axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 10})`);

  var averageAgeLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "age") // value to grab for event listener
    .classed("active", false)
    .text("Average Age (median)");

  var albumsLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "income") // value to grab for event listener
    .classed("active", false)
    .text("Income");

  // Trying out pov
  var povLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", false)
    .text("Poverty");

  // End of try out 

  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Smokers (%)");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

  var textGroup = updateToolTip(chosenXAxis, textGroup);

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function () {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(smokersData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        textGroup = renderCircles(textGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        textGroup = updateToolTip(chosenXAxis, textGroup);

        // changes classes to change bold text
        if (chosenXAxis === "age") {
          albumsLabel
            .classed("active", false)
            .classed("inactive", true);
          averageAgeLabel
            .classed("active", true)
            .classed("inactive", false);
        }
        else {
          albumsLabel
            .classed("active", false)
            .classed("inactive", true);
          averageAgeLabel
            .classed("active", true)
            .classed("inactive", false);
        }

        // changes classes to change bold text
        if (chosenXAxis === "age") {
          povLabel
            .classed("active", false)
            .classed("inactive", true);
          averageAgeLabel
            .classed("active", true)
            .classed("inactive", false);
        }
        else {
          povLabel
            .classed("active", false)
            .classed("inactive", true);
          averageAgeLabel
            .classed("active", true)
            .classed("inactive", false);
        }



        // We need change the location and size of the state texts, too.
        d3
          .selectAll(".stateText")
          .attr("y", function (d) {
            return yScale(d[abbr]) + 16 / 3;
          })
          .attr("x", function (d) {
            return xScale(d[chosenXAxis]);
          })
          .attr("r", 16 / 2);


      }
    });
}).catch(function (error) {
  console.log(error);
});

// 
// document.querySelector("body > div:nth-child(10)")