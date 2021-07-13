import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TrayComponent } from './tray.component';
import { KtdGridModule } from '@katoid/angular-grid-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColorSketchModule } from 'ngx-color/sketch';
import { UploadFilesComponent } from '../upload-files/upload-files.component';
import {ItemListingComponent} from '../item-crud/item-listing.component';
import { NgxNumberSpinnerModule } from 'ngx-number-spinner';
import { FormListComponent } from '../forms-list/forms-list.component';

@NgModule({
  declarations: [TrayComponent, UploadFilesComponent, ItemListingComponent,FormListComponent],
  exports: [TrayComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    KtdGridModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatChipsModule,
    ColorSketchModule,
    MatTableModule,
    NgxNumberSpinnerModule
  ]
})
export class TrayModule {}
