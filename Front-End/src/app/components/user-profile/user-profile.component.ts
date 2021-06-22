import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Profile } from '../../models/userProfile.model';
import { UploadFilesService } from '../../services/upload-files.service';
import { UserProfileService } from '../../services/user-profile.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AlertService } from '../_alert/alert.service';

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
  fileInfos?: Observable<any>;
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
  options = {
    autoClose: true,
    keepAfterRouteChange: false
};
  constructor(private userProfile:UserProfileService,private route: ActivatedRoute,
    private uploadService: UploadFilesService,private router: Router,
    private alertService:AlertService) { }

  ngOnInit(): void {
    
      this.UserObj = JSON.parse(sessionStorage.getItem('userObj'));
      this.user_fk = this.UserObj.clientFk; 
      this.fetchProfileObject(this.route.snapshot.params.id);
  }

  updateProfile(): any {
    this.userProfile.updateProfile(this.profile.id,this.profile)
      .subscribe(
        response => {
          this.profile=response;
          this.alertService.success(response.message,this.options);
          this.fetchProfileObject(this.user_fk);
        },
        error => {
          console.log(error);
        });
  }

  fetchProfileObject(id:any): any {
    this.userProfile.fetchProfileById(id)
      .subscribe(
        response => {
          this.profile=response;
        },
        error => {
          console.log(error);
        });
  }

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

  

}
