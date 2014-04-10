var csv_uri = "https://docs.google.com/a/jm3.net/spreadsheet/pub?" + "key=0Aq5dBJnSM4yYdHVQQ1FmV1hSNzUwRG82MTFWWl9KNUE&output=csv";

queue()
  .defer( d3.csv, csv_uri)
  .await(ready);

function ready( error, data ) {

  var color = d3.scale.linear()
    .domain([
      min_for_cols(["Place"], data),
      max_for_cols(["Place"], data)
    ])
    .range(["#7BCCC4", "#084081"]); // blues

  d3.select(".swim")
    .selectAll("div")
      .data(data, function(d) { return d.Date + d.Time; })
    .enter().append("div")
      .style("width", function(d) {
        return (d.Place * 50 ) + "px";
      })
      .style("background-color", function(d,i) {
        return color(d.Place);
      })
      .text(function(d) {
        return d.Meet + ": " + d.Place;
      });
}

