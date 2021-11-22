import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccessService } from '../../../../service/access.service';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie';
import { ScheduleService } from 'src/app/service/schedule.service';
import LocoScheduleDTO from 'src/app/dto/LocoScheduleDTO';

@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.css'],
})
export class UserHeaderComponent implements OnInit {
  @Output() public sidenavToggle = new EventEmitter();
  @Input() public resultGridList = '';
  data = '';
  dateList: LocoScheduleDTO[] = [];
  dateList1: LocoScheduleDTO[] = [];
  loading = false;

  cont: Array<any>[] = [];
  currentDate = new Date();
  name: any;
  private loginEmail: any;
  role: any;
  constructor(
    private router: Router,
    private accessService: AccessService,
    private toastr: ToastrService,
    private cookieService: CookieService,
    private route: ActivatedRoute,
    private schedulesService: ScheduleService
  ) {}

  ngOnInit(): void {
    this.display();
    this.loadDate();
    const values = JSON.parse(localStorage.getItem('currentUser'));
    this.name = values.userName;
    this.role = values.userRole;
  }
  onToogleSlidenav() {
    this.sidenavToggle.emit();
  }
  logOut() {
    if (confirm('Do want to log out? ?')) {
      this.onSucess('You are log out!');
      this.cookieService.remove('userData');
      this.refresh();
    }
  }
  refresh(): void {
    window.location.reload();
  }
  onSucess(message: string) {
    this.toastr.success(message, 'Success');
  }
  public display() {
    this.data = this.loginEmail + '';
    console.log(this.data);
  }

  async reloadComponent() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/'], { relativeTo: this.route });
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
}
