import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/models/form.model';
import { FormService } from './../../services/app.form.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { AlertService } from '../_alert';
import { RackService } from 'src/app/services/rack.service';
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
  trayItems = { quantity: 0,trayId:0,formId:0,rackId:0};
  quantity: any = [];
  totalquantity: any = [];
  trayItemId:any;
  formId:any;

  @Input()
  name:string;

  @Input()
  id:string;

  @Input()
  isQuantity:string;

  @Input()
  trayId:string;

  @Input()
  rackId:string;

  options = {
    autoClose: true,
    keepAfterRouteChange: false
};

  displayedColumns: string[] = [];
  
  constructor(private formService: FormService,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private rackService: RackService,
    private router: Router, private http: HttpClient) { }
    dataSource = new MatTableDataSource<any>();
    
  ngOnInit(): void {
    this.UserObj = JSON.parse(sessionStorage.getItem('userObj'));
    this.clientFk = this.UserObj.clientFk;
    if(this.name == undefined || this.id == undefined || this.isQuantity == "false"){
      this.tempid = this.route.snapshot.params['id'];
      this.templateFormName=this.route.snapshot.params.name;
      this.retrieveForms();
    }
    else{
      this.templateFormName=this.name;
      console.log(this.rackId);
      this.tempid=this.id;
      this.retrieveForms();
    }
    // this.getData();
   
  
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

  addNewForm(): void {
    // this.templateFormName=this.name;
    this.tempid = this.route.snapshot.params['id'];
    this.router.navigate(['/addForm/' + this.route.snapshot.params.name + '/' + this.tempid ]);
  }

  private extractData(serverData) {
    var rowDataList: any = [];
    
    serverData.forEach(dbRecord => {
      var rowdata;
      // Prepare Row Data
      rowdata = Object.assign({ "id": dbRecord.id })
      // rowdata = Object.assign(rowdata, {"name":dbRecord.name})
      this.rackService.fetchAllItems()
        .subscribe(
          response => {
            for (let i = 0; i < response.length; i++) {
              if (response[i].formId == dbRecord.id) {
                this.quantity[i]=response[i].quantity;
                dbRecord.attributes.forEach(dbRecordCol => {
                  var colVal = dbRecordCol.value ? dbRecordCol.value : ""
                  var colLabel = dbRecordCol.label
                  rowdata = Object.assign(rowdata, { [colLabel]: colVal })
                });
                if (this.isQuantity == "true") {
                  rowdata = Object.assign(rowdata, {"quantity":this.quantity[i]})
                }
                rowdata = Object.assign(rowdata, { "actions": `<a class="bi-pencil-fill mr-2" href="http://localhost:4200/EditForm/${this.templateFormName}/${dbRecord.id}"></a>` })

                // push a record 
                rowDataList.push(rowdata);
                // Extract label and values from the Attributes
                // Extract column names
                this.displayedColumns = Object.getOwnPropertyNames(rowDataList[0])
                this.dataSource.data = rowDataList
              }
            }

          }
        )

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

  deleteFormData(id): void {
    this.formService.deleteFormData(id, this.route.snapshot.params.name)
      .subscribe(
        response => {
          this.alertService.success(response.message, this.options)
          this.router.navigate(['/template'])
        },
        error => {
          console.log(error);
        });
  }

  addItemsToTray(formId) {
    this.trayItems.quantity = this.quantity;
    this.trayItems.formId = formId;
    this.trayItems.trayId = parseInt(this.trayId);
    this.trayItems.rackId = parseInt(this.rackId);
    this.rackService.getItemById(formId)
      .subscribe(
        response => {
          if (response.length > 0) {
            this.trayItems.quantity=response[0].quantity+this.trayItems.quantity
            this.rackService.updateTrayItem(this.trayItems.formId,this.trayItems)
            .subscribe(
              response => {
                this.alertService.success("Items Updated Successfully To Tray", this.options)
              },
              error => {
                console.log(error);
              });
          }
          else{
            this.rackService.createTrayItems(this.trayItems)
            .subscribe(
              response => {
                this.alertService.success("Items Added Successfully To Tray", this.options)
              },
              error => {
                console.log(error);
              });
          }
        }

      )

  }

}
