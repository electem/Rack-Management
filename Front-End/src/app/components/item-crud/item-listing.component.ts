import {SelectionModel} from '@angular/cdk/collections';
import {Component} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'item-listing',
  templateUrl: 'item-listing.component.html',
})
export class ItemListingComponent {
    displayedColumns: string[] = ['select', 'age', 'athlete', 'year', 'country'];
    dataSource = new MatTableDataSource<any>();
    selection = new SelectionModel<any>(true, []);

    constructor(private http: HttpClient) {}

    ngOnInit(): void {
      this.getData();
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

    private getData(): any {
      this.http.get('/assets/testdata/itemlisting.json')
      .subscribe((data: any) => {
        this.dataSource.data = data;
      });

      //// this.dataSource.data = <any> await this.http.get('https://www.ag-grid.com/example-assets/olympic-winners.json').toPromise();
    }
}
