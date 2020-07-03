// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var file = "assets/data/data.csv"

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv(file, function(data) {
    // Step 1: Parse Data/Cast as numbers
    // ==============================
    data.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
        // console.log(data.healthcare);
    });
  
    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
        .domain([8, d3.max(data, d => d.poverty)+2])
        .range([0, width]);
  
    var yLinearScale = d3.scaleLinear()
        .domain([4, d3.max(data, d => d.healthcare)+2])
        .range([height, 0]);
  
    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
  
    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
  
    chartGroup.append("g")
        .call(leftAxis);

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([40, -75])
      .html(function(d) {
        return (`${d.state}<br>Poverty (%): ${d.poverty}<br>Healthcare (%): ${d.healthcare}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "stateCircle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("opacity", ".7")
    ;

    chartGroup.selectAll("stateText")
        .data(data)
        .enter()
        .append("text")
        .attr("y", d => yLinearScale(d.healthcare)+5)
        .attr("x", d => xLinearScale(d.poverty))
        .attr("class", "stateText")
        .text(d => d.abbr)
        .on('mouseover', toolTip.show)
        .on('mouseout', toolTip.hide);


    // // Step 8: Create event listeners to display and hide the tooltip
    // // ==============================
    // circlesGroup.on("mouseover", function(data) {
    //   toolTip.show(data, this);
    // })
    //   // onmouseout event
    //   .on("mouseout", function(data, index) {
    //     toolTip.hide(data);
    //   });

    
    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2) - 60)
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${(width / 2) - 30}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");
});
