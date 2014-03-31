var width  = 960,
    height = 960;

function chart_it(options) {

  var width       = options.width;
  var height      = options.height;
  var latLong     = options.latLong;
  var scale       = options.scale;
  var geoDataUrl  = options.geoDataUrl;
  var statDataUrl = options.statDataUrl;

  var lng = latLong[0];
  var lat = latLong[1];

  var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height);

  d3.json(geoDataUrl, function(error, geodata) {
    d = geodata;
    console.log("loaded", d.objects.hoods.geometries.length, "features");

    var projection = d3.geo.albers()
      .translate([(width / 2), (height / 2)])
      .scale(scale)
      .rotate([-lng,0])
      .center([0,lat]);

    var path = d3.geo.path().projection(projection);

    // draw the hoods
    svg.selectAll("path")
      .data(topojson.feature(geodata, geodata.objects.hoods).features)
      .enter().append("path")
      .attr("fill", "red")
      .attr("stroke", "hsla(200,50%,50%,0.6)")
      .attr("d", path );

  });
}

chart_it({
  width: 960,
  height: 960,
  latLong: [-118.2428,34.00],
  scale: 7000,
  geoDataUrl: "./maps/sf-hoods.topojson",
  statDataUrl: "./TBD.csv"
});

