import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { LoadTrialService } from 'src/app/service/load-trial.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-view-man-load',
  templateUrl: './view-man-load.component.html',
  styleUrls: ['./view-man-load.component.css'],
})
export class ViewManLoadComponent implements OnInit {
  searchKey: string;
  isVisible = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = [
    'Load No',
    'Load Date',
    'Loco Category',
    'Loco Number',
    'Form',
    'To',
    'Schedule No',
    'Responsible',
    'Status',
    '#',
  ];
  @ViewChild(MatSort) sort: MatSort;
  loadArray: any[] = [];
  status: any;
  ids: any[] = [];
  statuses: string[] = [
    'All',
    'M1',
    'M2',
    'M3',
    'M4',
    'M5',
    'M6',
    'M7',
    'M8',
    'M9',
    'M10',
    'M11',
  ];
  tableArray: any;

  constructor(
    private loadService: LoadTrialService,
    private toastr: ToastrService,
    private router: Router,
    public dialog: MatDialog,
    private _location: Location
  ) {}

  ngOnInit(): void {
    this.getLoadTrialAssigned();
  }

  // me

  private getLoadTrialAssigned(type = false) {
    const values = JSON.parse(localStorage.getItem('currentUser'));
    const object = {
      userNic: values.userNic,
      userRole: values.userRole,
    };
    this.loadService.getLoadTrialAssigned(object).subscribe((resp) => {
      this.loadArray = resp;
      console.log(this.loadArray);
      // this.loadArray.length = 0;
      // this.loadArray = aluthres;
      this.dataSource = new MatTableDataSource<any>(this.loadArray);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    });
  }

  backClicked() {
    this._location.back();
  }

  onChangeSelect(value) {
    let _cloneArrat = [];
    const _findValue = this.loadArray.filter((x) => x.locoCatId == value.value);
    if (_findValue.length > 0) {
      this.tableArray = _findValue;
      this.dataSource = new MatTableDataSource<any>(this.tableArray);
    } else if (value.value == 'All') {
      this.dataSource = new MatTableDataSource<any>(this.loadArray);
    } else {
      this.onWarning('No records found on filter!');
      this.dataSource = new MatTableDataSource<any>(this.loadArray);
    }
  }

  statusBinder(status) {
    if (status === 1) {
      return 'hourglass_top';
    } else if (status === 2) {
      return 'check_circle_outline';
    } else if (status === 3) {
      return 'pending_actions';
    }
  }

  onSearchClear() {
    this.searchKey = '';
    this.applyFilter();
  }
  applyFilter() {
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }
  viewLoad(id: string) {
    this.router.navigate(['/managerDashBoard/viewManLoadProf', id]);
  }

  onWarning(message: string) {
    this.toastr.warning(message, 'Warning');
  }
}
