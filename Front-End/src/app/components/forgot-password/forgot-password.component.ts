import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AlertService } from '../_alert/alert.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm: FormGroup = new FormGroup({});
  email:string='';
  user: any = {
    email: this.email
   };
  userObject:any;
  isForgotPassword = true;
  isUserRegister = false;

  constructor(private userService:UserService, private router: Router,
    private alertService:AlertService,private formBuilder: FormBuilder) {
      this.forgotPasswordForm = formBuilder.group({
        email: ['', [Validators.required]]
      }) 
      this.isForgotPassword = true;
      this.isUserRegister = false;
     }

     get f(){
      return this.forgotPasswordForm.controls;
    }
    

  ngOnInit(): void {
    this.isForgotPassword = true;
    this.isUserRegister = false;
  }

  submit(){
    this.reset();
  }

  reset(): void {
    this.userService.resetPassword(this.user)
    .subscribe(
      response => {
        this.userObject=response;
        this.router.navigate(['/login'])
        console.log(response);
      },
      error => {
        console.log(error);
      });
    
  }

}
