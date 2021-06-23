import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { MatTableDataSource } from '@angular/material/table';
import swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-staff-crud',
  templateUrl: './staff-crud.component.html',
  styleUrls: ['./staff-crud.component.css']
})
export class StaffCrudComponent implements OnInit {
  UserObj: any = {};
  clientFk: '';
  displayedColumns: string[] = ['name', 'email','actions'];
  dataSource = new MatTableDataSource<any>();
  constructor(private userService: UserService, private router: Router,) { }
  roleId : ''
  RoleObj: any = {};
  RoleName= ''
  ngOnInit(): void {
    this.RoleObj = JSON.parse(sessionStorage.getItem('roleObj'));
    this.RoleName =  this.RoleObj[0].name;
    this.getStaffByRole();
    this.UserObj = JSON.parse(sessionStorage.getItem('userObj'));
    this.clientFk = this.UserObj.clientFk;
  }

  getClientStaffList(): void {
    this.userService.getClientStaffList(this.clientFk,this.roleId)
      .subscribe(
        data => {
          this.dataSource.data = data;
        },
        error => {
          console.log(error);
        });
  }
  
  getStaffByRole(): void {
    this.userService.getStaffRole()
        .subscribe(
            data => {
                this.roleId = data[0].id;
                this.getClientStaffList();
            },
            error => {
                console.log(error);
  });
}

  deleteStaff(id) {
    swal({
      title: 'Are you sure?',
      text: 'Do you want to remove this ?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00B96F',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove!'
    }).then((result) => {
      if (result.value) {
        this.deleteStaffById(id);
      }
    });
  }

  deleteStaffById(id): void {
    this.userService.delete(id)
      .subscribe(
        response => {
          console.log(response);
          this.userService.getClientStaffList(this.UserObj.clientFk, this.roleId );
          this.router.navigate(['/staff'])
          .then(() => {
            window.location.reload();
          });
        },
        error => {
          console.log(error);
        });
  }
}
