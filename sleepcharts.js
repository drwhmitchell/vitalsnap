//  SLEEPCHARTS.JS - Package of sleep chart drawing functions

// Convert a sleepnet hypno into a hypno we can plot in a stepline chart
function marshallSleepNetHypno(hypno) { 
  const hypnoState = ["Catatonic","Deep", "Light", "REM", "Wake"];
  var newHypno = [];

  hypno.forEach((el, i) => {
    newHypno.push({x: el.y[0], y: hypnoState.indexOf(el.x)});
  });
  newHypno.sort((a, b) => {return a.x - b.x});  // sort the new array

  newHypno.forEach((el, i) => {el.x = new Date(el.x).toLocaleString()});    // now change from epoch secs to real dates

  // Finally, add a record onto the end that makes the Hypno work because the final element is there...
  newHypno.push({x: new Date(hypno[hypno.length-1].y[1]).toLocaleString(), y: hypnoState.indexOf(hypno[hypno.length-1].x)});
  console.log("NEW HYPNO =: " + JSON.stringify(newHypno));
  return(newHypno);
}

/*
function getLineColor(ctx) {
  const index = ctx.dataIndex;
//if (index === undefined) return("#FFFFFF");

const lineColor = index %2 ? "#6fdcea" : "#FFFFFF";
console.log("GetLineColor [" + index + "] == " + lineColor);
  return (lineColor);
}
*/

function getLineWidth(ctx) {

  const index = ctx.dataIndex;
console.log("GetLineWidth(" + index + ")");

const lineWidth = index %2 ? 1 : 4;
  ctx.lineWidth = lineWidth;
  return (lineWidth);
}

function getLineColor(ctx) {
  console.log("Entering GetLineColor");

  const index = ctx.datasetIndex;
  if (index == undefined) return("#FFFFFF");
  
  const lineColor = index %2 ? "#6fdcea" : "#FFFFFF";
  console.log("GetLineColor [" + index + "] == " + lineColor);
    return (lineColor);
};

function DeStepHypno(hypno) {
  var newHypno = [];
  var len = hypno.length;
  for (i=0; i<len-1; i++) {
    newHypno.push({x: hypno[i].x, y: hypno[i].y});
    newHypno.push({x: hypno[i+1].x, y: hypno[i].y});  // Artificial segment
  }
  return(newHypno);
}

