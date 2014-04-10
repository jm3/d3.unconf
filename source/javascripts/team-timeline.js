function init(options) {
  var statDataUrl    = options.statDataUrl;

  d3.csv( statDataUrl )
    .header("header-name", "header-value")
    .get(function(error, data) {

      var icon_url_prefix = "http://public.140proof.com/blog/team/";
      var team_data       = [];
      var width           = 1024;

      $.each(data, function(i,d) {
        var start = new Date( d.start ).getTime();
        var end   = new Date( d.end   ).getTime();
        if( end > start ) {
          team_data.push({
            icon:   icon_url_prefix + (d.icon || "missing") + ".png",
            label:  d.employee,
            id:     d.employee.replace(/ /g, "_"),
            times:  [{"starting_time": start, "ending_time": end}]
          });
        }
      });

      function tl() {
        var formatTime = d3.time.format("%Y"),
            formatMonths = function(d) { return formatTime(new Date(1970, 0, 0, 0, 0, 0, d)); };

        var chart = d3.timeline()
          .tickFormat({
            format: formatMonths,
            tickTime: d3.time.month,
            tickInterval: 12,
            tickSize: 1,
          })
          // we get faster rendering by restricting the start + end times
          .stack()
          .margin({left:70, right:30, top:0, bottom:0})
          .hover(function (d, i, datum) {
            $('.who .name').text( datum.label );
            $('.who img.icon').attr( "src", datum.icon );
          })
          .click(function (d, i, datum) {
            alert(datum.label);
          })
          ;
        var svg = d3.select(".timeline").append("svg").attr("width", width).datum(team_data).call(chart);
      }
      tl();

    });
}

init({ statDataUrl: "./team-timeline.csv" });

