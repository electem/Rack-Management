import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '../services/user.service';
import { Staff } from '../models/staff.model';
import swal from 'sweetalert2';
@Component({
  selector: 'app-add-edit-staff',
  templateUrl: './add-edit-staff.component.html',
  styleUrls: ['./add-edit-staff.component.css']
})
export class AddStaffComponent implements OnInit {

  staff: Staff = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };
  UserObj: any = {};
  PlanObj: any = {};
  staffRoleID: '';
  clientName: '';
  noOfstaff : any = [];
  staffObj = { username: '', email: '', password:'' , confirmPassword : ''};
  noOfUsers: '';
  constructor(  private router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder,private route: ActivatedRoute) { }

    loading = false;
    submitted = false;
    staffForm: FormGroup;
  ngOnInit(): void {
    this.UserObj = JSON.parse(sessionStorage.getItem('userObj'));
    this.PlanObj = JSON.parse(sessionStorage.getItem('planObj'));
    this.getStaffRole();
    this.getClientName(this.UserObj.clientFk);
    this.getClientStaffList();
    this.staffForm = this.formBuilder.group({
      username : ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      clientFk: this.UserObj.clientFk,
      status: 'ACTIVE',
      roleId: this.staffRoleID,
  });
  this.getStaffData(this.route.snapshot.params.id);
  }

  getClientStaffList(): void {
    this.userService.getClientStaffList(this.UserObj.clientFk,this.UserObj.roleId)
      .subscribe(
        data => {
          this.noOfstaff = data;
        },
        error => {
          console.log(error);
        });
  }

  get f() { return this.staffForm.controls; }

  saveClientStaff(): void {
    this.submitted = true;
    if (this.staffForm.invalid) {
      return;
    }
     this.noOfUsers = this.PlanObj[0].noOfUsers;
    if(this.noOfstaff.length > this.noOfUsers) {
      alert("You have exceeded limit of creating staff!!");
      return;
    }
    if(this.staff.password == this.staff.confirmPassword){
    if(this.route.snapshot.params.id) {
      return this.updateClientStaff();
    }
    this.staffForm.value.roleId = this.staffRoleID;
    this.staffForm.value.username =  this.clientName + '.' + this.staffForm.value.username;
    this.userService.saveClientStaff( this.clientName,this.staffForm.value)
      .subscribe(
        response => {
          console.log(response);
          this.submitted = true;
          this.router.navigate(['/staff']);
          },
        error => {
          console.log(error);
        });
      }
  }

  updateClientStaff(): void {
    this.submitted = true;
    if (this.staffForm.invalid) {
      return;
    }
    this.staffForm.value.roleId = this.staffRoleID;
    this.userService.updateClientStaff(this.route.snapshot.params.id,this.staffForm.value)
      .subscribe(
        response => {
          console.log(response);
          this.submitted = true;
          this.router.navigate(['/staff']);
          },
        error => {
          console.log(error);
        });
  }

  getStaffRole(): void {
    this.userService.getStaffRole()
        .subscribe(
            data => {
                this.staffRoleID = data[0].id;
            },
            error => {
                console.log(error);
  });
}

    getClientName(id:any): void {
      this.userService.getClientName(id)
          .subscribe(
              data => {
                  this.clientName = data[0].name;
              },
              error => {
                  console.log(error);
    });
    }
  
    getStaffData(id: string): void {
        this.userService.get(id)
            .subscribe(
              data => {
                console.log(data);
                this.staffObj = data;
                this.staffObj.confirmPassword = data.password;
            },
                error => {
                    console.log(error);
      });
    }  
}