// Dynamically creates a chart sleep data (Hypno, Asleep) added on the to the DOM element passed in
// Returns a ref to the chart object so that it can be cleaned up
function CreateHypnoChart(chartContainerID, titleText, startTime, endTime, sleepArch) {
  const oldstateColors = ["#FFFFFF","#6ECCFF","#458EC3","#27487C"];
  const stateColors = ["#FFFFFF", "#27487C","#458EC3","#6ECCFF","#FFFFFF"];
 // const hypnoState = ["Catatonic","Deep", "Light", "REM", "Wake"];

  console.log("CreateHypnoChart with Start/End=" + startTime + "-" + endTime);
  console.log("HYPNO DATA =" + sleepArch.hypno);
  var hypnoData = marshallSleepNetHypno(JSON.parse(sleepArch.hypno));
  var deSteppedData = DeStepHypno(hypnoData);
  console.log("DE-STEPPED DATA =" + JSON.stringify(deSteppedData));
  var newChartElID = "sleepBioChart" + Math.random()*10;

  var chartsHTML = document.getElementById(chartContainerID);
  var newHTMLbuf = [];

 // const skipped = (ctx, value) => {console.log("Skipped (" + ctx.p0.parsed.y + "," + ctx.p1.parsed.y + ")"); return(ctx.p0.skip || ctx.p1.skip ? value : undefined);};
  const down = (ctx, value) => {ctx.p0.parsed.y > ctx.p1.parsed.y ? value : undefined};

  const skipped = (ctx, value) => {
//    console.log("Segment (" + ctx.p0.parsed.x + "," + ctx.p0.parsed.y + ")"); 
//    console.log("TO (" + ctx.p1.parsed.x + "," + ctx.p1.parsed.y + ") "); 

    if (ctx.p0.parsed.x == ctx.p1.parsed.x) 
      return('#458EC3'); // gray for the vertical segments

    else {
 //     return(stateColors[ctx.p0.parsed.y]);
 //   }
      switch (ctx.p0.parsed.y) {
      case 0:
        return '#000000';
      case 1:   // Deep
        return '#27487C';
      case 2:   // Light
        return '#458EC3';
       case 3:  // REM
        return '#6ECCFF';
      case 4:  // Wake
        return '#F2F4F6';
      }
    }
    return("#afb3bd");
  }

  const bw = (ctx) => {
    if (ctx.p0.parsed.x == ctx.p1.parsed.x) 
      return(2); // thin line for verticals
    else 
      return(15);
  }



  if (titleText === 'SleepSignal_Hypno') titleText = 'DeepSleep AppleWatch';
  // Dynamically append HTML to the 'chartContainerID' DOM element that 
  // creates a div wrapper around a chart element with ID 'newchartElID'
 // newHTMLbuf += "<div class='sleep-record-container'> \
 //               <canvas id='" + newChartElID + "' style='width:100%'></canvas></div>";
  
  newHTMLbuf += "<canvas id='" + newChartElID + "' style='width:400px'></canvas>";

/*
  // Tack on a line of stats
  newHTMLbuf += "<div class='text-center' style='background-color: #F5F4F8'>";
  newHTMLbuf += "<small>SCORE " + Math.round(sleepArch.score);
  newHTMLbuf += "&nbsp &nbsp &nbsp &nbsp &nbsp TST " + epochTimeToHours(sleepArch.tst) + " hours";
  newHTMLbuf += "&nbsp &nbsp &nbsp &nbsp &nbsp DEEP " + epochTimeToHours(sleepArch.timedeep) + " hours";
  newHTMLbuf += "&nbsp &nbsp &nbsp &nbsp &nbsp REM " + epochTimeToHours(sleepArch.timerem) + " hours";
  newHTMLbuf += "&nbsp &nbsp &nbsp &nbsp &nbsp AWAKE " + epochTimeToHours(sleepArch.timeawake) + " hours";
  newHTMLbuf += "</small></div><br>";
*/

console.log("Chart container='" + chartContainerID + "'");

  chartsHTML.innerHTML += newHTMLbuf;   // Append the new HTML
  console.log("Creating new Chart='" + newChartElID + "'");
console.log("Hypno Data = " + JSON.stringify(hypnoData));
  var ctx = document.getElementById(newChartElID).getContext('2d');
  const hypnoChart = new Chart(ctx, {
    data: {
        datasets: [{
            type: 'line',
            label: 'Sleep State',
            yAxisID: 'SleepState',
            segment: {
//                borderColor: getLineColor(ctx),
              borderColor: ctx => skipped(ctx, '#6fdcea') || down(ctx, 'rgb(192,75,75)'),
              borderWidth: ctx => bw(ctx),
//              borderDash: ctx => skipped(ctx, [6, 6]),
            },
//            stepped: true,
//            borderColor: "#B6BABB",
//            borderColor: getLineColor(),
//            backgroundColor: getLineColor,

            borderWidth : getLineWidth(ctx),

            fill: false,
            radius: 0,
            data : deSteppedData,
//            animations: {
//              tension: {
//                duration: 1000,
//                easing: 'linear',
//                from: 1,
//                to: -0.25,
//                loop: true,
//              }
//            }
          }],
      },
      options: {
//        elements: {
//          line: {
//            fill: true,
//            backgroundColor: "#B6BABB", //getLineColor,
//            borderColor: "#fa4626db", //getLineColor,
//          },
//          point: {
//            backgroundColor: "#B6BABB", //getLineColor,
//
//          },
//        },
        layout: {
          padding: {
//              right: 86,
right: 25,
              left: 20,
          }
      },

        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend : {
            display: false,
          },
          title: {
            display: true,
//            text: titleText,
            font : { size: 18},
          }
        },
        scales: {
          x: {

            grid : {
              borderColor: '#F2F4F6',
            },
            min: startTime,
            max: endTime,
            display: true,
            type: 'time',
            time: {
              unit: 'hour',  
              displayFormats: {
                hour: 'h a'
              }
            },
            ticks: {
              color : '#F2F4F6',
            }
          },
          SleepState: {
            type: 'linear',
            display: true,
            title: {
 //             display : true,
              text : 'Sleep State',
              font : { size: 18 },
            },
            position: 'left',
            min: 0,
            max: 5,
            ticks: {
              color : stateColors,
              beginAtZero: true,
              min: 0,
              max: 5,
              stepSize: 1,
              callback: function(label, index, labels) {
                switch (label) {
                  case 0:
                    return '';
                  case 1:
                    return 'DEEP';
                  case 2:
                    return 'LIGHT';
                   case 3:
                    return 'REM';
                  case 4:
                    return 'WAKE';
                }
              }
            }
          }
        }
      }
  })
  return hypnoChart;
}


