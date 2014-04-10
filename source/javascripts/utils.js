function max_for_cols(columns, dataset) {
  var max;
  columns.forEach(function(element, index, array) {
    var tmpmax = d3.max(dataset, function(d) {
      return +d[element];
    });
    max = (tmpmax > max || max === undefined) ? tmpmax : max;
  });
  return max;
}

function min_for_cols(columns, dataset) {
  var min;
  columns.forEach(function(element, index, array) {
    var tmpmin = d3.min(dataset, function(d) {
      return +d[element];
    });
    min = (tmpmin < min || min === undefined) ? tmpmin : min;
  });
  return min;
}

