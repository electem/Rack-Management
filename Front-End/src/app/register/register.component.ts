import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { Client } from '../client';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {

  user: User = {
    username: '',
    email: '',
    password: '',
    confirmPassword:'',
    phone: '',
    location: ''
  };

  isUserRegister = true;
  isLogin = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder,
  ) { this.isUserRegister = true;
    this.isLogin = false;}
  loading = false;
  submitted = false;
  registerForm: FormGroup;
  planList:any;
  isExist=false;
  ngOnInit() {
    this.getPlans();
    this.registerForm = this.formBuilder.group({
      username : ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', Validators.required],
      location: ['', Validators.required],
      plan: ['', Validators.required],
      clientFk: '',
      roleId: 1,
  });
  this.isUserRegister = true;
  this.isLogin = false;
  }

  get f() { return this.registerForm.controls; }

  saveUser(): void {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    if(this.user.password == this.user.confirmPassword){
      const client = {
        name: this.registerForm.value.username,
        planFk: this.registerForm.value.plan
      };
      this.userService.createClient(client)
        .subscribe(
          response => {
            console.log(response);
            this.submitted = true;
            this.registerForm.value.clientFk = response.id;
            this.userService.backendValidation(client.name,this.registerForm.value.email)
            .subscribe(
              response => {
                if(response.length>0){
                  this.isExist = true;
                }
              else
            this.userService.create(this.registerForm.value)
              .subscribe(
                response => {
                  console.log(response);
                  this.submitted = true;
                  this.isUserRegister = false;
                  this.isLogin = true;
                },
                error => {
                  console.log(error);
                });
                },
          error => {
            console.log(error);
        });
      });
    }
    
  }

  getPlans(): void {
    this.userService.getPlansList()
      .subscribe(
        data => {
          this.planList = data;
        },
        error => {
          console.log(error);
        });
  }
}
