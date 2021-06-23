import { Component, OnInit } from '@angular/core';
import { Template } from 'src/app/models/template.model';
import { FormService } from 'src/app/services/app.form.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import swal from 'sweetalert2';
@Component({
  selector: 'app-Templates-list',
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.css']
})
export class TemplateListComponent implements OnInit {
  Templates?: Template[];
  currentTemplate?: Template;
  currentIndex = -1;
  name = '';
  UserObj: any = {};
  clientFk: '';
  displayedColumns: string[] = ['id', 'name','actions'];
  dataSource = new MatTableDataSource<any>();
  constructor(private formService: FormService,
    private route: ActivatedRoute,
    private router: Router) { }
  RoleObj: any = {};
  RoleName= ''

  ngOnInit(): void {
    this.RoleObj = JSON.parse(sessionStorage.getItem('roleObj'));
    this.RoleName =  this.RoleObj[0].name;
    this.UserObj = JSON.parse(sessionStorage.getItem('userObj'));
    this.clientFk = this.UserObj.clientFk;
    this.retrieveTemplates();
  }

  retrieveTemplates(): void {
    this.formService.getAll(this.clientFk)
      .subscribe(
        data => {
         // this.Templates = data;
          this.dataSource.data = data;
          console.log(data);
        },
        error => {
          console.log(error);
        });
  }

  refreshList(): void {
    this.retrieveTemplates();
    this.currentTemplate = undefined;
    this.currentIndex = -1;
  }

  setActiveTemplate(Template: Template, index: number): void {
    this.currentTemplate = Template;
    this.currentIndex = index;
  }

  removeAllTemplates(): void {
    this.formService.deleteAll()
      .subscribe(
        response => {
          console.log(response);
          this.refreshList();
        },
        error => {
          console.log(error);
        });
  }

  searchTitle(): void {
    this.currentTemplate = undefined;
    this.currentIndex = -1;

    this.formService.findByTitle(this.name)
      .subscribe(
        data => {
          this.Templates = data;
          console.log(data);
        },
        error => {
          console.log(error);
        });
  }

  deleteTemplate(id): void {
    this.formService.delete(id)
      .subscribe(
        response => {
          console.log(response);
          this.formService.getAll(this.clientFk);
          this.router.navigate(['/template']);
        },
        error => {
          console.log(error);
        });
  }

  removeTemplate(id) {
    swal({
      title: 'Are you sure?',
      text: 'Do you want to remove this template?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00B96F',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove!'
    }).then((result) => {
      if (result.value) {
        this.deleteTemplate(id);
      }
    });

  }

}
