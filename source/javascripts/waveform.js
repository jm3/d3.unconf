var wave_json;
var wave_uri = "http://public.jm3.net/d3/geiger.json";
var max_points = 512;

var svg_height = 50;
var svg_width  = 500;

d3.json( wave_uri, function(error, json) {
  wave_json = json.data.slice(1, max_points);
  div_render( wave_json, ".waveform > div" );
  svg_render( wave_json, ".waveform" );
});

function svg_render( data, svg ) {
  var node = d3.select(svg).append("svg").attr("width", svg_width).attr("height", svg_height);
  d( "svg" );

  var width = 960,
  height = 50;

  var y = d3.scale.linear().range([height, 0]);

  var chart = node
    .attr("width", width)
    .attr("height", height);

    y.domain([0, d3.max(data, function(d) { return d; })]);

    var barWidth = width / data.length;

    var bar = chart.selectAll("g")
        .data(data)
      .enter().append("g")
        .attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; });

    bar.append("rect")
      .attr("y", 0)
      .attr("height", function(d) { 
      h = (height - y(d)) + "px";
      return y(d) + "px"; })
      .attr("width", barWidth - 1);

  /*
    bar.append("text")
      .attr("x", barWidth / 2)
      .attr("y", function(d) { 
        yval = (y(d) + 3) + "px";
        return yval;
      })
      .attr("dy", ".75em")
      .text(function(d) { return d; });
  */

  function type(d) {
    d.value = +d.value; // coerce to number
    return d;
  }

}

function div_render( data, div ) {
  var scale = 0.006;
  d3.select( div ).selectAll("div")
    .data(wave_json)
    .enter()
    .append("div")
    .attr("class", "bar")
    .style("height", function(d) {
      var barHeight = Math.abs(d) * scale;
      return parseInt(barHeight) + "px";
    })
    .style("margin-bottom", function(d) {
      return (d > 0) ? 0 : parseInt(scale * d) + "px";
    });
}

function d( s ) {
  console.log( "log: " + s );
}
