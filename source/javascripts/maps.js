function map_it(options) {
  var width          = options.width;
  var height         = options.height;
  var latLong        = options.latLong;
  var injectInto     = options.injectInto;
  var collectionName = options.collectionName;
  var scale          = options.scale;
  var fill           = options.fill;
  var stroke         = options.stroke;
  var geoDataUrl     = options.geoDataUrl;
  var statDataUrl    = options.statDataUrl;

  var lng = latLong[0];
  var lat = latLong[1];

  var svg;
    svg = d3.select(injectInto).append("svg")
    .attr("id",collectionName)
    .attr("width", width).attr("height", height);

  d3.json(geoDataUrl, function(error, geodata) {
    d = geodata;
      console.log(d.objects);
    console.log(collectionName, ": loaded", 
      d.objects[collectionName].geometries.length, "features");

    var projection = d3.geo.albers()
      .translate([(width / 2), (height / 2)])
      .scale(scale)
      .rotate([-lng,0])
      .center([0,lat]);

    var path = d3.geo.path().projection(projection);

    svg.selectAll("path")
      .data(topojson.feature(geodata, geodata.objects[collectionName]).features)
      .enter().append("path")
      .attr("fill", fill)
      .attr("stroke", stroke)
      .attr("d", path );

  });
}

map_it({
  width:           500,
  height:          500,
  fill:            "#ddd",
  stroke:          "hsla(200,50%,50%,0.3)",
  injectInto:      "svg.sf",
  collectionName:  "sf-hoods",
  latLong:         [-114.00, 40.00],
  scale:           1200,
  statDataUrl:     "./TBD.csv",
  geoDataUrl:      "./maps/sf-hoods-topo.json"
});

map_it({
  width:           700,
  height:          500,
  fill:            "#ddd",
  stroke:          "hsla(200,50%,50%,0.3)",
  injectInto:      "svg.usa",
  collectionName:  "states",
  latLong:         [-100.00, 34.00],
  scale:           500,
  statDataUrl:     "./TBD.csv",
  geoDataUrl:      "./maps/states-topo.json"
});

map_it({
  width:           500,
  height:          500,
  fill:            "#FF0000",
  stroke:          "#333",
  injectInto:      "svg.sf",
  collectionName:  "sfpd-SOMA-resolved",
  latLong:         [-122.40, 37.70],
  scale:           1200,
  statDataUrl:     "./TBD.csv",
  geoDataUrl:      "./maps/sfpd-SOMA-resolved-topo.json"
});
