function map_it(options) {
  var width          = options.width;
  var height         = options.height;
  var latLong        = options.latLong;
  var injectInto     = options.injectInto;
  var collectionName = options.collectionName;
  var scale          = options.scale;
  var geoDataUrl     = options.geoDataUrl;
  var statDataUrl    = options.statDataUrl;

  var lng = latLong[0];
  var lat = latLong[1];

  var svg = d3.select(injectInto).append("svg")
      .attr("width", width)
      .attr("height", height);

  d3.json(geoDataUrl, function(error, geodata) {
    d = geodata;
      console.log(d.objects);
    console.log(collectionName, ": loaded", 
      d.objects[collectionName].geometries.length, "features");

    var projection = d3.geo.mercator()
      .translate([(width / 2), (height / 2)])
      .scale(scale)
      .rotate([-lng,0])
      .center([0,lat]);

    var path = d3.geo.path().projection(projection);

    svg.selectAll("path")
      .data(topojson.feature(geodata, geodata.objects[collectionName]).features)
      .enter().append("path")
      .attr("fill", "#ddd")
      .attr("stroke", "hsla(200,50%,50%,0.3)")
      .attr("d", path );

  });
}

map_it({
  width:           500,
  height:          500,
  injectInto:      ".sf-hoods",
  collectionName:  "sf-hoods",
  latLong:         [-114.00, 40.00], // good for sf-hoods-topo
  scale:           1200, // good for sf-hoods-topo
  statDataUrl:     "./TBD.csv",
  geoDataUrl:      "./maps/sf-hoods-topo.json"
});

map_it({
  width:           700,
  height:          500,
  injectInto:      ".states",
  collectionName:  "states",
  latLong:         [-100.00, 34.00], // good for states-topo
  scale:           500, // good for states-topo
  statDataUrl:     "./TBD.csv",
  geoDataUrl:      "./maps/states-topo.json"
});

map_it({
  width:           500,
  height:          500,
  injectInto:      "body",
  collectionName:  "sfpd-SOMA-resolved",
  latLong:         [-114.00, 40.00], // good for sf-hoods-topo
  scale:           1200, // good for sf-hoods-topo
  statDataUrl:     "./TBD.csv",
  geoDataUrl:      "./maps/sfpd-SOMA-resolved-topo.json"
});
