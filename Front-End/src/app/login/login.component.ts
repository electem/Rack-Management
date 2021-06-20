import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Client } from '../client';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  showError = false;
  showSuccess = false;
  userObject:any;
  isUserRegister = false;
  isForgotPassword = false;
  isLogin = true;

  constructor(
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder,
  ) {
    this.isLogin = true;
    this.isUserRegister = false;
    this.isForgotPassword = false;
   }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.isLogin = true;
    this.isUserRegister = false;
    this.isForgotPassword = false;
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onFormSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
            return;
    }
    this.userService.login(this.loginForm.value)
    .subscribe(
      response => {
        if(response !== null){
          console.log(response);
          this.showSuccess=true;
          Client.clientFK = response.clientFk;
          sessionStorage.setItem('userObj', JSON.stringify(response));
          if (!!response) {
            this.submitted = true;
            this.router.navigate(['/template'])
            .then(() => {
              window.location.reload();
            });
          } 
        }
        else {
          this.showError = true;
        }
      },
      error => {
        console.log(error);
      });
  }

  forgotpassword(): void {
    this.router.navigate(['/forgotpassword'])
  }  
  
}
