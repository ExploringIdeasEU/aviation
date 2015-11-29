

// --------------------------------------------------
// Parameters

var dataFile = 'data.part1.json';
var dataset, states, n;

var map;  // Datamap

var visWidth;  // Auto-generated 

var accColors = {};  // Colormaps
    

var minAcc = 1,
    maxAcc = 1280

var cLevels = 9;  // Number of color levels

var accPalette = colorbrewer['Greens'][cLevels];

var cellWidth = 30, // Width of color legend cell
    cbarWidth = cellWidth*cLevels;
    cbarHeight = 15;  // Height of color legend

// --------------------------------------------------
// Set up scales

var accScale = d3.scale.quantize()
  .domain([minAcc, maxAcc])
  .range(accPalette);

// --------------------------------------------------
// Load data and generate map

d3.json(dataFile, function(error, dataset) {

    // Data properties
    states = d3.keys(dataset);
    n = states.length;

    // Set up choropleth colorings
    for (var i=0; i<n; i++) {
      accColors[states[i]] = accScale(+dataset[states[i]]);
    }

    // Create map
    map = new Datamap({
        element: document.getElementById('vis'),
        scope: 'usa',
        fills: {defaultFill: '#ffffff'},
        data: dataset,
        geographyConfig: {
          borderWidth: 1,
          borderColor: '#999999',
          popupOnHover: true,
          highlightOnHover: true,
          highlightFillColor: '#bbaa99',
          highlightBorderColor: '#999999',
          highlightBorderWidth: 2,
          popupTemplate: function(geography, data) {return statePopup(geography, data); }
        } 
    });

    // Build color gradients
    buildGradient(accPalette, 'accGradient');

    // Draw colorbar
    visWidth = document.getElementById('vis').offsetWidth;

    cbar = d3.select('.datamap').append('g')
      .attr('id', 'colorBar')
      .attr('class', 'colorbar')

    cbar.append('rect')
        .attr('id', 'gradientRect')
        .attr('width', cbarWidth)
        .attr('height', cbarHeight)
        .style('fill', 'url(#paceGradient)');

    cbar.append('text')
      .attr('id', 'colorBarMinText')
      .attr('class', 'colorbar')
      .attr('x', 0)
      .attr('y', cbarHeight + 15)
      .attr('dx', 0)
      .attr('dy', 0)
      .attr('text-anchor', 'start');

    cbar.append('text')
      .attr('id', 'colorBarMaxText')
      .attr('class', 'colorbar')
      .attr('x', cbarWidth)
      .attr('y', cbarHeight + 15)
      .attr('dx', 0)
      .attr('dy', 0)
      .attr('text-anchor', 'end');

    cbar.attr('transform', 'translate(' + (visWidth-cbarWidth)/2.0 + ', 30)');  // Shift to center

    // Default palette view
    showAcc();

});


// ==================================================
// FUNCTIONS

// --------------------------------------------------
// Functions for updating colors


function showAcc() {
  d3.select('#gradientRect').style('fill', 'url(#accGradient)');

  d3.select('#colorBarMinText').text(rstr(minAcc));

  d3.select('#colorBarMaxText').text(rstr(maxAcc));

  map.updateChoropleth(accColors);
};
// --------------------------------------------------
// Function to build gradients

function buildGradient(palette, gradientId) {
  d3.select('.datamap')
    .append('linearGradient')
    .attr('id', gradientId)
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", cbarWidth)
        .attr("y2", 0)
      .selectAll('stop')
      .data(palette)
      .enter()
        .append('stop')
        .attr('offset', function(d, i) {return i/(cLevels-1)*100.0 + '%'; })
        .attr('stop-color', function(d) {return d; });
};

// --------------------------------------------------
// Template for state popup

function statePopup(geography, data) {
  var html = '<div class="hoverinfo">'
    + '<div class="hover-state-title" align="center">'
    + '<b>' + geography.properties.name + '</b>'
    + '</div>'
    + '<div class="hover-state-stats">'
    + '<table>'
    + '<tr>'
      + '<td>Number of incidents:</td>'
      + '<td>' + rstr(data) + '</td>'
    + '</tr>'
    + '</table>'
    + '</div>'
    + '</div>'
  return html;
};

// --------------------------------------------------
// Formatting functions

function rstr(r) {
  // do nothing - for moment
  return r;
}


