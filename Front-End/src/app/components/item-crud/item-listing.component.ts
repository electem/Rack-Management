import {SelectionModel} from '@angular/cdk/collections';
import {Component, Input} from '@angular/core';
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
    name:any;
    id:any;
    trayId:any;

    @Input()
    trayListId:string;
    
    @Input()
    rackId:string;


    constructor(private http: HttpClient,private formService:FormService,
      private route: ActivatedRoute,
      private router: Router, ) {}

    ngOnInit(): void {
      this.UserObj = JSON.parse(sessionStorage.getItem('userObj'));
      this.clientFk = this.UserObj.clientFk;
      //console.log(this.trayListId);
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
          this.templateList=this.dataSource.data;
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
      this.formList = true;
      this.name = formName;
      this.id = formId;
      this.trayId=this.trayListId;
      this.rackId=this.rackId;
    }
}
