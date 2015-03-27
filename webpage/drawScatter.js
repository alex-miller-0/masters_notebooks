var x_var, y_var, sort_by, sort_options;

var titles={
  'avg_m_no_oxygen': "Average mass (amu)",
  'avg_r_no_oxygen': 'Average radius (amu)',
  't_factor': 'Tolerance factor',
  'family': 'Material family',
  'sample_type': 'Sample type',
  'd_star': 'log(D*)',
  'k_star': 'log(k*)',
  'ead': 'Ea(D*)',
  'eak': 'Ea(k*)'

}




var sort_by_family = false, sort_by_sample_type = false, sort_by_measurement_type = false;

function drawScatter(){
  

  // load data
  d3.csv("db.csv", function(error, data) {
    console.log(x_var,y_var)

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
    //width = Math.min( (960 - margin.left - margin.right), 0.7*window.innerWidth),
    width = 0.8*window.innerWidth;
    //height = 500 - margin.top - margin.bottom;
    height = 0.5*window.innerHeight;

    // change string (from CSV) into number format
    data.forEach(function(d) {
      d[x_var] = process_data(x_var, d) ;
      d[y_var] = process_data(y_var, d) ;

    }); // end data.forEach


     //Max/min
    var xMax = d3.max(data, function(d) { return +d[x_var]; });
    var xMin = d3.min(data, function(d) { return +d[x_var]; });
    var yMax = d3.max(data, function(d) { return +d[y_var]; });
    var yMin = d3.min(data, function(d) { return +d[y_var]; });
  
    



    // setup x 
    var xValue = function(d) { return d[x_var];}, // data -> value
        xScale = d3.scale.linear().domain([xMin,xMax]).range([0, width]), // value -> display
        xMap = function(d) { return xScale(xValue(d));}, // data -> display
        xAxis = d3.svg.axis().scale(xScale).orient("bottom");

    // setup y
    var yValue = function(d) { return d[y_var];}, // data -> value
      yScale = d3.scale.linear().domain([yMin,yMax]).range([height, 0]), // value -> display
      yMap = function(d) { return yScale(yValue(d));}, // data -> display
      yAxis = d3.svg.axis().scale(yScale).orient("left");

    // Show single options? (Not when there are combinations)
    var single_options = true;

    for(family in OPTIONS['material-family']){

      for(sample_type in OPTIONS['sample-type']){
        if(OPTIONS['material-family'][family] == true && OPTIONS['sample-type'][sample_type] == true){
          single_options = false;
          break;
        };
        for(measurement_type in OPTIONS['measurement-type']){
          if(OPTIONS['material-family'][family] == true && OPTIONS['measurement-type'] == true){
            single_options = false;
            break;
          }
          else if(OPTIONS['sample-type'][sample_type] == true && OPTIONS['measurement-type'] == true){
            single_options = false;
            break;
          };
        };
      };
    };


    //Show results with no associated fields?
    _options = false;
    for(family in OPTIONS['material-family']){
      if(OPTIONS['material-family'][family]== true){_options = true}
    };
    for(sample_type in OPTIONS['sample-type']){
      if(OPTIONS['sample-type'][sample_type]== true){_options = true}
    };
      for(m in OPTIONS['measurement-type']){
      if(OPTIONS['measurement-type'][m]== true){_options = true}
    };

    console.log(_options)

    //---------------
    // setup fill color and popualate sort_options
    var cValue = function(d) {

      
      //Inclusive
      for(fam in OPTIONS['material-family']){  
        if(d['family'] == fam && OPTIONS['material-family'][fam]==true){
          for(sam in OPTIONS['sample-type']){ 
            if(d['sample_type'] == sam && OPTIONS['sample-type'][sam]==true){
              for(meas in OPTIONS['measurement-type']){  
                if(d['measurement_type'] == meas && OPTIONS['measurement-type'][meas]==true){
                  single_options = false;
                  return d['family'] + "+" + d['sample_type'] + "+" + d['measurement_type'];
                };
              };
              single_options = false;
              return d['family'] + "+" + d['sample_type'];

            };
          };
          if(single_options == true){ return d['family'] };

        };

      };

      
      return null;
    },
     color = d3.scale.category10();
    //--------------

    // add the graph canvas to the body of the webpage
    d3.select("#scatterplot").remove();


  
    //scaling
    function zoomed(){
      svg.select(".x.axis").call(xAxis);
      svg.select(".y.axis").call(yAxis);
      svg.selectAll("circle")
        .attr("transform", function(d,i){
          return  "translate(" + d3.event.translate + ")"
            + " scale(" + d3.event.scale + ")"
          //return "translate("+xAxis( d[x_var] ) +yAxis( d[y_var] ) + ")";
          })
      }


    var svg = d3.select("#page-container").append("svg")
      .attr("id", "scatterplot")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)  
      .call(d3.behavior.zoom().x(xScale).y(yScale).scaleExtent([0.1, 8]).on("zoom", zoomed))
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        



    function makeTooltip(){
    // add the tooltip area to the webpage
      d3.select("#tooltip-div").remove()
      var tooltip = d3.select("body").append("div")
          .attr("class", "tooltip")
          .attr("id", "tooltip-div")
          .style("opacity", 0);
    };
  
   
    


    // x-axis
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
        .attr("class", "label")
        .style("font-size", "16px")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text(x_var);

    // y-axis
    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .style("font-size", "16px")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(y_var);

    

    // draw dots
    svg.selectAll(".dot")
      .data(data)
      .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 5)
        .attr("cx", xMap)
        .attr("cy", yMap)
        .style("fill", function(d) {
          var x = d3.select(this)[0][0].cx.animVal.value;
          var y = d3.select(this)[0][0].cy.animVal.value;

          if(d[x_var] == 0 || d[y_var]==0){
            return 'transparent'
          };

          if( cValue(d) == null && _options == true){return 'transparent'}

          return color(cValue(d));

        })//color(cValue(d));}) 
        .on("mouseover", function(d) {
          this.r.baseVal.value = 10;

          t_html = "<h5>"+d["material"]+"</h5>"
            + "<b>" + x_var + ": </b>" + parseFloat(xValue(d)).toFixed(2) + "<br>"
            + "<b>" + y_var + ": </b>" + parseFloat(yValue(d)).toFixed(2) +  "<br>"
            + "<b>Family: </b>" + d["family"] + "<br>"
            + "<b>Measurement: </b>" + d["measurement_type"] + "</br>"
            + "<b>Sample type: </b>" + d["sample_type"] + "</br>"
            + "<b>Measurement directionality: </b>" + d["measurement_direction"] + "<br>";
          if(d["Direction"] != ""){ t_html += "<b>Direction: </b>" + d["Direction"] + "<br>"};
          if(d["Substrate"] != ""){ t_html += "<b>Note: </b>" + d["Note"] + "<br>"};


          makeTooltip();
          tooltip = d3.select("#tooltip-div");
          tooltip.transition()
              .duration(200)
              .style("opacity", .95)
              .style("z-index", 1000)
              .style("width", "auto")
              .style("height", "auto")
              .style("padding", "10px")
              .style("background-color", "white")
              .style("-webkit-border-radius", "10px")
              .style("-moz-border-radius", "10px")
              .style("border-radius", "10px")
              .style("-webkit-box-shadow", "4px 4px 10px rgba(0, 0, 0, 0.4)")
              .style("-mox-box-shadow", "4px 4px 4px 10px rgba(0, 0, 0, 0.4)")
              .style("box-shadow", "box-shadow: 4px 4px 10px rbga(0, 0, 0, 0.4)")
              //.style("left", (d3.event.pageX + 15) + "px")
              .style("left", (d3.event.pageX +15 ) + "px")
              .style("top", (d3.event.pageY - 30) + "px");
          tooltip.html(t_html)
        

        })
        .on("mouseout", function(d) {
          this.r.baseVal.value = 5;
          tooltip = d3.select("#tooltip-div");
          tooltip.transition()
              .duration(100)
              .style("width", "0")
              .style("height", "0")
              .style("opacity", 0);
        })
        .on("click", function(d){
          window.open("http://dx.doi.org/"+d["DOI"]);
        })
       


    // draw legend
    var legend = svg.selectAll(".legend")
        .data(color.domain())
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { 
          return "translate(0," + (20+ i * 20) + ")"; })

    //if(legend[0].length > 1){
      // draw legend colored rectangles
      var rec  = legend.append("rect")
          //.attr("x", width - 18)
        .attr("x", 50)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);
      
      // draw legend text
      legend.append("text")
        //.attr("x", width - 24)
        .attr("x",70)
        .attr("y", 9)
        .attr("dy", ".35em")
        //.style("text-anchor", "end")
        .style("text-anchor", "front")
        .text(function(d) { 
          if(d==null){return 'All'}
          return d;})
    //};

  
  if(legend[0].length == 0){
    d3.select("#scatterplot").remove();
    var page = d3.select("#page-container").append("div").attr("id", "scatterplot");
    page.append("h4").html("<b>Welcome to the Solid Oxide Fuel Cells database</b>");
    page.append("br");
    page.append("h5").html("To sort by a qualitative parameter, click one of the links above.")
    page.append("h5").html("Select the quantitative parameters for the x-axis and y-axis below.")
  }
  
  

  });//end load data





















};//end drawScatter
