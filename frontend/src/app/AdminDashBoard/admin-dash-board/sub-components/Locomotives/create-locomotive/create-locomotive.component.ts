import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CustomerService } from '../../../../../service/customer.service';
import CustomerDTO from '../../../../../dto/CustomerDTO';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { LocomotiveService } from '../../../../../service/locomotive.service';
import LocoDTO from '../../../../../dto/LocoDTO';
import { ToastrService } from 'ngx-toastr';
import { AccessService } from '../../../../../service/access.service';
import UserDTO from '../../../../../dto/UserDTO';
import { ImageService } from '../../../../../service/image.service';
import swal from 'sweetalert';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { error } from '@angular/compiler/src/util';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-create-locomotive',
  templateUrl: './create-locomotive.component.html',
  styleUrls: ['./create-locomotive.component.css'],
})
export class CreateLocomotiveComponent implements OnInit {
  LocoGroup: FormGroup;
  myControl = new FormControl();
  options: string[] = [
    'M2',
    'M4',
    'M5',
    'M6',
    'M7',
    'M8',
    'M9',
    'M10',
    'M11',
    'M12',
  ];
  loading = false;
  spinner = false;
  public selectedIndex: number = 0;
  userList: UserDTO[] = [];

  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }
    return value;
  }
  searchKey: string;
  searchKey1: string;
  searchKey2: string;
  filesToUpload: Array<File> = [];
  urls = new Array<string>();
  statuses: string[] = ['In', 'Out'];
  condition: string[] = ['Working', 'Not Working'];
  tMotors: string[] = ['Working', 'Not Working'];
  mainMotors: string[] = ['Working', 'Not Working'];
  vBreaks: string[] = ['Working', 'Not Working'];
  dBreaks: string[] = ['Working', 'Not Working'];
  isVisble = true;
  val = '';
  val2: string[] = [];
  private val1: string[] = [];
  text: string = '';
  preview = '';
  imagePreview: string;
  constructor(
    private cd: ChangeDetectorRef,
    private router: Router,
    private formBuilder: FormBuilder,
    private imageService: ImageService,
    private accessService: AccessService,
    private _location: Location,
    public translate: TranslateService,
    private locomotiveService: LocomotiveService,
    private toastr: ToastrService
  ) {
    translate.addLangs(['en', 'nl']);
    translate.setDefaultLang('en');
  }

  createForm(): void {
    this.LocoGroup = this.formBuilder.group({
      locoCatId: ['', [Validators.required]],
      locoNumber: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.maxLength(3),
          Validators.minLength(3),
        ],
      ],
      locoPower: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      locoMileage: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      locoDate: ['', [Validators.required]],
      userNic: ['', [Validators.required]],
      supervisorName: ['', [Validators.required]],
      supervisorEmail: ['', [Validators.required]],
      locoAvailability: ['', [Validators.required]],
      locoMotors: new FormArray([]),
      locoBreaks: new FormArray([]),
      locoFluids: new FormArray([]),
      locoNote: [''],
      image: [''],
      locoStatus: [0],
      statusReason: ['In Operating'],
      lastLoadDate: [''],
      endMileage: [''],
      endMileDate: [''],
      mtrType: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern('^[a-zA-Z]+$'),
        ],
      ],
      brkType: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern('^[a-zA-Z]+$'),
        ],
      ],
      fldType: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern('^[a-zA-Z]+$'),
        ],
      ],
    });
  }

  ngOnInit(): void {
    this.LocoGroup = this.formBuilder.group({
      locoCatId: ['', [Validators.required]],
      locoNumber: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.maxLength(3),
          Validators.minLength(3),
        ],
      ],
      locoPower: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      locoMileage: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      locoDate: ['', [Validators.required]],
      userNic: ['', [Validators.required]],
      supervisorName: ['', [Validators.required]],
      supervisorEmail: ['', [Validators.required]],
      locoAvailability: ['', [Validators.required]],
      locoMotors: new FormArray([]),
      locoBreaks: new FormArray([]),
      locoFluids: new FormArray([]),
      locoNote: [''],
      image: [''],
      locoStatus: [0],
      statusReason: ['In Operating'],
      lastLoadDate: [''],
      endMileage: [''],
      endMileDate: [''],
      mtrType: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern('^[a-zA-Z]+$'),
        ],
      ],
      brkType: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern('^[a-zA-Z]+$'),
        ],
      ],
      fldType: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern('^[a-zA-Z]+$'),
        ],
      ],
    });
    this.loadAllIds();
  }
  get getFm() {
    return this.LocoGroup.controls;
  }
  get mtrArray() {
    return this.getFm.locoMotors as FormArray;
  }
  get brkArray() {
    return this.getFm.locoBreaks as FormArray;
  }
  get fluidArray() {
    return this.getFm.locoFluids as FormArray;
  }
  switchLang(lang: string) {
    this.translate.use(lang);
  }
  backClicked() {
    this._location.back();
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
        // this.imagePreview = reader.result;
        this.imagePreview = reader.result as string;
        console.log(file.name);
        this.LocoGroup.patchValue({
          image: reader.result,
        });
      };
      this.cd.markForCheck();
    }
  }

  onSubmit() {
    console.log(this.LocoGroup.controls.image.value);
    this.spinner = true;
    let obj = {
      locoCatId: this.LocoGroup.controls.locoCatId.value,
      locoNumber: this.LocoGroup.controls.locoNumber.value,
      locoPower: this.LocoGroup.controls.locoPower.value,
      locoMileage: this.LocoGroup.controls.locoMileage.value,
      locoDate: this.LocoGroup.controls.locoDate.value,
      userNic: this.LocoGroup.controls.userNic.value,
      supervisorName: this.LocoGroup.controls.supervisorName.value,
      supervisorEmail: this.LocoGroup.controls.supervisorEmail.value,
      locoAvailability: this.LocoGroup.controls.locoAvailability.value,
      locoMotors: this.LocoGroup.controls.locoMotors.value,
      locoBreaks: this.LocoGroup.controls.locoBreaks.value,
      locoFluids: this.LocoGroup.controls.locoFluids.value,
      image: this.LocoGroup.controls.image.value,
      locoNote: this.LocoGroup.controls.locoNote.value,
      locoStatus: this.LocoGroup.controls.locoStatus.value,
      statusReason: this.LocoGroup.controls.statusReason.value,
      lastLoadDate: this.LocoGroup.controls.lastLoadDate.value,
      endMileage: this.LocoGroup.controls.endMileage.value,
      endMileDate: this.LocoGroup.controls.endMileDate.value,
    };
    if (obj == null && obj == undefined) {
      console.log(error);
    } else {
      this.locomotiveService
        .saveLocomotive(obj)
        .pipe(first())
        .subscribe(
          (res) => {
            console.log(res);
            if (res.isSaved) {
              this.sendLocomotiveAssigned(obj);
              swal({
                title: 'Record Saved!',
                icon: 'success',
              });
              setTimeout(() => {
                this.LocoGroup.reset();
                this.router.navigate(['/adminDashboard/viewLocomotives']);
                this.spinner = false;
              }, 3000);
            } else {
              swal({
                title: 'Record already Exits',
                icon: 'error',
              });
              setTimeout(() => {
                this.spinner = false;
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

  public sendLocomotiveAssigned(data): void {
    console.log(data);
    this.locomotiveService
      .sendLocomotiveAssigned(data)
      .pipe(first())
      .subscribe(
        (res) => {},
        (error) => {}
      );
  }

  onClickMotor() {
    if (this.getFm.mtrType.value != null) {
      const _findDupli = this.getFm.locoMotors.value.find(
        (f) => f.Name == this.getFm.mtrType.value
      );
      if (!_findDupli) {
        this.mtrArray.push(
          this.formBuilder.group({
            Name: [this.getFm.mtrType.value, Validators.required],
            working: [''],
            //notWorking: [false],
          })
        );
      } else {
        swal({
          title: 'Value already Exits',
          icon: 'error',
        });
      }
    } else {
      swal({
        title: 'Values can not be empty',
        icon: 'error',
      });
    }
  }

  onClickremoveField(index = null, value) {
    switch (value) {
      case 'main':
        while (this.mtrArray.length !== 0) {
          this.mtrArray.removeAt(0);
        }
        break;
      case 'sub':
        this.mtrArray.removeAt(index);
        break;
    }
  }

  onClickremoveBreakField(index = null, value) {
    switch (value) {
      case 'main':
        while (this.brkArray.length !== 0) {
          this.brkArray.removeAt(0);
        }
        break;
      case 'sub':
        this.brkArray.removeAt(index);
        break;
    }
  }

  onClickremoveFluidField(index = null, value) {
    switch (value) {
      case 'main':
        while (this.fluidArray.length !== 0) {
          this.fluidArray.removeAt(0);
        }
        break;
      case 'sub':
        this.fluidArray.removeAt(index);
        break;
    }
  }

  onClickBreaks() {
    if (this.getFm.brkType.value != null) {
      const _findDupli = this.getFm.locoBreaks.value.find(
        (f) => f.bName == this.getFm.brkType.value
      );

      if (!_findDupli) {
        this.brkArray.push(
          this.formBuilder.group({
            bName: [this.getFm.brkType.value],
            working: [''],
          })
        );
      } else {
        swal({
          title: 'Value already Exits',
          icon: 'error',
        });
      }
    } else {
      swal({
        title: 'Values can not be empty',
        icon: 'error',
      });
    }
  }

  onClickFluids() {
    if (this.getFm.fldType.value != null) {
      const _findDupli = this.getFm.locoFluids.value.find(
        (f) => f.fName == this.getFm.fldType.value
      );

      if (!_findDupli) {
        this.fluidArray.push(
          this.formBuilder.group({
            fName: [this.getFm.fldType.value],
            fluids: [''],
          })
        );
      } else {
        swal({
          title: 'Value already Exits',
          icon: 'error',
        });
      }
    } else {
      swal({
        title: 'Values can not be empty',
        icon: 'error',
      });
    }
  }

  private loadAllIds() {
    this.loading = true;
    this.accessService.getAllUsers().subscribe((result) => {
      this.userList = result;
      this.loading = true;
    });
  }

  public nextStep() {
    this.selectedIndex += 1;
  }

  public previousStep() {
    this.selectedIndex -= 1;
  }
  refresh(): void {
    window.location.reload();
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
    console.log(this.filesToUpload);
  }

  onSearchClear() {
    this.searchKey = null;
    //this.applyFilter();
  }
  onSearchClear1() {
    this.searchKey1 = null;
    //this.applyFilter();
  }
  onSearchClear2() {
    this.searchKey2 = null;
    //this.applyFilter();
  }

  onChangeSelect(value: string) {
    const userNic = value;
    console.log(this.getFm.supervisorName.value);
    this.accessService
      .getOneSup(this.getFm.supervisorName.value)
      .pipe(first())
      .subscribe((res) => {
        this.LocoGroup.controls['supervisorEmail'].setValue(res[0].userEmail);
        this.LocoGroup.controls['userNic'].setValue(res[0].userNic);
        console.log(res);
      });
  }

  onkeyUp(event: any) {
    this.val = event.target.value;
  }

  getTrasnlate(data) {
    const _element = document.getElementsByClassName('select-option-trans');

    return data == 'en' ? 'English' : 'සිංහල';
  }
}
