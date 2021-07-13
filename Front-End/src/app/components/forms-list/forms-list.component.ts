import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/models/form.model';
import { FormService } from './../../services/app.form.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-forms-list',
  templateUrl: './forms-list.component.html',
  styleUrls: ['./forms-list.component.css']
})
export class FormListComponent implements OnInit {
  products?: Product[];
  
  currentTemplate?: Product;
  currentIndex = -1;
  formName = '';
  tempid = '';
  clientFk = '';
  UserObj: any = {};
  templateName: any;
  templateFormName:any;

  @Input()
  name:string;

  @Input()
  id:string;

  displayedColumns: string[] = [];

  
  constructor(private formService: FormService,
    private route: ActivatedRoute,
    private router: Router, private http: HttpClient) { }
    dataSource = new MatTableDataSource<any>();
    
  ngOnInit(): void {
    if(this.name == undefined || this.id == undefined){
      this.tempid = this.route.snapshot.params['id'];
      this.templateFormName=this.route.snapshot.params.name;
      this.retrieveForms();
    }
    //this.getData();
    this.templateFormName=this.name;
    this.tempid=this.id;
    this.retrieveForms();
    this.UserObj = JSON.parse(sessionStorage.getItem('userObj'));
    this.clientFk = this.UserObj.clientFk;
  }

  retrieveForms(): void {    
    this.formService.getAllProductsByItemTempId(this.tempid, this.templateFormName)
      .subscribe(
        data => {
          this.extractData(data)
        });
  }

  refreshList(): void {
    this.retrieveForms();
    this.currentTemplate = undefined;
    this.currentIndex = -1;
  }

  setActiveTemplate(Template: Product, index: number): void {
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

    this.formService.findByFormsName(this.formName)
      .subscribe(
        data => {
          this.products = data;
          console.log(data);
        },
        error => {
          console.log(error);
        });
  }

  deleteFormData(id): void {
    this.formService.deleteFormData(id, this.route.snapshot.params.name)
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


  removeForm(id) {
    swal({
      title: 'Are you sure?',
      text: 'Do you want to remove this form?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00B96F',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove!'
    }).then((result) => {
      if (result.value) {
        this.deleteFormData(id);
      }
    });

  }

  addNewForm(): void {
    this.router.navigate(['/addForm/' + this.route.snapshot.params.name + '/' + this.tempid ]);
  }

  private extractData(serverData) {
    var rowDataList:any = [];

    serverData.forEach(dbRecord => {

      var rowdata; 
      //Prepare Row Data
      rowdata = Object.assign({"id":dbRecord.id})
     // rowdata = Object.assign(rowdata, {"name":dbRecord.name})
      
      //Extract label and values from the Attributes
      dbRecord.attributes.forEach(dbRecordCol => {
        var colVal = dbRecordCol.value ? dbRecordCol.value : ""
        var colLabel = dbRecordCol.label
        rowdata = Object.assign(rowdata, { [colLabel]:colVal })
      });
      rowdata = Object.assign(rowdata, {"actions": `<a href="http://localhost:4200/EditForm/${this.route.snapshot.params.name}/${dbRecord.id}"> Edit</a>`})
      //push a record 
      rowDataList.push(rowdata);
    });

    console.log(rowDataList)

    //Extract column names
    this.displayedColumns = Object.getOwnPropertyNames(rowDataList[0])

    this.dataSource.data = rowDataList
  }

  private getData(): any {
    this.http.get('/assets/testdata/itemlisting.json')
    .subscribe((data: any) => {
      this.extractData(data)      
    });
  }

}
