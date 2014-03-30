// TODO
// - do we need a log scasle because this is audio data?

var wave_json;
var wave_uri = "http://public.jm3.net/d3/geiger.json";
var max_points = 512;

var width = 960,
height    = 60;

// ints ranging from -32,767 to 32,767
d3.json( wave_uri, function(error, json) {
  wave_json = json.data.slice(1, max_points);
  div_render( wave_json, ".waveform > div" );
  svg_render( wave_json, ".waveform" );
});

function div_render( data, div ) {
  var y = d3.scale.linear().range([height, -height]);
  var x = d3.scale.linear().domain([0, data.length]);
  var max_val = d3.max(data, function(d) { return d; });
  y.domain([-max_val, max_val]);
  var bar_width = width/data.length;

  d3.select( div ).selectAll("div")
    .data(wave_json)
    .enter()
    .append("div")
    .attr("class", "bar")
    .style("width", 2 + "px" )
    .style("height", function(d,i) {
      return y(d) + "px";
    })
    .style("bottom", function(d) {
      // 2px slide up because 2px padding
      var bottom = height - Math.abs(y(d)/2) - height/2 + 2;
      return bottom + "px";
    })
    .style("left", function(d,i) {
      var left =  x(i)*width; // could also do: i * bar_width;
      return left + "px";
    });
}

function svg_render( data, svg ) {
  var node = d3.select(svg).append("svg").attr("width", width).attr("height", height);

  var y = d3.scale.linear().range([height, -height]);
  var max_val = d3.max(data, function(d) { return d; });
  y.domain([-max_val, max_val]);
  var bar_width = width / data.length;

  var chart = node.attr("width", width).attr("height", height);

  var bar = chart.selectAll("g")
    .data(data)
    .enter().append("g") // svg "group"
    .attr("transform", function(d, i) {
      return "translate(" + i * bar_width + ",0)";
    });

  bar.append("rect")
    .attr("y", function(d) {
      var yv = height - Math.abs(y(d)/2) - height/2 + 2;
      return yv;
    })
    .attr("height", function(d) {
      return y(d); })
    .attr("width", Math.abs(bar_width ));
}

function d( s ) {
  console.log( "log: " + s );
}
