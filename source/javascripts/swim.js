var csv_uri = "https://docs.google.com/a/jm3.net/spreadsheet/pub?" + "key=0Aq5dBJnSM4yYdHVQQ1FmV1hSNzUwRG82MTFWWl9KNUE&output=csv";

queue()
  .defer( d3.csv, csv_uri)
  .await(ready);

function ready( error, data ) {

  d3.select(".dummy")
    .selectAll("div")
      .data(data, function(d) { return d.Date+d.Time; })
    .enter().append("div")
      .style("width", function(d) { return (50 + d.Place * 10) + "px"; })
      .style("color", function(d) { return (50 + d.Place * 10) + "px"; })
      .text(function(d) { return d.Meet + ": " + d.Place; });

  // dump data: $.each(data, function(index, val) { console.log(val) });
}

