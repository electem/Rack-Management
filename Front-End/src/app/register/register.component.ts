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
    phone: '',
    location: ''
  };

  constructor(
    private router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder,
  ) { }
  loading = false;
  submitted = false;
  registerForm: FormGroup;
  planList:any;
  ngOnInit() {
    this.getPlans();
    this.registerForm = this.formBuilder.group({
      username : ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', Validators.required],
      location: ['', Validators.required],
      plan: ['', Validators.required],
      clientFk: '',
  });
  }

  get f() { return this.registerForm.controls; }

  saveUser(): void {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
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
          this.userService.create(this.registerForm.value)
            .subscribe(
              response => {
                console.log(response);
                this.submitted = true;
                this.router.navigate(['/login']);
              },
              error => {
                console.log(error);
              });
              },
        error => {
          console.log(error);
        });
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
