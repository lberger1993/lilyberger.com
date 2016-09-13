  var w = 1000;
  var h = 400;

  var svg = d3.selectAll(".svg")
    //.selectAll("svg")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr("class", "svg");

  var taskArray = [{
      task: "Tuft University",
      type: "Undergraduate",
      startTime: "2010-1-28", //year/month/day
      endTime: "2014-2-1",
      details: "Details details detail"
    },

    {
      task: "Harvard University",
      type: "Research",
      startTime: "2011-2-2",
      endTime: "2014-2-6",
      details: "all three lines of it"
    },

    {
      task: "Athena Health",
      type: "Professional",
      startTime: "2014-2-6",
      endTime: "2015-2-9"
    },

    {
      task: "Denver",
      type: "Professional",
      startTime: "2015-2-9",
      endTime: "2016-07-12",
      details: "This counts, right?"
    },
    {
      task: "Denver Health Clinic",
      type: "festivity",
      startTime: "2015-6-9",
      endTime: "2016-07-12",
      details: "This counts, right?"
    },
    {
      task: "Volunteering",
      type: "celebration",
      startTime: "2010-2-8",
      endTime: "2015-2-13",
      details: "All the things"
    },
    {
      task: "Other activity",
      type: "blah",
      startTime: "2013-2-8",
      endTime: "2014-2-13",
      details: "All the things"
    },

    {
      task: "Nursing?",
      type: "other type",
      startTime: "2016-2-13",
      endTime: "2018-2-16"
    },

  ];

  var dateFormat = d3.time.format("%Y-%m-%d");

  var timeScale = d3.time.scale()
    .domain([d3.min(taskArray, function(d) {
        return dateFormat.parse(d.startTime);
      }),
      d3.max(taskArray, function(d) {
        return dateFormat.parse(d.endTime);
      })
    ])
    .range([0, w - 150]);

  var categories = new Array();

  for (var i = 0; i < taskArray.length; i++) {
    categories.push(taskArray[i].type);
  }

  var catsUnfiltered = categories; //for vert labels

  categories = checkUnique(categories);

 

  makeGant(taskArray, w, h);

  var title = svg.append("text")
    .text("")
    .attr("x", w / 2)
    .attr("y", 25)
    .attr("text-anchor", "middle")
    .attr("font-size", 13)
    .attr("fill", "#009FFC");

  function makeGant(tasks, pageWidth, pageHeight) {

    var barHeight = 30;
    var gap = barHeight + 10;
    var topPadding = 35;
    var sidePadding = 130;

    //mess around here with the color scale
    var colorScale = d3.scale.linear()
      .domain([0, categories.length])
      .range(["#00B9FA", "#BE90D4"])
      .interpolate(d3.interpolateHcl);

    makeGrid(sidePadding, topPadding, pageWidth, pageHeight);
    drawRects(tasks, gap, topPadding, sidePadding, barHeight, colorScale, pageWidth, pageHeight);
    

  }

  function drawRects(theArray, theGap, theTopPad, theSidePad, theBarHeight, theColorScale, w, h) {

    var bigRects = svg.append("g")
      .selectAll("rect")
      .data(theArray)
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", function(d, i) {
        return i * theGap + theTopPad - 2;
      })
      .attr("width", function(d) {
        return w - theSidePad / 2;
      })
      .attr("height", theGap)
      .attr("stroke", "none")
      .attr("fill", function(d) {
        for (var i = 0; i < categories.length; i++) {
          if (d.type == categories[i]) {
            return d3.rgb(theColorScale(i));
          }
        }
      })
      .attr("opacity", 0.2);

    var rectangles = svg.append('g')
      .selectAll("rect")
      .data(theArray)
      .enter();

    var innerRects = rectangles.append("rect")
      .attr("rx", 3)
      .attr("ry", 3)
      .attr("x", function(d) {
        return timeScale(dateFormat.parse(d.startTime)) + theSidePad;
      })
      .attr("y", function(d, i) {
        return i * theGap + theTopPad;
      })
      .attr("width", function(d) {
        return (timeScale(dateFormat.parse(d.endTime)) - timeScale(dateFormat.parse(d.startTime)));
      })
      .attr("height", theBarHeight)
      .attr("stroke", "none")
      .attr("fill", function(d) {
        for (var i = 0; i < categories.length; i++) {
          if (d.type == categories[i]) {
            return d3.rgb(theColorScale(i));
          }
        }
      })

    var rectText = rectangles.append("text")
      .text(function(d) {
        return d.task;
      })
      .attr("x", function(d) {
        return (timeScale(dateFormat.parse(d.endTime)) - timeScale(dateFormat.parse(d.startTime))) / 2 + timeScale(dateFormat.parse(d.startTime)) + theSidePad;
      })
      .attr("y", function(d, i) {
        return i * theGap + 14 + theTopPad;
      })
      .attr("font-size", 9)
      .attr("text-anchor", "middle")
      .attr("text-height", theBarHeight)
      .attr("fill", "#fff");

    rectText.on('mouseover', function(e) {
      // console.log(this.x.animVal.getItem(this));
      var tag = "";

      if (d3.select(this).data()[0].details != undefined) {
        tag = 
          "" + d3.select(this).data()[0].task + "<br/>" +
          "" + d3.select(this).data()[0].type + "<br/>" +
          "" + d3.select(this).data()[0].details + "<br/>"+
          "" + d3.select(this).data()[0].startTime + 
           d3.select(this).data()[0].endTime + "<br/>" ;
          console.log(tag);
      } else {
        tag =  "" + d3.select(this).data()[0].task + "<br/>" +
          "" + d3.select(this).data()[0].type + "<br/>" +
          "" + d3.select(this).data()[0].details + "<br/>"+
          "" + d3.select(this).data()[0].startTime + 
           d3.select(this).data()[0].endTime + "<br/>" ;
          console.log(tag);
      }
      var output = document.getElementById("tag");

      var x = this.x.animVal.getItem(this) + "px";
      var y = this.y.animVal.getItem(this) +  "px";

      output.innerHTML = tag;
      output.style.top = y;
      output.style.left = x;
      output.style.display = "block";
    }).on('mouseout', function() {
      var output = document.getElementById("tag");
      output.style.display = "none";
    });

    innerRects.on('mouseover', function(e) {
      //console.log(this);
      var tag = "";
        if (d3.select(this).data()[0].details != undefined) {
         tag =  "" + d3.select(this).data()[0].task + "<br/>" +
          "" + d3.select(this).data()[0].type + "<br/>" +
          "" + d3.select(this).data()[0].details + "<br/>"+
          "" + d3.select(this).data()[0].startTime + 
          d3.select(this).data()[0].endTime + "<br/>" ;
          console.log(tag);
      } else {
        tag =  "" + d3.select(this).data()[0].task + "<br/>" +
          "" + d3.select(this).data()[0].type + "<br/>" +
          "" + d3.select(this).data()[0].details + "<br/>"+
          "" + d3.select(this).data()[0].startTime + 
          d3.select(this).data()[0].endTime + "<br/>" ;
          console.log(tag);
      }
      var output = document.getElementById("tag");

      var x = 0 + "px";
      var y = 0 + "px";

      console.log("This is the x", x);
      console.log("This is the y", y);

      output.innerHTML = tag;
      output.style.top = y;
      output.style.left = x;
      output.style.display = "block";
    }).on('mouseout', function() {
      var output = document.getElementById("tag");
      output.style.display = "none";

    });

  }

  function makeGrid(theSidePad, theTopPad, w, h) {
    console.log("This is the topPAd", theTopPad);
    console.log("This is the sidePag", theSidePad);
    console.log("width", w );
    console.log("height", h);
    var theSidePad = 35;

    var xAxis = d3.svg.axis()
      .scale(timeScale)
      .orient('bottom')
      .ticks(d3.time.years, 1)

      .tickSize(-h + theTopPad + 50, 0, 0)
      .tickFormat(d3.time.format("20" + '%y'));

    var grid = svg.append('g')
      .attr('class', 'grid')
      .attr('transform', 'translate(' + theSidePad + ', ' + (h - 50) + ')')
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "middle")
      .attr("fill", "rgba(0,0,0,0.54)")
      .attr("stroke", "none")
      .attr("font-size", 10)
      .attr("dy", "1em");
  }

  function vertLabels(theGap, theTopPad, theSidePad, theBarHeight, theColorScale) {
    var numOccurances = new Array();
    var prevGap = 0;

    for (var i = 0; i < categories.length; i++) {
      numOccurances[i] = [categories[i], getCount(categories[i], catsUnfiltered)];
    }

    var axisText = svg.append("g") //without doing this, impossible to put grid lines behind text
      .selectAll("text")
      .data(numOccurances)
      .enter()
      .append("text")
      .text(function(d) {
        return d[0];
      })
      .attr("x", 10)
      .attr("y", function(d, i) {
        if (i > 0) {
          for (var j = 0; j < i; j++) {
            prevGap += numOccurances[i - 1][1];
            // console.log(prevGap);
            return d[1] * theGap / 2 + prevGap * theGap + theTopPad;
          }
        } else {
          return d[1] * theGap / 2 + theTopPad;
        }
      })
      .attr("font-size", 13)
      .attr("text-anchor", "start")
      .attr("text-height", 20)
      .attr("width", 30)
      .attr("fill", function(d) {
        for (var i = 0; i < categories.length; i++) {
          if (d[0] == categories[i]) {
            //  console.log("true!");
            return d3.rgb(theColorScale(i)).darker();
          }
        }
      });

  }

  //from this stackexchange question: http://stackoverflow.com/questions/1890203/unique-for-arrays-in-javascript
  function checkUnique(arr) {
    var hash = {},
      result = [];
    for (var i = 0, l = arr.length; i < l; ++i) {
      if (!hash.hasOwnProperty(arr[i])) { //it works with objects! in FF, at least
        hash[arr[i]] = true;
        result.push(arr[i]);
      }
    }
    return result;
  }

  //from this stackexchange question: http://stackoverflow.com/questions/14227981/count-how-many-strings-in-an-array-have-duplicates-in-the-same-array
  function getCounts(arr) {
    var i = arr.length, // var to loop over
      obj = {}; // obj to store results
    while (i) obj[arr[--i]] = (obj[arr[i]] || 0) + 1; // count occurrences
    return obj;
  }

  // get specific from everything
  function getCount(word, arr) {
    return getCounts(arr)[word] || 0;
  }