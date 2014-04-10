function init(options) {
  var statDataUrl    = options.statDataUrl;

  d3.csv( statDataUrl )
    .header("header-name", "header-value")
    .get(function(error, data) {

      var icon_url_prefix = "http://public.140proof.com/blog/team/";
      var team_data       = [];
      var width           = 960;

      $.each(data, function(i,d) {
        var start = new Date( d["Hire Date"] ).getTime()
        var end   = new Date( d["Release Date"] ).getTime();
        if( end > start ) {
          team_data.push({
            icon:   icon_url_prefix + (d["Icon"] || "missing") + ".png",
            label:  d["Employee"],
            id:     d["Employee"].replace(/ /g, "_"),
            times:  [{ "starting_time": start, "ending_time": end }]
          });
        }
      });

      function tl() {

        var formatTime = d3.time.format("%Y"),
            formatMonths = function(d) { return formatTime(new Date(1970, 0, 1, 0, 0, 0, d)); };   //The intervals are in millis

        var chart = d3.timeline()
          .tickFormat({
            format: formatMonths,
            tickTime: d3.time.month,
            tickInterval: 12,
            tickSize: 1,
          })
          .beginning( new Date( "Jul 21, 2009" ).getTime()) // we can optionally add beginning and ending times to speed up rendering a little
          .ending(    new Date( "Apr  8, 2014" ).getTime())
          .stack()
          .margin({left:70, right:30, top:0, bottom:0})
          .hover(function (d, i, datum) {
            var name = $('.who .name');
            name.text( datum.label );
            var icon = $('.who img.icon');
            icon.attr( "src", datum.icon );
          })
          .click(function (d, i, datum) {
            alert(datum.label);
          })
          ;
        var svg = d3.select(".timeline").append("svg").attr("width", width).datum(team_data).call(chart);
        $("#timelineItem_product").css("fill","black");
      }
      tl();

    });
}

init({ statDataUrl: "./team-timeline.csv" });

