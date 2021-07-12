import {SelectionModel} from '@angular/cdk/collections';
import {Component} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { FormService } from 'src/app/services/app.form.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'item-listing',
  templateUrl: 'item-listing.component.html',
})
export class ItemListingComponent {
  displayedColumns: string[] = [];
    dataSource = new MatTableDataSource<any>();
    selection = new SelectionModel<any>(true, []);
    UserObj: any = {};
    clientFk: '';
    formList=false;
    templateList:any;

    constructor(private http: HttpClient,private formService:FormService,
      private route: ActivatedRoute,
      private router: Router, ) {}

    ngOnInit(): void {
      this.UserObj = JSON.parse(sessionStorage.getItem('userObj'));
      this.clientFk = this.UserObj.clientFk;
      this.retrieveTemplates();
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
      if (this.isAllSelected()) {
        this.selection.clear();
        return;
      }

      this.selection.select(...this.dataSource.data);
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: any): string {
      if (!row) {
        return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
      }
      return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }

     retrieveTemplates(): void {
    this.formService.getAll(this.clientFk)
      .subscribe(
        data => {
         // this.Templates = data;
          this.dataSource.data = data;
          this.templateList=this.dataSource.data
          console.log(data);
        },
        error => {
          console.log(error);
        });
  }
  

    private getData(): any {
      this.http.get('/assets/testdata/itemlisting.json')
      .subscribe((data: any) => {
        this.dataSource.data = data;
      });

      //// this.dataSource.data = <any> await this.http.get('https://www.ag-grid.com/example-assets/olympic-winners.json').toPromise();
    }

    fetchFormList(formName:any,formId:any){
      this.formList=true;
      this.retrieveForms(formName,formId);
    }

    retrieveForms(formName:any,formId:any): void {    
      this.formService.getAllProductsByItemTempId(formId, formName)
        .subscribe(
          data => {
            this.extractData(data,formName)
          });
    }

    private extractData(serverData,name:any) {
      var rowDataList:any = [];
  
      serverData.forEach(dbRecord => {
  
        var rowdata; 
        //Prepare Row Data
        rowdata = Object.assign({"id":dbRecord.id})
       // rowdata = Object.assign(rowdata, {"name":dbRecord.name})

       var createInput = document.createElement("INPUT");
       createInput.setAttribute("type", "number");
        
        //Extract label and values from the Attributes
        dbRecord.attributes.forEach(dbRecordCol => {
          var colVal = dbRecordCol.value ? dbRecordCol.value : ""
          var colLabel = dbRecordCol.label
          rowdata = Object.assign(rowdata, { [colLabel]:colVal })
        });
        rowdata = Object.assign(rowdata, {"quantity": createInput})
        rowdata = Object.assign(rowdata, {"actions": `<a href="http://localhost:4200/EditForm/${name}/${dbRecord.id}"> Edit</a>`})
        //push a record 
        rowDataList.push(rowdata);
      });
  
      //Extract column names
      this.displayedColumns = Object.getOwnPropertyNames(rowDataList[0])
  
      this.dataSource.data = rowDataList
    }
  
}
