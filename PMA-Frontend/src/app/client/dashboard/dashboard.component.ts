import { Component, OnInit, ViewChild } from "@angular/core";
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexYAxis,
  ApexPlotOptions,
  ApexStroke,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexMarkers,
  ApexGrid,
  ApexTitleSubtitle,
} from "ng-apexcharts";
import { AuthService } from "src/app/core/service/auth.service";
import { ProjectsService } from "src/app/core/service/projects.service";
import { ReclamationService } from "src/app/core/service/reclamation.service";
export type areaChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  colors: string[];
};

export type restRateChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  colors: string[];
  yaxis: ApexYAxis;
  grid: ApexGrid;
  tooltip: ApexTooltip;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
};
export type performanceRateChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  colors: string[];
  yaxis: ApexYAxis;
  grid: ApexGrid;
  tooltip: ApexTooltip;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
};

export type radialChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  colors: string[];
  plotOptions: ApexPlotOptions;
};
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.sass"],
})
export class DashboardComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public areaChartOptions: Partial<areaChartOptions>;
  public radialChartOptions: Partial<radialChartOptions>;
  public restRateChartOptions: Partial<restRateChartOptions>;
  public performanceRateChartOptions: Partial<performanceRateChartOptions>;
  user
  projects
  nb_onhold = 0
  nb_Completed = 0
  nb_progrees = 0
  reclamations
  constructor(private authSer: AuthService,
    private projectServ: ProjectsService,
    private reclaserv: ReclamationService) { }
  ngOnInit() {
    this.chart1();
    this.chart2();
    this.chart3();
    this.chart4();

    this.user = this.authSer.currentUserValue
    // console.log("this.user",this.user);
    this.projectServ.getprojectbyClient(this.user.id).subscribe({
      next: (res) => {
        this.projects = res
        this.cal(this.projects)
      },
      error: (err) => {
        console.log(err);

      }
    })
    this.reclaserv.getReclamtionByCleit(this.user.id).subscribe({
      next: (res) => {
        this.reclamations = res
      }
    })

  }
  cal(tab: any[]) {
    tab.forEach((item: any) => {
      if (item.status == "On Hold") {
        this.nb_onhold = this.nb_onhold + 1
      }
      else if (item.status == "Completed") {
        this.nb_Completed++
      }
      else if (item.status == "In Progress") {
        this.nb_progrees++;
      }
    })
  }
  private chart1() {
    this.areaChartOptions = {
      series: [
        {
          name: "New Clients",
          data: [31, 40, 28, 51, 42, 85, 77],
        },
        {
          name: "Old Clients",
          data: [11, 32, 45, 32, 34, 52, 41],
        },
      ],
      chart: {
        height: 350,
        type: "area",
        toolbar: {
          show: false,
        },
        foreColor: "#9aa0ac",
      },
      colors: ["#7D4988", "#66BB6A"],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        type: "datetime",
        categories: [
          "2018-09-19T00:00:00.000Z",
          "2018-09-19T01:30:00.000Z",
          "2018-09-19T02:30:00.000Z",
          "2018-09-19T03:30:00.000Z",
          "2018-09-19T04:30:00.000Z",
          "2018-09-19T05:30:00.000Z",
          "2018-09-19T06:30:00.000Z",
        ],
      },
      legend: {
        show: true,
        position: "top",
        horizontalAlign: "center",
        offsetX: 0,
        offsetY: 0,
      },

      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm",
        },
      },
    };
  }
  private chart2() {
    this.radialChartOptions = {
      series: [44, 55, 67],
      chart: {
        height: 265,
        type: "radialBar",
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: {
              fontSize: "22px",
            },
            value: {
              fontSize: "16px",
            },
            total: {
              show: true,
              label: "Total",
              formatter: function (w) {
                return "249";
              },
            },
          },
        },
      },
      colors: ["#ffc107", "#3f51b5", "#8bc34a"],

      labels: ["Face TO Face", "E-Consult", "Available"],
    };
  }
  public getColor(index: number): string {
    switch (index) {
      case 0: return "col-red"
      case 1: return "col-amber"
      case 2: return "col-purple"
      case 3: return "col-blue"
      case 4: return "col-cryan"
      case 5: return "col-green"
      default: return "col-green"
    }
  }

  private chart3() {
    this.restRateChartOptions = {
      series: [
        {
          name: "Hours",
          data: [69, 75, 72, 69, 75, 66, 80],
        },
      ],
      chart: {
        height: 365,
        type: "line",
        dropShadow: {
          enabled: true,
          color: "#000",
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2,
        },
        foreColor: "#9aa0ac",
        toolbar: {
          show: false,
        },
      },
      colors: ["#6777EF"],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "smooth",
      },
      markers: {
        size: 1,
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
        title: {
          text: "Months",
        },
      },
      yaxis: {
        title: {
          text: "Hours",
        },
      },
      tooltip: {
        theme: "dark",
        marker: {
          show: true,
        },
        x: {
          show: true,
        },
      },
    };
  }
  private chart4() {
    this.performanceRateChartOptions = {
      series: [
        {
          name: "Hours",
          data: [113, 120, 130, 120, 125, 119, 126],
        },
      ],
      chart: {
        height: 365,
        type: "line",
        dropShadow: {
          enabled: true,
          color: "#000",
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2,
        },
        foreColor: "#9aa0ac",
        toolbar: {
          show: false,
        },
      },
      colors: ["#976DA0"],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "smooth",
      },
      markers: {
        size: 1,
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
        title: {
          text: "Months",
        },
      },
      yaxis: {
        title: {
          text: "Hours",
        },
      },
      tooltip: {
        theme: "dark",
        marker: {
          show: true,
        },
        x: {
          show: true,
        },
      },
    };
  }


}
