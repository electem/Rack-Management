import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Profile } from '../../models/userProfile.model';
import { UserProfileService } from '../../services/user-profile.service';
import { AlertService } from '../_alert/alert.service';
import { ConfirmedValidator } from './validator';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  id:any;
  profileObject:any;
  profile: Profile = {
   password:'',
   confirmPassword:'',
   user_fk:0,
  };
  options = {
    autoClose: true,
    keepAfterRouteChange: false
};

  constructor(private router: Router,private userProfile:UserProfileService,
    private route: ActivatedRoute,private fb: FormBuilder,
    private alertService:AlertService) {
      this.form = fb.group({
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]]
      }, { 
        validator: ConfirmedValidator('password', 'confirmPassword')
      })
     }

     get f(){
      return this.form.controls;
    }

    submit(){
      this.updatePassword();
    }

  ngOnInit(): void {
    this.id=this.route.snapshot.params.id;
    this.profile.user_fk=this.id;
  }
  updatePassword(): any {
      this.userProfile.updatePassword(this.id, this.profile)
        .subscribe(
          data => {
            this.profileObject = data;
            this.alertService.success(data.message,this.options)
            this.router.navigate(['/userProfile',this.id]);
          },
          error => {
            console.log(error);
          });
    }
    fetchAllProfiles(){
      this.router.navigate(['/profileListing',this.id]);
    }
  }

