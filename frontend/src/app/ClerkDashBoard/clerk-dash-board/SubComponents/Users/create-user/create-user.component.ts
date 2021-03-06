import { UserTaskService } from './../../../../../service/user-task.service';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import UserDTO from '../../../../../dto/UserDTO';
import { MatSort } from '@angular/material/sort';
import { AccessService } from '../../../../../service/access.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import CustomerDTO from '../../../../../dto/CustomerDTO';
import { CustomerService } from '../../../../../service/customer.service';
import swal from 'sweetalert';
import { first } from 'rxjs/operators';
import { Location } from '@angular/common';
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}
@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
export class CreateUserComponent implements OnInit {
  options: FormGroup;
  myControl = new FormControl();
  loading = false;
  customerList: CustomerDTO[] = [];
  userEmail: any;
  userName: any;
  userWorks: any;
  userNic: any;
  userMobile: any;
  userRole: any;
  userPassword: any;
  spinner = false;
  roles = [
    { id: 1, value: 'Supervisor' },
    { id: 2, value: 'Service Manager' },
    { id: 3, value: 'Clerk' },
    { id: 4, value: 'Chief Engineer' },
    { id: 5, value: 'Locomotive Driver' },
  ];
  places = [
    { id: 1, value: 'Electric Locomotive Shed' },
    { id: 2, value: 'Running Shed' },
    { id: 3, value: 'Chief Engineering Ratmalana' },
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<UserDTO>;
  @ViewChild(MatSort) sort: MatSort;
  hide = true;
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  matcher = new MyErrorStateMatcher();

  email = new FormControl('', [Validators.required, Validators.email]);

  UserGroup: FormGroup;
  userRoles: string[] = [
    'Supervisor',
    'Service Manager',
    'Clerk',
    'Chief Engineer',
    'Locomotive Driver',
  ];
  taskId: string;
  maxDate: any = new Date();
  constructor(
    private cd: ChangeDetectorRef,
    private _location: Location,
    private accessService: AccessService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private customerService: CustomerService,
    private userTaskService: UserTaskService
  ) {}
  filesToUpload: Array<File> = [];
  urls = new Array<string>();
  isVisble = true;

  ngOnInit(): void {
    this.createForm();
    this.loadAllCustomers();
    this.TaskIdGenerate();
  }

  createForm(): void {
    this.UserGroup = this.formBuilder.group({
      userEmail: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ],
      ],
      userName: [''],
      userGender: [''],
      appointmentDate: [''],
      address: [''],
      userWorks: [''],
      userNic: ['', [Validators.required, Validators.minLength(10)]],
      userMobile: [
        '',
        [
          Validators.required,
          Validators.pattern('^((\\+94-?)|0)?[0-9]{10}$'),
          Validators.minLength(10),
        ],
      ],
      userRole: [''],
      userPassword: ['', [Validators.required, Validators.minLength(5)]],
      image: [''],
    });
  }

  get userNics() {
    return this.UserGroup.get('userNic');
  }

  get UserPassword() {
    return this.UserGroup.get('userPassword');
  }
  private loadAllCustomers() {
    this.loading = true;
    this.customerService.getAllCustomers().subscribe((result) => {
      this.customerList = result;
      this.loading = true;
    });
  }

  backClicked() {
    this._location.back();
  }

  changeFiles(event) {
    this.isVisble = !this.isVisble;
    this.filesToUpload = event.target.files as Array<File>;
    this.urls = [];
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          if (
            file.type === 'image/jpeg' ||
            file.type === 'image/jpg' ||
            file.type === 'image/png'
          ) {
            if (Number(e.total) > 2e6) {
              alert(
                'Please make sure that you entered image size is less than 2MB'
              );
              this.filesToUpload = [];
              return;
            } else {
              this.urls.push(e.target.result);
            }
          } else {
            alert('Supported formats: .JPEG .JPG .PNG');
            this.filesToUpload = [];
            return;
          }
        };
        reader.readAsDataURL(file);
      }
    }
  }
  onError(message: string) {
    this.toastr.error(message, 'Warning');
  }
  onSucess(message: string) {
    this.toastr.success(message, 'Success');
  }

  refresh(): void {
    window.location.reload();
  }

  onSubmit() {
    this.spinner = true;
    let obj = {
      userEmail: this.UserGroup.controls.userEmail.value,
      userName: this.UserGroup.controls.userName.value,
      userGender: this.UserGroup.controls.userGender.value,
      userNic: this.UserGroup.controls.userNic.value,
      userMobile: this.UserGroup.controls.userMobile.value,
      address: this.UserGroup.controls.address.value,
      userRole: this.UserGroup.controls.userRole.value,
      appointmentDate: this.UserGroup.controls.appointmentDate.value,
      userWorks: this.UserGroup.controls.userWorks.value,
      userPassword: this.UserGroup.controls.userPassword.value,
      image: this.UserGroup.controls.image.value,
    };

    console.log(obj);

    if (obj == null && obj == undefined) {
      //console.log(error)
    } else {
      this.accessService
        .register(obj)
        .pipe(first())
        .subscribe(
          (res) => {
            this.userNic = this.UserGroup.controls['userNic'].value;

            if (res.isSaved) {
              this.addTask();
              swal({
                title: 'New User Added!',
                icon: 'success',
              });
              setTimeout(() => {
                this.UserGroup.reset();
                this.router.navigate(['/clerkDashBoard/viewUsers']);
              }, 3000);
            } else {
              swal({
                title: 'Record already Exits',

                icon: 'error',
              });
              setTimeout(() => {
                // this.refresh();
                //this.spinner = false
              }, 3000);
            }
          },

          (error) => {
            console.log(error);
          },
          () => {
            console.log('dss');
          }
        );
    }
  }

  uploadFile(event) {
    const fileEvnet = event.target.files[0];

    const uploadData = new FormData();

    // uploadData.append('file', fileItem);

    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];

    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);

      reader.onload = () => {
        console.log(reader.result);
        this.UserGroup.patchValue({
          image: reader.result,
        });
      };

      this.cd.markForCheck();
    }
  }

  addTask(): void {
    const values = JSON.parse(localStorage.getItem('currentUser'));
    const object = {
      userNic: values.userNic,
      userRole: values.userRole,
      taskId: this.taskId,
      recordId: this.userNic,
      taskType: 'Add User',
      taskPriority: 'Low',
      taskDate: new Date(),
      taskStatus: 5,
    };

    if (object != null) {
      this.userTaskService
        .saveTask(object)
        .pipe(first())
        .subscribe(
          (res) => {
            console.log(res);
            if (res.isSaved) {
            } else {
            }
          },
          (error) => {
            console.log(error);
          }
        );
    }
  }

  TaskIdGenerate() {
    //Id Gen
    var chars = 'ABCDEFGHIJKLMNOPQRSTUFWXYZ1234567890';

    var string_length = 8;
    var taskId = 'T_' + '';
    //var sysId = "ST_"+"";
    for (var i = 0; i < string_length; i++) {
      var rnum = Math.floor(Math.random() * chars.length);
      taskId += chars.substring(rnum, rnum + 1);
      ///sysId += chars.substring(rnum, rnum + 1);
      this.taskId = taskId;
      //this.LocoGroup.controls["id"].setValue(sysId);
    }
    //this.staffGroup.controls['jDate'].setValue(moment().format('YYYY-MM-DD'));
  }
}
