import { ViewportScroller } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { interval } from 'rxjs';
import { first, map, mergeMap } from 'rxjs/operators';
import { ScheduleService } from 'src/app/service/schedule.service';
import * as moment from 'moment';
@Component({
  selector: 'app-view-schedule-profile',
  templateUrl: './view-schedule-profile.component.html',
  styleUrls: ['./view-schedule-profile.component.css']
})
export class ViewScheduleProfileComponent implements OnInit,  OnDestroy {
  panelOpenState = false;
  panelOpenState1 = false;
  panelOpenState2 = false;
  panelOpenState3 = false;
  panelOpenState4 = false;
  panelOpenState5 = false;
  panelOpenState6 = false;
  panelOpenState7 = false;
  panelOpenState8 = false;
//table

displayedColumns1: string[] = ['No', 'Main Motor Items'];
displayedColumns2: string[] = ['No', 'Traction Motor Items'];
displayedColumns3: string[] = ['No', 'Loco Body Items'];
displayedColumns4: string[] = ['No', 'Other Motor Items'];
displayedColumns5: string[] = ['No', 'Electric CU Items'];
displayedColumns6: string[] = ['No', 'E-Mechanic Items'];
displayedColumns7: string[] = ['No', 'E-Switch Items'];
displayedColumns8: string[] = ['No', 'Other Electric Items'];
displayedColumns9: string[] = ['repNo',  'progressDate', 'checkArray', 'progressValue', 'extraNote'];

//display information
  id: any;
  scheduleNo: any;
  mReportNumber: any;
  scheduleDate: any;
  completedDate: any;
  locoCatId: any;
  locoNumber: any;
  locoMileage: any;
  locoStatus: any;
  managerNic: any;
  managerName: any;
  managerEmail:any;
  supervisorNic: any;
  supervisorName: any;
  supervisorEmail: any;
  dataSource1: any[] = [];
  dataSource2: any[] = [];
  dataSource3: any[]=[];
  dataSource4: any[]=[];
  dataSource5: any[]=[];
  dataSource6: any[]=[];
  dataSource7: any[]=[];
  dataSource8: any[]=[];
  dataSource9: any[]=[];
  specialNote: any;
  scheduleStatus: any;
  scheduleProgress: any;
  schReason: any;
  isTimer: boolean = true;
  scheduleObj:any[] =[];
  completedBanner: boolean= false;
  lapseBanner: boolean= false;

  pageYoffset = 0;
  @HostListener('window:scroll', ['$event']) onScroll(event){
    this.pageYoffset = window.pageYOffset;
  }

    public dateNow = new Date();

    milliSecondsInASecond = 1000;
    hoursInADay = 24;
    minutesInAnHour = 60;
    SecondsInAMinute  = 60;

    public timeDifference;
    public secondsToDday;
    public minutesToDday;
    public hoursToDday;
    public daysToDday;
 private subscription: Subscription;

  constructor(private route: ActivatedRoute, private router: Router, private scheduleService: ScheduleService, private scroll: ViewportScroller) { }

  ngOnInit(): void {
    this.id = (this.route.snapshot.paramMap.get('id'));
    console.log(this.id);
    this.scheduleService.sendOneSchedule(this.id).pipe(
      map(res=>{
        const _schedule = res[0];
        this.scheduleObj = res[0]
        this.scheduleNo = res[0].scheduleNo;
          this.mReportNumber = res[0].mReportNumber;
          this.scheduleDate = res[0].scheduleDate;
          this.completedDate =    moment.utc(res[0].completedDate).format("MMMM DD YYYY hh:mm:ss");

          this.locoCatId = res[0].locoCatId;
          this.locoNumber = res[0].locoNumber;
          this.locoMileage = res[0].locoMileage;
          this.locoStatus = res[0].locoStatus;
          this.managerNic = res[0].managerNic;
          this.managerName = res[0].managerName;
          this.managerEmail = res[0].managerEmail;
          this.supervisorNic= res[0].supervisorNic;
          this.supervisorEmail =  res[0].supervisorEmail;
          this.supervisorName =  res[0].supervisorName;
          this.dataSource1= res[0].mainMotorName;
          this.dataSource2 = res[0].trackMotorName;
          this.dataSource3 = res[0].locoBodyName;
          this.dataSource4 = res[0].otherMotors;
          this.dataSource5 = res[0].electricCUnitName;
          this.dataSource6 = res[0].eMechanicalName;
          this.dataSource7 = res[0].eSwitchName;
          this.dataSource8 = res[0].otherElectric;
          this.specialNote= res[0].specialNote;
          this.scheduleStatus = res[0].scheduleStatus;
          this.scheduleProgress = res[0].scheduleProgress;
          this.schReason = res[0].schReason;


        return _schedule;
      }),
      mergeMap(
        sch=> this.scheduleService.getRelevantProgress(sch.scheduleNo))

    ).subscribe(
      final=>{

        this.dataSource9 = final;
        console.log(this.dataSource9)
      }
    )
    this.loadSchedule();
    this.subscription = interval(1000).subscribe(x => { this.getTimeDifference(); });

  }

  scrollToTop(){
  this.scroll.scrollToPosition([0,0]);
  }

  private getTimeDifference () {

        let d = this.completedDate
        console.log(new Date(d).getTime())

        this.timeDifference = new Date(d).getTime() - new  Date().getTime();
        if(this.scheduleStatus===7 || this.scheduleStatus===8){
          this.completedBanner = true;
          this.isTimer = false;
          return
        }else{
           if(this.timeDifference<0){
            this.isTimer = false;
            this.lapseBanner = true;
          return;
        }else if(this.timeDifference === 2){
          this.scheduleLapseEmail(this.scheduleObj)
        }else{
          this.allocateTimeUnits(this.timeDifference);
        }
        }




    }

  private allocateTimeUnits (timeDifference) {
        this.secondsToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute);
        this.minutesToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute);
        this.hoursToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay);
        this.daysToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute * this.hoursInADay));
  }



  statusBinder(scheduleStatus){
    if (scheduleStatus === 0){
      return 'not_started';
    }else if (scheduleStatus === 1){
      return 'Flags';
    }else if (scheduleStatus === 2){
      return 'pending_actions';
    }else if (scheduleStatus === 3){
      return 'hourglass_top';
    } else if (scheduleStatus === 4){
      return 'construction';
    } else if (scheduleStatus === 5){
      return 'build_circle';
    }
    else if (scheduleStatus === 6){
      return 'check_circle_outline';
    }
    else if (scheduleStatus === 7){
      return 'sports_score';
    }
     else if (scheduleStatus === 8){
      return 'assignment';
    }

  }

  loadSchedule(){
    this.scheduleService.sendOneSchedule(this.id).subscribe(
      res=>{
        this.scheduleObj = res;
        console.log(this.scheduleObj)
      }
    )
  }

  scheduleLapseEmail(obj){
    this.scheduleService.scheduleLapseEmail(obj).subscribe(
      result=>{
      if (result){
        //this.onSucess('Sent');
        return
        console.log(result);
      }else {
        console.log('failed')

      }
      }
    )
  }
   ngOnDestroy() {
      this.subscription.unsubscribe();
   }
}
