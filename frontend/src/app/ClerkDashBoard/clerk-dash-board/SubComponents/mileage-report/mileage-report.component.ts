import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import UserDTO from "../../../../dto/UserDTO";
import {AccessService} from "../../../../service/access.service";
import {first} from "rxjs/operators";
import swal from "sweetalert";
import {LocomotiveService} from "../../../../service/locomotive.service";

@Component({
  selector: 'app-mileage-report',
  templateUrl: './mileage-report.component.html',
  styleUrls: ['./mileage-report.component.css']
})
export class MileageReportComponent implements OnInit {
  managerList: UserDTO[] = [];
  locoStatus: string[] = ['In', 'Out'];
  myControl = new FormControl();
  loading =  false;
  locoList:any[]= [];
  MileageGroup: FormGroup;
  spinner = false;
  locoCount = false;
  finalMile: number;
  currentMile: number;
  mileageGap: number;
  name:any;
  id:any;
  options: string[] = ['M2', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11', 'M12'];
  constructor(private accessService: AccessService, private formBuilder: FormBuilder,
              private locomotiveService: LocomotiveService, private router: Router,private route: ActivatedRoute) {

              }

  ngOnInit(): void {
    this.MileageGroup = this.formBuilder.group({
      mReportNumber:  [''],
      mLocoCatId: ['',  [Validators.required]],
      mLocoNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      mLocoMileage: ['', [Validators.required, Validators.minLength(5)]],
      finalMileage: [''],
      mileageDate: ['', [Validators.required]],
      locoStatus: ['', Validators.required],
      managerNic: ['', [Validators.required]],
      managerName: ['', [Validators.required]],
      mileageNote: ['', [Validators.required, Validators.maxLength(1000)]],
      status: [1],
      reason: ['Draft'],
      gap: [''],
      clerkEmail: [''],
      managerEmail:['']

    });
    this.loadMangerEmail();
    this.loadLocoNum();
    this.defaultMethod();
    console.log(this.mileageGap)
    const values =  JSON.parse( localStorage.getItem('currentUser'));
    this.name = values.userEmail

    this.MileageGroup.controls['clerkEmail'].setValue(this.name);



  }

  get getFM() {
    return this.MileageGroup.controls;
  }
   onChangeSelect(value: string){
    const userNic = value ;
    console.log(this.getFM.mLocoNumber.value);
    this.locomotiveService.getOneLocoNew(this.getFM.mLocoNumber.value).pipe(first())
      .subscribe(
        res=>{
        this.MileageGroup.controls['mLocoCatId'].setValue(res[0].locoCatId);
        this.MileageGroup.controls['mLocoMileage'].setValue(res[0].locoMileage);
        this.MileageGroup.controls['locoStatus'].setValue(res[0].locoAvailability);
        this.MileageGroup.controls['finalMileage'].setValue(res[0].endMileage);

        this.finalMile = res[0].endMileage;
        this.currentMile = res[0].locoMileage;
        this.MileageGroup.controls['gap'].setValue(this.finalMile - this.currentMile);
       // this.mileageGap =
        //this.MileageGroup.controls['gap'].setValue(this.mileageGap)
        this.calculateMileageGap(this.finalMile, this.currentMile);

        }
      )
  }
   calculateMileageGap(endMile: number, currentMile: number){
     console.log(endMile, currentMile);
     this.mileageGap = endMile-currentMile;

  }


  onSubmit(){
    console.log(this.MileageGroup.value);
    this.sendMileEmail(this.MileageGroup.value)
    this.spinner = true;
     this.locomotiveService.saveMileage(this.MileageGroup.value)
       .pipe(first()).subscribe(
       res => {
         console.log(res)
         if (res.isSaved) {
           swal({
             title: 'Record Saved!',
             text: 'Please Click OK',
             icon: 'success',
           });
           setTimeout(() => {
             this.MileageGroup.reset();
             this.router.navigate(['/clerkDashBoard/viewMileages']);
             this.spinner = false
           }, 3000);

       } else {
           swal({
             title: 'Record already Exits',
             text: 'Please Click OK',
             icon: 'error',
           });
           setTimeout(() => {
            // this.refresh();
            this.spinner = false
           }, 3000);
         }
       },

       error => {
         console.log(error)
       },
       () => {
         console.log('dss')
       }
     )



  }
  refresh(): void {
    window.location.reload();
  }

  private loadMangerEmail() {
    this.loading = true;
    this.accessService.getMangers().subscribe(result => {
      this.managerList = result;
      this.loading = true;
    });
  }

  onChangeSelectMan(value: string){
    const userNic = value ;
    console.log(this.getFM.managerNic.value);
    this.accessService.getOneMan(this.getFM.managerName.value).pipe(first())
      .subscribe(
        res=>{
          this.MileageGroup.controls['managerNic'].setValue(res[0].userNic);
this.MileageGroup.controls['managerEmail'].setValue(res[0].userEmail);
          console.log(res);
        }
      )
  }

  loadLocoNum(){
    this.loading = true;
    this.locomotiveService.getLocoReport().subscribe(result => {
      if(this.locoList.length = 0){
        this.locoCount =  true;
      }
      this.locoList = result;
      this.loading = true;
    });
  }

  sendMileEmail(MileObj){
    this.locomotiveService.sendMileEmail(MileObj).subscribe(result=>{
        if (result){
        //this.onSucess('Sent');
        console.log(result);
      }else {
        console.log('failed')
      }
    })
  }

  defaultMethod(){
  //Id Gen
        var chars = "ABCDEFGHIJKLMNOPQRSTUFWXYZ1234567890";

        var string_length = 8;
        var  mReportNumber = "MI_" + "";
        //var sysId = "ST_"+"";
        for (var i = 0; i < string_length; i++) {
          var rnum = Math.floor(Math.random() * chars.length);
          mReportNumber += chars.substring(rnum, rnum + 1);
          ///sysId += chars.substring(rnum, rnum + 1);
          this.MileageGroup.controls["mReportNumber"].setValue(mReportNumber);
          //this.LocoGroup.controls["id"].setValue(sysId);
        }
  //this.staffGroup.controls['jDate'].setValue(moment().format('YYYY-MM-DD'));

  }

}
