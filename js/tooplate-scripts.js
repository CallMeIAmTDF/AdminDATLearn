const width_threshold = 480;

function drawLineChart() {
  if ($("#lineChart").length) {
    ctxLine = document.getElementById("lineChart").getContext("2d");
    optionsLine = {
      scales: {
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: "Hits"
            }
          }
        ]
      }
    };

    // Set aspect ratio based on window width
    optionsLine.maintainAspectRatio =
      $(window).width() < width_threshold ? false : true;

    configLine = {
      type: "line",
      data: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July"
        ],
        datasets: [
          {
            label: "Latest Hits",
            data: [88, 68, 79, 57, 50, 55, 70],
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            cubicInterpolationMode: "monotone",
            pointRadius: 0
          },
          {
            label: "Popular Hits",
            data: [33, 45, 37, 21, 55, 74, 69],
            fill: false,
            borderColor: "rgba(255,99,132,1)",
            cubicInterpolationMode: "monotone",
            pointRadius: 0
          },
          {
            label: "Featured",
            data: [44, 19, 38, 46, 85, 66, 79],
            fill: false,
            borderColor: "rgba(153, 102, 255, 1)",
            cubicInterpolationMode: "monotone",
            pointRadius: 0
          }
        ]
      },
      options: optionsLine
    };

    lineChart = new Chart(ctxLine, configLine);
  }
}
async function API(url, method, token, data) {
  response = await fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
}
function drawBarChart() {
  API('https://jsonblob.com/api/1229399920485457920', 'GET').then(data => data.data).then(data => {
    var lname = [];
    var numUsers = [];
    for (let i = 0; i < data.length; i++) {
      lname.push(data[i].lname);
      numUsers.push(data[i].numUsers);
    }
    if ($("#barChart").length) {
      ctxBar = document.getElementById("barChart").getContext("2d");
      optionsBar = {
        responsive: true,
        scales: {
          xAxes: [
            {
              barPercentage: 0.7,
              ticks: {
                beginAtZero: true
              },
              scaleLabel: {
                display: true,
                labelString: "Cấp bậc"
              }
            }
          ],
          yAxes: [
            {
              barPercentage: 0.7,
              ticks: {
                beginAtZero: true
              },
              scaleLabel: {
                display: true,
                labelString: "Câu hỏi"
              }
            }
          ]
        }
      };
      optionsBar.maintainAspectRatio =
        $(window).width() < width_threshold ? false : true;
      configBar = {
        type: "bar",
        data: {
          labels: lname,
          datasets: [
            {
              label: "Số lượt trả lời",
              data: numUsers,
              backgroundColor: "#DB9C3F",
              borderWidth: 0
            }
          ]
        },
        options: optionsBar
      };
      barChart = new Chart(ctxBar, configBar);
    }
  }
  )
}

function drawPieChart() {
  API('http://localhost:8080/api/history/getNumCorrectAndInCorrectAns', 'GET', window.localStorage.getItem('accessTokenADMIN'), null).then(d => {
    d = d.data
    if ($("#pieChart").length) {
      var chartHeight = 300;
      $("#pieChartContainer").css("height", chartHeight + "px");
      ctxPie = document.getElementById("pieChart").getContext("2d");
      optionsPie = {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10
          }
        },
        legend: {
          position: "top"
        }
      };
      configPie = {
        type: "pie",
        data: {
          datasets: [
            {
              data: [d.incorrect, d.correct],
              backgroundColor: ["#F7604D", "#4ED6B8"],
              label: "Storage"
            }
          ],
          labels: [
            "Số câu trả lời sai",
            "Số câu trả lời đúng",
          ]
        },
        options: optionsPie
      };

      pieChart = new Chart(ctxPie, configPie);
    }
  })

}

function updateLineChart() {
  if (lineChart) {
    lineChart.options = optionsLine;
    lineChart.update();
  }
}

function updateBarChart() {
  if (barChart) {
    barChart.options = optionsBar;
    barChart.update();
  }
}
