// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 120,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(stateData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(stateData, d => d[chosenXAxis]) * 0.8,
      d3.max(stateData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating y-scale var upon click on axis label
function yScale(stateData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
  .domain([d3.min(stateData, d => d[chosenYAxis]*0.7), d3.max(stateData, d => d[chosenYAxis]*1.1)])
  .range([height, 0]);

  return yLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to new circles
function renderXCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));
    

  return circlesGroup;
}

function renderYCircles(circlesGroup, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

// function used for updating circles text group with a transition to new circles
function renderXCirTxt(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("dx", d => newXScale(d[chosenXAxis]));
    

  return circlesGroup;
}

function renderYCirTxt(circlesGroup, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("dy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  var xlabel;

  if (chosenXAxis === "poverty") {
    xlabel = "Poverty:";
  }
  else if (chosenXAxis === "age") {
      xlabel= "Age (Median):"
  }

  else if (chosenXAxis === "income"){
    xlabel = "Household Income (Median):";
  }

  var ylabel;

  if (chosenYAxis === "healthcare") {
    ylabel = "Healthcare:";
  }
  else if (chosenYAxis === "smokes") {
      ylabel= "Smokes:"
  }

  else if (chosenYAxis === "obesity"){
    ylabel = "Obese:";
  }

  if (chosenXAxis === "poverty") {
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`<strong>${d.state}</strong><br>${xlabel} ${d[chosenXAxis]}%<br>${ylabel} ${d[chosenYAxis]}%`);
    });
  }

  else {
    var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`<strong>${d.state}</strong><br>${xlabel} ${d[chosenXAxis]}<br>${ylabel} ${d[chosenYAxis]}%`);
    });  
  }

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(stateData, err) {
  if (err) throw err;
  
  // parse data
  stateData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.povertyMoe = +data.povertyMoe;
    data.age = +data.age;
    data.ageMoe = +data.ageMoe;
    data.income = +data.income;
    data.incomeMoe = +data.incomeMoe;
    data.healthcare = +data.healthcare;
    data.healthcareLow = +data.healthcareLow;
    data.healthcareHigh = +data.healthcareHigh;
    data.obesity = +data.obesity;
    data.obesityLow = +data.obesityLow;
    data.obesityHigh = +data.obesityHigh;
    data.smokes = +data.smokes;
    data.smokesLow = +data.smokesLow;
    data.smokesHigh = +data.smokesHigh;
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(stateData, chosenXAxis);

  // Create y scale function
  var yLinearScale = yScale(stateData, chosenYAxis)

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("g circle")
  .data(stateData)
  .enter()
  .append("g")

  var circlesXY=circlesGroup.append("circle")
  .classed("stateCircle", true)
  // .attr("fill", 'transparent')
  .attr("cx", d => xLinearScale(d[chosenXAxis]))
  .attr("cy", d => yLinearScale(d[chosenYAxis]))
  .attr("r", 10)

  var circlesText=circlesGroup.append("text")
  .attr("dx", d => xLinearScale(d[chosenXAxis]))
  .attr("dy", d => yLinearScale(d[chosenYAxis])+3)
  .text(d=>d.abbr)
  .classed("stateText", true)

  // Create group for three x-axis labels
  var XlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var PovertyLabel = XlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("aText", true)
    .classed("active", true)
    .classed("x-label",true)
    .text("In Poverty(%)");

  var AgeLabel = XlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .classed("aText", true)
    .classed("x-label",true)
    .text("Age (Median)");

  var IncomeLabel = XlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .classed("aText", true)
    .classed("x-label",true)
    .text("Household Income (Median)");


  // Create group for three x-axis labels
  var YlabelsGroup = chartGroup.append("g")
    // .attr("transform", `translate(${width / 2}, ${height + 20})`);

  // append y axis
  var HealthLabel=YlabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - (margin.left*0.5))
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value", "healthcare")
    .classed("aText", true)
    .classed("y-label",true)
    .classed("active", true)
    .text("Lacks of Healthcare(%)");
  
  var ObeseLabel=YlabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value", "obesity")
    .classed("aText", true)
    .classed("y-label",true)
    .classed("inactive", true)
    .text("Obese(%)");

  var SmokeLabel=YlabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - (margin.left*0.75))
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value", "smokes")
    .classed("aText", true)
    .classed("y-label",true)
    .classed("inactive", true)
    .text("Smokes(%)");  

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  // x axis labels event listener
  XlabelsGroup.selectAll(".x-label")
    .on("click", function() {
      // get value of selection
      var Xvalue = d3.select(this).attr("value");
      if (Xvalue !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = Xvalue;

        console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(stateData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesXY = renderXCircles(circlesXY, xLinearScale, chosenXAxis);
        circlesText =renderXCirTxt(circlesText, xLinearScale, chosenXAxis) 

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "age") {
          AgeLabel
            .classed("active", true)
            .classed("inactive", false);
          PovertyLabel
            .classed("active", false)
            .classed("inactive", true);
            IncomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenXAxis === "income") {
            AgeLabel
              .classed("active", false)
              .classed("inactive", true);
            PovertyLabel
              .classed("active", false)
              .classed("inactive", true);
              IncomeLabel
              .classed("active", true)
              .classed("inactive", false);
          }
        else if (chosenXAxis === "poverty") {
          AgeLabel
            .classed("active", false)
            .classed("inactive", true);
          PovertyLabel
            .classed("active", true)
            .classed("inactive", false);
            IncomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
      }
    });

  // y axis labels event listener
  YlabelsGroup.selectAll(".y-label")
    .on("click", function() {
      // get value of selection
      var Yvalue = d3.select(this).attr("value");
      console.log(Yvalue)
      if (Yvalue !== chosenYAxis) {

        // replaces chosenYAxis with value
        chosenYAxis = Yvalue;

        // functions here found above csv import
        // updates x scale for new data
        yLinearScale = yScale(stateData, chosenYAxis);

        // updates x axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new x values

        circlesXY = renderYCircles(circlesXY, yLinearScale, chosenYAxis);
        circlesText =renderYCirTxt(circlesText, yLinearScale, chosenYAxis) 

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenYAxis === "smokes") {
          SmokeLabel
            .classed("active", true)
            .classed("inactive", false);
          ObeseLabel
            .classed("active", false)
            .classed("inactive", true);
            HealthLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenYAxis === "obesity") {
            SmokeLabel
              .classed("active", false)
              .classed("inactive", true);
            HealthLabel
              .classed("active", false)
              .classed("inactive", true);
              ObeseLabel
              .classed("active", true)
              .classed("inactive", false);
          }
        else if (chosenYAxis === "healthcare") {
          SmokeLabel
            .classed("active", false)
            .classed("inactive", true);
          HealthLabel
            .classed("active", true)
            .classed("inactive", false);
            ObeseLabel
            .classed("active", false)
            .classed("inactive", true);
        }
      }
    });

}).catch(function(error) {
  console.log(error);
});
