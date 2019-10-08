import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Chart } from 'chart.js';
import { AppSettingsService } from '../_services/gps.service';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/interval';
import { Observable } from 'rxjs';
import * as $ from 'jquery';
import { AngularFireDatabase } from '@angular/fire/database';
declare var ol: any;
declare let L;



@Component({
  selector: 'app-htc-analytics',
  templateUrl: './htc-analytics.component.html',
  styleUrls: ['./htc-analytics.component.css']
})

export class HtcAnalyticsComponent implements OnInit, AfterViewInit {

  @ViewChild('myModal') myModal;
  maximize: boolean = true;
  chartModal: Chart;
  tempChartId: string;
  labelString: boolean = false;
  tempflag: boolean = false;
  parameters = [];
  charts = [
    {
      "ChartID": "lineChart1",
      "ChartObj": Chart,
      "ChartHeader": "Acceleration X, Y & Z",
      "ChartCollection": ["Acceleration Xv", "Acceleration Yv", "Acceleration Zv"],
      "x": [],
      "y": [
        { "y1": [] },
        { "y2": [] },
        { "y3": [] }
      ],
      "overlay": false
    },
    {
      "ChartID": "lineChart2",
      "ChartObj": Chart,
      "ChartHeader": "Angular rate X, Y & Z",
      "ChartCollection": ["Angular rate Xv", "Angular rate Yv", "Angular rate Zv"],
      "x": [],
      "y": [
        { "y1": [] },
        { "y2": [] },
        { "y3": [] }
      ],
      "overlay": false
    },
    {
      "ChartID": "lineChart3",
      "ChartObj": Chart,
      "ChartHeader": "Velocity forward, lateral & down",
      "ChartCollection": ["Velocity forward", "Velocity lateral", "Velocity down"],
      "x": [],
      "y": [
        { "y1": [] },
        { "y2": [] },
        { "y3": [] }
      ],
      "overlay": false
    },
    {
      "ChartID": "lineChart4",
      "ChartObj": Chart,
      "ChartHeader": "Pitch & Roll",
      "ChartCollection": ["Pitch", "Roll"],
      "x": [],
      "y": [
        { "y1": [] },
        { "y2": [] }
      ],
      "overlay": false
    },
    {
      "ChartID": "lineChart5",
      "ChartObj": Chart,
      "ChartHeader": "Heading",
      "ChartCollection": ["Heading"],
      "x": [],
      "y": [
        { "y1": [] }
      ],
      "overlay": false
    },
    {
      "ChartID": "lineChart6",
      "ChartObj": Chart,
      "ChartHeader": "Distance horizontal",
      "ChartCollection": ["Distance horizontal"],
      "x": [],
      "y": [
        { "y1": [] }
      ],
      "overlay": false
    }
  ];
  units = [
    {
      "type": "Time",
      "units": [
        {
          "name": "Sec",
          "status": true,
          "factor": 1
        }
      ]
    },
    {
      "type": "Angular rate X, Y & Z",
      "units":
        [
          {
            "name": "deg/s",
            "status": true,
            "factor": 1
          },
          {
            "name": "rad/s",
            "status": false,
            "factor": 0.0174533
          }
        ]
    },
    {
      "type": "Acceleration X, Y & Z",
      "units": [
        {
          "name": "m/s2",
          "status": true,
          "factor": 1
        },
        {
          "name": "g",
          "status": false,
          "factor": 0.101972
        }
      ]
    },
    {
      "type": "Pitch & Roll",
      "units": [
        {
          "name": "deg",
          "status": true,
          "factor": 1
        },
        {
          "name": "rad",
          "status": false,
          "factor": 0.0174533
        }
      ]
    },
    {
      "type": "Heading",
      "units": [
        {
          "name": "deg",
          "status": true,
          "factor": 1
        },
        {
          "name": "rad",
          "status": false,
          "factor": 0.0174533
        }
      ]
    },
    {
      "type": "Longitude & Latitude",
      "units": [
        {
          "name": "deg",
          "status": true,
          "factor": 1
        },
        {
          "name": "rad",
          "status": false,
          "factor": 0.0174533
        }
      ]
    },
    {
      "type": "Altitude",
      "units": [
        {
          "name": "m",
          "status": true,
          "factor": 1
        },
        {
          "name": "Inch",
          "status": false,
          "factor": 39.3701
        },
        {
          "name": "Ft",
          "status": false,
          "factor": 3.28084
        }
      ]
    },
    {
      "type": "Distance horizontal",
      "units": [
        {
          "name": "m",
          "status": true,
          "factor": 1
        },
        {
          "name": "Km",
          "status": false,
          "factor": 0.001
        },
        {
          "name": "Mile",
          "status": false,
          "factor": 0.000621371
        }
      ]
    },
    {
      "type": "Velocity",
      "units": [
        {
          "name": "m/s",
          "status": true,
          "factor": 1
        },
        {
          "name": "Km/hr",
          "status": false,
          "factor": 3.6
        },
        {
          "name": "Mile/hr",
          "status": false,
          "factor": 2.23694
        }
      ]
    },
    {
      "type": "Graph Points",
      "units": [
        {
          "name": "5",
          "status": true,
          "factor": 5
        },
        {
          "name": "10",
          "status": false,
          "factor": 10
        }
      ]
    }
  ];
  threadLock: boolean = true;
  sidebar: boolean = false;
  latitude: number = 12.9503;
  longitude: number = 77.7121;
  flag: boolean = true;
  setNewPos: any;
  marker: any;
  circle: any;
  map: any;
  myIcon: any;
  i: number = 1000;
  colors: string[] = ["blue", "red", "black"];
  chartCategory: string[] = ["line"];
  xaxisMinimalPoints: number = 5;
  mapViewNumber: Number = 13;
  imgid: string = "";
  fullurl : string = "https://firebasestorage.googleapis.com/v0/b/mobilitydb-5e890.appspot.com/o/img0249.jpeg?alt=media&token=48b037b7-ef37-470e-9ecc-cf44024f2e6a";

