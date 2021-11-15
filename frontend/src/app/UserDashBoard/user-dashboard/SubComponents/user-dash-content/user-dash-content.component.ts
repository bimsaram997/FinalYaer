import { first } from 'rxjs/operators';
import { LocomotiveService } from './../../../../service/locomotive.service';
import { LoadTrialService } from 'src/app/service/load-trial.service';
import { Router } from '@angular/router';

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import LocoScheduleDTO from '../../../../dto/LocoScheduleDTO';
import { ScheduleService } from '../../../../service/schedule.service';
import { CalendarView } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { CalendarOptions } from '@fullcalendar/angular';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { AddFeedBacksComponent } from '../load-trail/view-load-trials/add-feed-backs/add-feed-backs.component';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { forkJoin } from 'rxjs';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-user-dash-content',
  templateUrl: './user-dash-content.component.html',
  styleUrls: ['./user-dash-content.component.css'],
})
export class UserDashContentComponent implements OnInit {
  dateList: LocoScheduleDTO[] = [];
  dateList1: LocoScheduleDTO[] = [];
  loading = false;
  cont: Array<any>[] = [];
  currentDate = new Date();
  name: any;
  calanderArray: any[] = [];

  calendarOptions: CalendarOptions;

  @Output() valueChange = new EventEmitter();
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [
    {
      data: [65, 59, 80, 81, 56, 55, 40, 20, 60, 20, 30, 45, 56],
      label: 'Series A',
    },
    {
      data: [28, 48, 40, 19, 86, 27, 90, 65, 59, 80, 81, 56, 55],
      label: 'Series B',
    },
    {
      data: [28, 48, 40, 19, 86, 27, 90, 65, 59, 80, 81, 56, 55],
      label: 'Series C',
    },
    // {
    //   data: [28, 48, 40, 19, 86, 27, 90, 65, 59, 80, 81, 56, 55],
    //   label: 'Series B',
    // },
  ];
  isChecked: boolean;

  constructor(
    private schedulesService: ScheduleService,
    private router: Router,
    public dialog: MatDialog,
    private loadTrialService: LoadTrialService,
    private locomotiveService: LocomotiveService
  ) {
    this.loadDate();
  }

  handleDateClick(arg) {
    alert('date click! ' + arg.dateStr);
  }

  ngOnInit(): void {
    this.loadDefaultChartDat();
    const values = JSON.parse(localStorage.getItem('currentUser'));
    this.name = values.userName;

    console.log(this.calanderArray);

    const value = JSON.parse(localStorage.getItem('currentUser'));
    const object = {
      userNic: value.userNic,
      userRole: value.userRole,
      type: 'calender',
    };
    this.schedulesService.getAllScheduleAssigned(object).subscribe((res) => {
      console.log(res);
      if (res && res.length > 0) {
        for (const param of res) {
          for (const sub of param) {
            let eventObject = {
              title: `${sub.loadNo == undefined ? sub.scheduleNo : sub.loadNo}`,
              id: sub._id,
              start: `${moment(
                sub.completedDate ? sub.completedDate : sub.loadDate
              ).format('YYYY-MM-DD')}`,
              //end:moment(sub.scheduleDate).format("YYYY-MM-DD"),
              color: sub.items == undefined ? 'blue' : 'gold',
            };
            this.calanderArray.push(eventObject);
          }
        }
      }
      console.log(this.calanderArray);
    });
    setTimeout(() => {
      this.calendarOptions = {
        initialView: 'dayGridMonth',
        dateClick: function () {},
        events: this.calanderArray,
        contentHeight: '350px',
      };
    }, 500);
  }

  onDateClick(res) {
    alert('Clicked on date : ' + res._id);
  }
  // calendarOptions: CalendarOptions = {
  //   initialView: 'dayGridMonth',
  //   dateClick: this.handleDateClick.bind(this), // bind is important!
  //   events: this.calanderArray
  // };

  loadSchedules() {
    const dialogRef = this.dialog.open(AddFeedBacksComponent, {
      width: '250px',
    });
  }

  loadDate() {
    this.loading = true;
    this.schedulesService.getAllSchedules().subscribe((result) => {
      this.dateList = result;
      this.loading = true;
    });
  }
  selectDay(event) {
    this.loading = true;
    this.schedulesService.getAllSchedules().subscribe((result) => {
      event = result.scheduleNo;
      this.loading = true;
    });
  }

  loadDefaultChartDat() {
    //loadAllData;
    this.barChartData[0].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.barChartData[1].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.barChartData[2].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const values = JSON.parse(localStorage.getItem('currentUser'));
    const object = {
      userNic: values.userNic,
      userRole: values.userRole,
    };
    const _allSch = this.schedulesService.getAllSchedules();
    const _getLoco = this.locomotiveService.getAllLocoAssigned(object);
    const _getLoadTrail = this.loadTrialService.getLoadTrialAssigned(object);

    forkJoin([_allSch, _getLoco, _getLoadTrail])
      .pipe(first())
      .subscribe((res) => {
        var schs = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var barchartArray = [];
        var availableLocoArray = [];
        //locomotive

        // //All schedule
        const _scheduleArray = res[0];
        const _filterSch = _scheduleArray.filter((p) => p.scheduleStatus == 7);
        if (_filterSch.length > 0) {
          x;
          var _yearCount = 12;
          for (var x = 0; x <= _yearCount; x++) {
            const GetVal = _filterSch.filter(
              (c) => new Date(c.scheduleDate).getMonth() == x
            );
            if (GetVal.length > 0) {
              schs[x] = GetVal.length;
            }
          }
        }
        let Sch = {
          data: schs ? schs : null,
          label: 'Completed Schedules',
          borderColor: 'rgb(255, 99, 132)',
        };
        this.barChartData[0] = Sch;
        //   barchartArray.push(Sch);
        var inSchs = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        //icomplete scheudle
        const _filterInComplete = _scheduleArray.filter(
          (p) => p.scheduleStatus != 7
        );
        if (_filterInComplete.length > 0) {
          var _yearCount = 12;
          for (var x = 0; x <= _yearCount; x++) {
            const GetVal = _filterInComplete.filter(
              (c) => new Date(c.scheduleDate).getMonth() == x
            );
            if (GetVal.length > 0) {
              inSchs[x] = GetVal.length;
            }
          }
        }
        let inComplete = {
          data: inSchs ? inSchs : null,
          label: 'InCompleted Schedules',
          backgroundColor: '#7befb2',
        };
        this.barChartData[1] = inComplete;

        const _locomotiveArray = res[1];
        var loco = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        const _availableLoco = _locomotiveArray.filter(
          (p) => p.locoStatus === 0
        );
        if (_availableLoco.length > 0) {
          var _yearCount = 12;
          for (var x = 0; x <= _yearCount; x++) {
            const GetVal = _availableLoco.filter(
              (c) => new Date(c.locoDate).getMonth() == x
            );
            if (GetVal.length > 0) {
              loco[x] = GetVal.length;
            }
          }
        }
        const _availableLocoData = {
          data: loco ? loco : null,
          label: 'Available Locomotives',
        };
        this.barChartData[2] = _availableLocoData;
        if (
          this.barChartData[0] != undefined &&
          this.barChartData[1] != undefined &&
          this.barChartData[1] != undefined
        ) {
          this.valueChanged(true);
          this.isChecked = true;
        }
      });
  }

  valueChanged(val: boolean) {
    // You can give any function name

    this.valueChange.emit(val);
  }
}
