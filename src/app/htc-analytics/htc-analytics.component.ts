import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Chart } from 'chart.js';
import { AppSettingsService } from '../_services/gps.service';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/interval';
import { Observable } from 'rxjs';
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
  tempflag: boolean = false;
  charts = [
    {
      "ChartID": "lineChart1",
      "ChartObj": Chart,
      "ChartHeader": "Acceleration X, Y & Z",
      "ChartCollection": ["Acceleration Xv (m/s²)", "Acceleration Yv (m/s²)", "Acceleration Zv (m/s²)"],
      "x": [],
      "y": [
        { "y1": [] },
        { "y2": [] },
        { "y3": [] }
      ]
    },
    {
      "ChartID": "lineChart2",
      "ChartObj": Chart,
      "ChartHeader": "Angular rate X, Y & Z",
      "ChartCollection": ["Angular rate Xv (deg/s)", "Angular rate Yv (deg/s)", "Angular rate Zv (deg/s)"],
      "x": [],
      "y": [
        { "y1": [] },
        { "y2": [] },
        { "y3": [] }
      ]
    },
    {
      "ChartID": "lineChart3",
      "ChartObj": Chart,
      "ChartHeader": "Velocity forward, lateral & down",
      "ChartCollection": ["Velocity forward (m/s)", "Velocity lateral (m/s)", "Velocity down (m/s)"],
      "x": [],
      "y": [
        { "y1": [] },
        { "y2": [] },
        { "y3": [] }
      ]
    },
    {
      "ChartID": "lineChart4",
      "ChartObj": Chart,
      "ChartHeader": "Pitch & Roll",
      "ChartCollection": ["Pitch (deg)", "Roll (deg)"],
      "x": [],
      "y": [
        { "y1": [] },
        { "y2": [] }
      ]
    },
    {
      "ChartID": "lineChart5",
      "ChartObj": Chart,
      "ChartHeader": "Heading",
      "ChartCollection": ["Heading (deg)"],
      "x": [],
      "y": [
        { "y1": [] }
      ]
    },
    {
      "ChartID": "lineChart6",
      "ChartObj": Chart,
      "ChartHeader": "Distance horizontal",
      "ChartCollection": ["Distance horizontal (m)"],
      "x": [],
      "y": [
        { "y1": [] }
      ]
    }
  ];
  sidebar: boolean = false;
  latitude: number = 12.9503;
  longitude: number = 77.7121;
  flag: boolean = true;
  setNewPos: any;
  marker: any;
  map: any;
  myIcon: any;
  i: number = 1000;
  colors: string[] = ["blue", "red", "black"];
  chartCategory: string[] = ["line"];
  xaxisMinimalPoints: number = 5;

  constructor(private appSettingsService: AppSettingsService) {

  }

  ngOnInit() {
    let dataPoints = [];
    let dpsLength = 0;
    this.map = L.map('map').setView([this.latitude, this.longitude], 5);
    this.myIcon = L.icon({
      iconUrl: '../../assets/images/marker-icon.png',
      iconSize: [38, 56],
      iconAnchor: [22, 55],
      popupAnchor: [-3, -76],
      shadowUrl: '../../assets/images/marker-shadow.png',
      shadowSize: [68, 56],
      shadowAnchor: [22, 55]
    });
    this.marker = L.marker([this.latitude, this.longitude], { icon: this.myIcon });
    this.marker.addTo(this.map);
    const attribution = '';
    const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const tiles = L.tileLayer(tileUrl, { attribution });
    tiles.addTo(this.map);

    Observable
      .interval(1000)
      .flatMap(() => this.appSettingsService.getLiveLocation())
      .subscribe(data => {
        this.marker.setLatLng([data.iss_position.latitude, data.iss_position.longitude], { icon: this.myIcon });
        if (this.flag) {
          this.map.setView([data.iss_position.latitude, data.iss_position.longitude], 5);
          this.flag = false;
        }
      });




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
          },
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: false,
              }
            }]
          }
        }
      });
    }
    Observable
      .interval(1000)
      .flatMap(() => this.appSettingsService.getMomentumData())
      .subscribe(data => {
        if (this.appSettingsService.currentTimer <= (data[data.length - 1].Time * 10)) {
          let tempdata = data.filter(x => x.Time * 10 === this.appSettingsService.currentTimer)[0];
          for (let index = 0; index < this.charts.length; index++) {
            if (this.charts[index]["x"].length == this.xaxisMinimalPoints) {
              this.charts[index]["x"].shift();
              for (let index2 = 0; index2 < this.charts[index]["ChartCollection"].length; index2++) {
                let tempString: string = "y" + (index2 + 1);
                this.charts[index]["y"][index2][tempString].shift();
              }
            }
            this.charts[index]["x"].push(this.appSettingsService.currentTimer / 10);
            for (let index3 = 0; index3 < this.charts[index]["ChartCollection"].length; index3++) {
              let tempString: string = "y" + (index3 + 1);
              this.charts[index]["y"][index3][tempString].push(tempdata[this.charts[index]["ChartCollection"][index3]]);
            }
            this.charts[index]["ChartObj"].chart.update();
          }
          this.appSettingsService.currentTimer += 1
        }
        else {
          this.appSettingsService.currentTimer = 4
        }
      });
  }

  switchdisplay = function () {
    this.sidebar = !this.sidebar;
  }

  MaximizeGraph = function (event) {
    console.log(event.path[2]);
  }


}