  constructor(private appSettingsService: AppSettingsService, public db: AngularFireDatabase) {

  }

  ngOnInit() {
    let dataPoints = [];
    let dpsLength = 0;
    this.map = L.map('map').setView([this.latitude, this.longitude], this.mapViewNumber);
    this.myIcon = L.icon({
      iconUrl: 'assets/images/cars.svg',
      iconSize: [58, 76],
      iconAnchor: [22, 55],
      popupAnchor: [-3, -76],
      shadowUrl: 'assets/images/marker-shadow.png',
      shadowSize: [68, 56],
      shadowAnchor: [22, 55]
    });
    this.marker = L.marker([this.latitude, this.longitude], { icon: this.myIcon });
    this.marker.addTo(this.map);
    const attribution = '';
    const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const tiles = L.tileLayer(tileUrl, { attribution });
    tiles.addTo(this.map);
    const apiURL = 'https://api.wheretheiss.at/v1/satellites/25544';
  }

  ngAfterViewInit(): void {
    for (let index = 0; index < this.charts.length; index++) {
      let tempArray = [];
      for (let index2 = 0; index2 < this.charts[index]["y"].length; index2++) {
        let tempString: string = "y" + (index2 + 1);
        let temp = {
          label: '',
          data: this.charts[index]["y"][index2][tempString],
          fill: false,
          lineTension: .5,
          borderColor: this.colors[index2],
          borderWidth: 1
        };
        tempArray.push(temp);
      }
      this.charts[index]["ChartObj"] = new Chart(this.charts[index]["ChartID"], {
        type: this.chartCategory[Math.floor(Math.random() * this.chartCategory.length)],
        data: {
          labels: this.charts[index]["x"],
          datasets: tempArray
        },
        options: {
          title: {
            text: this.charts[index]["ChartHeader"],
            display: true,
            fontFamily: "exo",
            fontSize: 18
          },
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: false,
              },
              scaleLabel: {
                display: this.labelString,
                labelString: this.charts[index]["ChartHeader"]
              }
            }],
            xAxes: [{
              scaleLabel: {
                display: this.labelString,
                labelString: 'Time Elapsed in Sec.'
              }
            }]
          }
        }
      });
    }
    Observable
      .interval(1000)
      .flatMap(() => this.db.list("/livePosition").valueChanges())
      .subscribe(data => {
        if (this.threadLock) {
          if (this.appSettingsService.currentTimer <= (data[data.length - 1]["Time"] * 10)) {
            let factor = 1;
            let unitHeader = "";
            this.parameters = [];
            let tempdata = data.filter(x => x["Time"] * 10 === this.appSettingsService.currentTimer)[0];
            // this.imgid = tempdata["Video"];
            // this.fullurl = "https://firebasestorage.googleapis.com/v0/b/mobilitydb-5e890.appspot.com/o/" + this.imgid + ".jpeg?alt=media&token=65f811f4-221c-4d2c-b70c-b1cb6f726a43";
            this.marker.setLatLng([tempdata["Latitude"], tempdata["Longitude"]], { icon: this.myIcon });

            if (this.flag) {
              this.map.setView([tempdata["Latitude"], tempdata["Longitude"]], this.mapViewNumber);
              this.flag = false;
            }
            for (let index = 0; index < this.charts.length; index++) {
              let unitOB = this.units.filter(x => this.charts[index]["ChartHeader"].includes(x.type))[0].units.filter(y => y.status == true)[0];
              unitHeader = unitOB.name;
              if (this.charts[index]["x"].length == this.xaxisMinimalPoints) {
                this.charts[index]["x"].shift();
                for (let index2 = 0; index2 < this.charts[index]["ChartCollection"].length; index2++) {
                  let tempString: string = "y" + (index2 + 1);
                  this.charts[index]["y"][index2][tempString].shift();
                }
              }
              else if (this.charts[index]["x"].length > this.xaxisMinimalPoints) {
                for (let index2 = 0; index2 <= (this.charts[index]["x"].length - this.xaxisMinimalPoints) + 1; index2++) {
                  this.charts[index]["x"].shift();
                  for (let index3 = 0; index3 < this.charts[index]["ChartCollection"].length; index3++) {
                    let tempString: string = "y" + (index3 + 1);
                    this.charts[index]["y"][index3][tempString].shift();
                  }
                }
              }

              factor = unitOB.factor;
              this.charts[index]["x"].push(this.appSettingsService.currentTimer / 10);
              for (let index3 = 0; index3 < this.charts[index]["ChartCollection"].length; index3++) {
                let tempString: string = "y" + (index3 + 1);
                let tempNo = tempdata[this.charts[index]["ChartCollection"][index3]] * factor;
                this.charts[index]["y"][index3][tempString].push(tempNo);
                let tempP = {
                  "Parameter":"",
                  "Value":"",
                  "Unit":""
                };
                tempP.Parameter = this.charts[index]["ChartCollection"][index3];
                tempP.Unit = unitOB.name;
                tempP.Value = tempNo.toFixed(4);
                this.parameters.push(tempP);
              }
              let newHeader = this.charts[index]["ChartHeader"] + " ( " + unitHeader + " ) ";
              this.charts[index]["ChartObj"].chart.options.title.text = newHeader;
              this.charts[index]["ChartObj"].chart.update();
            }
            this.appSettingsService.currentTimer += 1;
            
          }
          else {
            this.appSettingsService.currentTimer = 4;
          }
          
        }
      });
  }

  switchdisplay = function (event) {
    if (event.path[0].className == "fixed-plugin") {
      this.sidebar = !this.sidebar;
    }
  }

  MaximizeGraph = function (event, index) {
    this.tempflag = !this.tempflag;
    this.labelString = !this.labelString;
    let tObj = this.charts.filter(x => x.ChartID == index)[0];
    this.charts[this.charts.indexOf(tObj)]["ChartObj"].chart.options.scales.xAxes[0].scaleLabel.display = this.labelString;
    this.charts[this.charts.indexOf(tObj)]["ChartObj"].chart.options.scales.yAxes[0].scaleLabel.display = this.labelString;
    if (this.tempflag) {
      $("#" + event.path[2].id).addClass("col-lg-8");
      $("#" + event.path[2].id).removeClass("col-lg-4");
      $("#" + event.path[2].id).addClass("maximize-graph");
      this.xaxisMinimalPoints = 10;
    }
    else {
      $("#" + event.path[2].id).removeClass("col-lg-8");
      $("#" + event.path[2].id).addClass("col-lg-4");
      $("#" + event.path[2].id).removeClass("maximize-graph");
      this.xaxisMinimalPoints = 5;
    }
    this.charts[this.charts.indexOf(tObj)]["ChartObj"].chart.update();
  }

  configChange = function (unit, unitObj) {
    this.threadLock = false;
    if (unit.type != "Graph Points" && unit.type != "Time" && unit.type != "Longitude & Latitude" && unit.type != "Altitude") {
      let tempobj = this.charts.filter(x => x.ChartHeader.includes(unit.type))[0];
      this.charts[this.charts.indexOf(tempobj)]["overlay"] = true;
      let temp = this.units[this.units.indexOf(unit)].units;
      for (let index = 0; index < temp.length; index++) {
        this.units[this.units.indexOf(unit)].units[index].status = false;
      }
      this.units[this.units.indexOf(unit)].units[temp.indexOf(unitObj)].status = true;

      setTimeout(() => {
        this.charts[this.charts.indexOf(tempobj)]["overlay"] = false;
      }, 500);

    }
    else if (unit.type == "Graph Points") {
      for (let index = 0; index < this.charts.length; index++) {
        this.charts[index]["overlay"] = true;
      }
      this.xaxisMinimalPoints = unitObj.factor;
      setTimeout(() => {
        for (let index = 0; index < this.charts.length; index++) {
          this.charts[index]["overlay"] = false;
        }
      }, 500);
    }
    this.threadLock = true;
  }
}