function CalcStatsData(hypno) {
  console.log("Calcing Stats Data....")
  return([{x: 10, y:1}, {x: 9, y:2},{x: 8, y:3},])
}

function CreateStatsChart(chartContainerID, titleText, startTime, endTime, sleepArch) {
  console.log("Creating STATS CHART with Start/End=" + new Date(startTime).toLocaleTimeString() + "-" + new Date(endTime).toLocaleTimeString());
  
  const stateColors = ["#FFFFFF","#6ECCFF","#458EC3","#27487C"];
  var statsData = CalcStatsData(sleepArch.hypno);
  var chartsHTML = document.getElementById(chartContainerID);
  var newHTMLbuf = [];
  var newChartElID = chartContainerID + "-canvas";
  newHTMLbuf += "<canvas id='" + newChartElID + "' style='width:400px; height:125px;'></canvas>";
  console.log("STATS Chart container='" + chartContainerID + "'");
  newHTMLbuf += "<hr>Stats Chart";
  chartsHTML.innerHTML += newHTMLbuf;   // Append the new HTML
  console.log("Creating new Stats Chart");

  const data = {
    labels: ["WAKE", "REM", "LIGHT", "DEEP"],
    datasets: [
      {
        categoryPercentage: 1.0,
        barPercentage: 1.0,
        axis: 'y',
        label: 'Stats',
        display: false,
        data: [1, 2, 4.5, 1.5],
  //      borderColor: "#C70039",
        fill: false,
        backgroundColor: stateColors,
      }]
  };
  const options = {
      indexAxis: 'y',
      barThickness: 'flex',
      maxBarThickness: 20,

   //   barThickness: 15,

      // Elements options apply to all of the options unless overridden in a dataset
      // In this case, we are setting the border of each horizontal bar to be 2px wide
      elements: {
        bar: {
          borderWidth: 2,
        },
      },
      layout: {
        padding: {
            right: 25,
            left: 20,
        }
      },
      scales: {
        x: {
          display: false,
          ticks: {
            },
        },
        y: {

          display: true,
          ticks: {
            callback: function(val, index) {
              // Hide every 2nd tick label
              return this.getLabelForValue(val);
//              return index % 2 === 0 ? this.getLabelForValue(val) : '';
            },
            color: stateColors,
          },
        },
      },
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: false,
          text: 'Stats Bar Chart'
        }
      },
    };

  var ctx = document.getElementById(newChartElID).getContext('2d');
  const statsChart = new Chart(ctx, {
    type: 'bar',
    data: data,
    options: options,
  });
  return(statsChart);
}
/*






    data: {
          datasets: [{
              type: 'bar',
              label: 'Stats',
              yAxisID: 'y',
              borderColor: '#C70039',	
//              backgroundColor: '#C70039',	
              data : statsData,
            }],
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend : {
              display: false,
            },
            title: {
              display: true,
              text: titleText,
              font : { size: 18},
            }
          },
 //         scales: {
//            x: {
//              display: true,
//              type: 'time',
//              bounds: 'data',
//              min: startTime,
//              max: endTime,
//              time: {
//                unit: 'hour',  
//                displayFormats: {
//                  hour: 'h a'
//                },
//              },
//            }      
//          }
        }
    });
    return statsChart;
  }
*/


// Helper Functions

function epochTimeToHours(epochTime) {
  var elapsedHrs = Math.floor(epochTime/3600000);
  var elapsedMin = Math.floor(((epochTime/3600000) - elapsedHrs) * 60);
  return(elapsedHrs.toString() + ":" + elapsedMin.toString().padStart(2, '0'));
}
