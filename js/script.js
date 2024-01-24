// setting dimensions and margins fro the chart
const margin = { top: 70, right: 40, bottom: 60, left: 175 };
const width = 660 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// create a svg element and append it to the chart container
const svg = d3
  .select("#bog-body-chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// load and process data
d3.csv("./data/bog_bodies.csv").then(data => {
    data.forEach(d => {
        d.total = +d.total;
    });

    // sort the data by total
    data.sort((a, b) => d3.ascending(a.total, b.total));

    // setting up x and y scales
    const xScale = d3.scaleLinear()
        .range([0, width])
        .domain([0, d3.max(data, d => d.total)]);

    const yScale = d3.scaleBand()
        .range([height, 0])
        .padding(0.1)
        .domain(data.map(d => d.bog_body_type));

    // create x and y axes
    const xAxis = d3.axisBottom(xScale)
        .ticks(5)
        .tickSize(0);

    const yAxis = d3.axisLeft(yScale)
        .tickSize(0)
        .tickPadding(10);

    svg.selectAll("line.vertical-grid")
        .data(xScale.ticks(5))
        .enter()
        .append("line")
        .attr("class", "vertical-grid")
        .attr("x1", d => xScale(d))
        .attr("y1", 0)
        .attr("x2", d => xScale(d))
        .attr("y2", height)
        .style("stroke", "gray")
        .style("stroke-width", 0.5)
        .style("stroke-dasharray", "3 3");

    // create the bars for the chart
    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bat")
        .attr("x", 0)
        .attr("y", d => yScale(d.bog_body_type))
        .attr("height", yScale.bandwidth())
        .attr("width", d => xScale(d.total))
        .style("fill", "#96a5b9");

    // add x and y axes to the chart
    svg.append("g")
        .attr("class", "x axis")
        .style("font-size", "10px")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis)
        .call(g => g.select(".domain").remove());

    svg.append("g")
        .attr("class", "y axis")
        .style("font-size", "8px")
        .call(yAxis)
        .selectAll("path")
        .style("stroke-width", "1.75px");

    svg.selectAll(".y.axis .tick text")
        .text(d => d.toUpperCase());

    // add labels to the end of each bar
    svg.selectAll(".label")
        .data(data)
        .enter()
        .append("text")
        .attr("x", d => xScale(d.total)+5)
        .attr("y", d => yScale(d.bog_body_type)+yScale.bandwidth()/2)
        .attr("dy", ".35em")
        .style("font-family", "sans-serif")
        .style("font-size", "10px")
        .style("font-weight", "bold")
        .style("fill", "#3c3d28")
        .text(d => d.total);

    // add total label
    svg.append("text")
        .attr("transform", `translate(${width/2}, ${height+margin.bottom/2})`)
        .style("text-anchor", "middle")
        .style("font-size", "10px")
        .style("fill", "black")
        .style("font-family", "sans-serif")
        .attr("dy", "1em")
        .text("Total");

    // add chart title
    svg.append("text")
        .attr("x", margin.left-335)
        .attr("y", margin.top-110)
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .style("font-family", "sans-serif")
        .text("Bog Mummies Are the Most Frequently Observed Preservation State");
})