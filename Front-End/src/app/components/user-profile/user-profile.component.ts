import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Profile } from '../../models/userProfile.model';
import { UploadFilesService } from '../../services/upload-files.service';
import { UserProfileService } from '../../services/user-profile.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AlertService } from '../_alert/alert.service';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  UserObj: any = {};
  user_fk:any;
  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  profileForm:FormGroup;
  fileId=undefined;
  fileInfos?: Observable<any>;
  submitted = false;
  isExist=false;
  profile: Profile = {
    id:0,
    userName: '',
    email: '',
    address: '',
    city: '',
    image: '',
    phone:'',
    user_fk:0
  };

  file: any = {
    filename: '',
    filepath:'',
    user_fk:0
  };
  options = {
    autoClose: true,
    keepAfterRouteChange: false
};
  constructor(private userProfile:UserProfileService,private route: ActivatedRoute,
    private uploadService: UploadFilesService,private router: Router,
    private userService:UserService,
    private alertService:AlertService,
    private formBuilder:FormBuilder) { 
      this.profileForm = this.formBuilder.group({
        userName : ['', Validators.required],
        email:  ['', Validators.required],
        address:  ['', Validators.required],
        city:  ['', Validators.required],
        phone: ['', Validators.required],
    });
    }

  ngOnInit(): void {
    
      this.UserObj = JSON.parse(sessionStorage.getItem('userObj'));
      this.user_fk = this.UserObj.clientFk; 
      this.fetchProfileObject(this.route.snapshot.params.id);
  }

  get f() { return this.profileForm.controls; }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
    this.upload();
  }

  upload(): void {
    this.progress = 0;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;

        this.uploadService.upload(this.currentFile).subscribe(
          (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
              this.fileInfos = this.uploadService.getFiles();
            }
          },
          (err: any) => {
            console.log(err);
            this.progress = 0;

            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the file!';
            }

            this.currentFile = undefined;
          });

      }

      this.selectedFiles = undefined;
    }
  }

  
  fetchProfileObject(id:any): any {
    this.userProfile.fetchProfileById(id)
      .subscribe(
        response => {
          this.profile=response;
          this.uploadService.fetchFile(this.user_fk)
          .subscribe(
            response=>{
              console.log(response);
              this.profile.image=response[0].filepath;
              this.fileId=response[0].id;
            })
        },
        error => {
          console.log(error);
        });
  }

  onSubmit(){
    this.submitted = true;
    if (this.profileForm.invalid) {
      return;
    }
    this.updateProfile();
  }

  updateProfile(): any {
    this.userService.backendValidation(this.profile.userName,this.profile.email)
    .subscribe(
      response=>{
        if(response.length>0){
          this.isExist = true;
        }
        else
      this.userProfile.updateProfile(this.profile.id,this.profile)
      .subscribe(
        response => {
          this.profile=response;
          this.alertService.success(response.message,this.options);
          this.file.filename=this.currentFile.name;
          this.file.user_fk=this.UserObj.clientFk;
          if(this.fileId!= undefined){
            this.uploadService.updateFile(this.fileId,this.file)
            .subscribe(
              response=>{
                console.log(response);
                this.profile.user_fk=response.id;
                
              })
          }
          else{
            this.uploadService.createFile(this.file)
            .subscribe(
              response=>{
                console.log(response);
              })
          }
            
        },
        error => {
          console.log(error);
        });
      });
  }


  

  

}
