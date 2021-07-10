import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import LocoDTO from "../../../../../dto/LocoDTO";
import {MatSort} from "@angular/material/sort";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {ScheduleService} from "../../../../../service/schedule.service";
import LocoScheduleDTO from "../../../../../dto/LocoScheduleDTO";
import {FormControl} from "@angular/forms";
import {MatTableExporterModule} from "mat-table-exporter";
import {MatDialog} from "@angular/material/dialog";
import {SendProgressComponent} from "./send-progress/send-progress.component";


@Component({
  selector: 'app-view-schedules',
  templateUrl: './view-schedules.component.html',
  styleUrls: ['./view-schedules.component.css']
})
export class ViewSchedulesComponent implements OnInit {
  searchKey: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['Schedule No', 'Report No', 'Loco Category', 'Loco Number', 'Manager inCharge', 'Request Date', 'To be Complete', 'Progress', 'status', '#'];
  scheduleList: any[] = [];
  scheduleStatus: any;

  constructor(private scheduleService: ScheduleService ,private router: Router,  private toastr: ToastrService,public dialog: MatDialog) {

    //this.loadCount();
    
  }

  ngOnInit(): void {
    this.loadAllSchedule();
  }
  private loadAllSchedule(){
    this.scheduleService.getAllSchedules().subscribe(resp =>{
      this.scheduleList = resp;
      this.dataSource =  new MatTableDataSource<any>(this.scheduleList);
      setTimeout(() => {
        this.dataSource.paginator =  this.paginator;
        this.dataSource.sort = this.sort;
      })
    })
  }
  statusBinder(scheduleStatus){
    if (scheduleStatus === 1){
      return 'pending_actions'
        ;
    }else if (scheduleStatus === 2){
      return 'hourglass_top';
    }else if (scheduleStatus === 4){
      return 'dangerous'
    }
  }

  

/*
  loadCount(){
    this.schedulesService.getDraftCount().subscribe(resp => {
      if(resp >= 0){
        console.log(resp);
      }
    });
  }

 */



  openProgress(id: string) {
    
    this.dialog.open(SendProgressComponent, {
      data: {id: id}
      
      
    });
  }

  onSearchClear() {
    this.searchKey = '';
    this.applyFilter();
  }
  onWarning(message: string){
    this.toastr.warning(message, 'Warning');
  }
  onSucess(message: string){
    this.toastr.success(message, 'Success');
  }

  applyFilter() {
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }

  viewSchedule(id: string){
    console.log(id);
    this.router.navigate(['/userDashboard/viewSchedule', id]);
  }

/*
  view(tempSchedule: LocoScheduleDTO) {
    this.selectedSchedule = tempSchedule;
    const btn = document.getElementById('btn-pop-up') as HTMLElement;
    this.bgColor = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
    btn.click();


  }
  setStateTwo(){
    this.isVisible = false;
    this.isVisibleSecond = !this.isVisibleSecond;

  }
  changeUpdate = '';
  changeStatus = '';
  changeScheduleCom = '';
  changeCatId= '';
  changeLocoNumber = '';
  changeuserNIC = '';
  changeEmail = '';
  changeName = '';
  changeTrack = '';
  changeBody = '';
  changeELCU = '';
  changeEMech = '';
  changeMach = '';
  changeReamark = '';


  updateSchedule(tempSchedule: LocoScheduleDTO) {
    this.selectedSchedule = tempSchedule;
    this.changeUpdate =  tempSchedule.scheduleUpdate;
    this.changeCatId = tempSchedule.locoCatId;
    this.changeLocoNumber = tempSchedule.locoNumber + '';
    this.changeuserNIC = tempSchedule.userNic;
    this.changeName = tempSchedule.userName;
    this.changeEmail = tempSchedule.userEmail;
    this.changeStatus = tempSchedule.scheduleStatus;
    this.changeScheduleCom = tempSchedule.scheduleCom;
    this.changeTrack = tempSchedule.scheduleTrackMotors + '';
    this.changeBody = tempSchedule.scheduleLocoBody + '';
    this.changeELCU = tempSchedule.scheduleElCuUnit + '';
    this.changeEMech = tempSchedule.scheduleEMechanical + '';
    this.changeMach = tempSchedule.scheduleMach + '';
    this.changeReamark =  tempSchedule.scheduleRemark;
    const btn = document.getElementById('btn-pop-up-two') as HTMLElement;
    btn.click();
  }

  updateMySchedule() {

    const dto = new LocoScheduleDTO(
      this.selectedSchedule.scheduleNo,
      this.changeUpdate,
      this.changeCatId,
      Number(this.changeLocoNumber),
      this.changeuserNIC,
      this.changeName,
      this.changeEmail,
      this.changeStatus,
      this.changeScheduleCom,
      Array(this.changeTrack),
      Array(this.changeBody),
      Array(this.changeELCU),
      Array(this.changeEMech),
      Array(this.changeMach),
      this.changeReamark,
    );

    this.schedulesService.updateSchedule(dto).subscribe(result => {
      if (result.message === 'updated'){
        console.log(this.changeStatus);
        this.onSucess('Updated');
        this.loadAll();

        const btn = document.getElementById('btn-pop-up-two') as HTMLElement;
        btn.click();

      }else {
        this.onWarning('Try Again');

        const btn = document.getElementById('btn-pop-up-two') as HTMLElement;
        btn.click();

      }
    });

  }

 */
}
