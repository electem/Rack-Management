
import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';
import { MenuService } from './services/menu.service';
import { Menu } from './models/menu.model';
import { ItemService } from './services/item.service';
import { UserProfileService } from './services/user-profile.service';
import { Profile } from './models/userProfile.model';
import { UploadFilesService } from './services/upload-files.service';
import { UserService } from './services/user.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  itemPk: any;
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

  itemlabel: any;
  afterClickOnNotification=true;
  itemObject: any;
  dataObject: any;
  menuObject: any;
  notifications:any;
  id:any;
  planList:any;
  

  menu: Menu = {
    label: '',
    action: '',
    menu_fk: '',
    roleId: '',
    itemId: '',
  };

  file: any = {
    filename: '',
    filepath:'http://localhost:8080/files/profile/',
    user_fk:0
  };

constructor(private menuService: MenuService,
  private itemService: ItemService,
  private activatedRoute: ActivatedRoute,
  private userProfile:UserProfileService,
  private uploadService:UploadFilesService,
  private userService:UserService,
  private router: Router) { }
  UserObj: any = {};
  ngOnInit(): void {
    this.getPlans();
    this.UserObj = JSON.parse(sessionStorage.getItem('userObj'));
    this.fetchFile(this.UserObj.id);
     this.fetchNotificationByUserFk(this.UserObj.id)
   
    this.itemPk = this.activatedRoute.snapshot.params['id'];
    // this.fetchItemById(this.itemPk);
    this.fetchAllmenus();
  }

   fetchItemById(itemId: any) {
    this.itemService.getItemById(itemId)
      .subscribe(
        data => {
          this.itemObject = data;
          this.createMenu(this.menu);
        },
        error => {
          console.log(error);
        });
      }

  createMenu(menu: any): void {
    const data = {
      label: this.itemObject.name,
      action: 'menu/' + this.itemObject.name + '/' + this.itemObject.id,
      menu_fk: 1,
      roleId: 1,
      itemId: this.itemObject.id,
    };

    this.menuService.createMenu(data)
      .subscribe(
        data => {
          this.dataObject = data;
          this.fetchAllmenus();
        },
        error => {
          console.log(error);
        });
  }

  fetchAllRacks() {
    this.id=this.UserObj.clientFk;
    this.router.navigate(['/rackList',this.id]);
      }


  fetchAllmenus() {
    this.menuService.fetchAllMenus(this.UserObj.clientFk, this.UserObj.roleId)
      .subscribe(
        data => {
          this.menuObject = data;
        },
        error => {
          console.log(error);
        });
      }

      redirect(action: any) {
        this.router.navigate(['/action']);
      }

      logout() {
        window.sessionStorage.clear();
        this.router.navigate(['/'])
      .then(() => {
        window.location.reload();
      });
      }

    refreshPage(action) {
      this.router.navigate(['/' + action])
      .then(() => {
        window.location.reload();
      });
    }

    fetchUserProfileFK() {
      this.id=this.UserObj.id;
      this.userProfile.fetchProfileByUserFK(this.id)
      .subscribe(
        response => {
          this.profile=response;
          this.fetchFile(this.id);
          this.router.navigate(['/userProfile',this.profile[0].id]);
        },
        error => {
          console.log(error);
        });
      
    }

    fetchFile(user_fk){
      this.uploadService.fetchFile(user_fk)
      .subscribe(
        response=>{
          console.log(response);
          this.profile.image=this.file.filepath+response[0].filename;
        })
    }

    changePasswordByUserFk() {
      this.id=this.UserObj.clientFk;
          this.router.navigate(['/changePassword',this.id]);
    }

    getPlans(): void {
      var planProperties = [];
      this.userService.getPlansList()
        .subscribe(
          data => {
            this.planList = data;
          },
          error => {
            console.log(error);
          });
    }

    fetchNotificationByUserFk(user_fk){
      this.userService.fetchNotificationByUserFk(user_fk)
      .subscribe(
        response=>
        {
          this.notifications=response;
          
      })
    }

    fetchAllNotifications(){
      this.afterClickOnNotification=false;
    }


}
