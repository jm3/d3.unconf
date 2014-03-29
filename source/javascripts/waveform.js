var wave_json;
var wave_uri = "http://public.jm3.net/d3/geiger.json";
var max_points = 1024;

var width = 960,
height = 60;

d3.json( wave_uri, function(error, json) {
  wave_json = json.data.slice(1, max_points);
  div_render( wave_json, ".waveform > div" );
  svg_render( wave_json, ".waveform" );
});

function div_render( data, div ) {
  var scale = 0.001;
  d3.select( div ).selectAll("div")
    .data(wave_json)
    .enter()
    .append("div")
    .attr("class", "bar")
    .style("width", function(d) {
      return Math.abs(width/data.length) + "px";
    })
    .style("height", function(d) {
      var barHeight = Math.abs(d) * scale;
      return parseInt(barHeight) + "px";
    })
    .style("margin-bottom", function(d) {
      return (d > 0) ? 0 : parseInt(scale * d) + "px";
    });
}

function svg_render( data, svg ) {
  var node = d3.select(svg).append("svg").attr("width", width).attr("height", height);

  var y = d3.scale.linear().range([height/2, 0]);

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
        return y(d); })
      .attr("width", Math.abs(barWidth ));

}

function d( s ) {
  console.log( "log: " + s );
}
