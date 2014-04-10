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
            icon: icon_url_prefix + (d["Icon"] || "missing") + ".png",
            times: [{"starting_time": new Date( d["Hire Date"] ).getTime(), "ending_time": new Date( d["Release Date"] ).getTime()}]
          });
        }
      });

      function tl() {
        var chart = d3.timeline()
          .beginning( new Date( "Jul 21, 2009" ).getTime()) // we can optionally add beginning and ending times to speed up rendering a little
          .ending(    new Date( "Apr  8, 2014" ).getTime())
          .stack() 
          .margin({left:70, right:30, top:0, bottom:0})
          ;
        var svg = d3.select(".timeline").append("svg").attr("width", width)
          .datum(team_data).call(chart);
  return;
      }
      tl();

    });
}

init({ statDataUrl: "./team-timeline.csv" });

