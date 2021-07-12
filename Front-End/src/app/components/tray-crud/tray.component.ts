import { FileTray } from 'src/app/models/trayFile.model';
import { ActivatedRoute } from '@angular/router';
import { Component, NgZone, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { fromEvent, merge, Observable, Subscription } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import {
    KtdDragEnd, KtdDragStart, KtdGridComponent, KtdGridLayout, KtdGridLayoutItem, KtdResizeEnd, KtdResizeStart, ktdTrackById
} from '@katoid/angular-grid-layout';
import { ktdArrayRemoveItem } from './tray.utils';
import { FormGroup, FormControl, Validators, FormBuilder }
    from '@angular/forms';
import { RackService } from '../../services/rack.service';
import { AlertService } from '../_alert/alert.service';
import { UploadFilesService } from 'src/app/services/upload-files.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';



@Component({
    selector: 'ktd-playground',
    templateUrl: './tray.component.html',
    styleUrls: ['./tray.component.scss']
})
export class TrayComponent implements OnInit, OnDestroy {

    trayObject:any;
    UserObj: any = {};
    image:any;
    trayId:any;
    options = {
        autoClose: true,
        keepAfterRouteChange: false
    };
    selectedFiles?: FileList;
    currentFile?: File;
    progress = 0;
    message = '';
    fileInfos?: Observable<any>;

    file: FileTray = {
        filename: '',
        filepath:'http://localhost:8080/files/',
        tray_fk:0,
        user_fk:0,
      };

    constructor( private route: ActivatedRoute, private ngZone: NgZone,private rackService:RackService,
        private alertService:AlertService,private uploadService: UploadFilesService,) {
        // this.ngZone.onUnstable.subscribe(() => console.log('UnStable'));
    }
    @ViewChild(KtdGridComponent, {static: true}) grid: KtdGridComponent;
    trackById = ktdTrackById;

    cols = 12;
    rowHeight = 50;
    compactType: 'vertical' | 'horizontal' | null ;
    trayList: KtdGridLayout = [];

    trayDataList = [];
    trayDataListFetched=[];
    fileList=[];


    transitions: { name: string, value: string }[] = [
        {name: 'ease', value: 'transform 500ms ease, width 500ms ease, height 500ms ease'},
        {name: 'ease-out', value: 'transform 500ms ease-out, width 500ms ease-out, height 500ms ease-out'},
        {name: 'linear', value: 'transform 500ms linear, width 500ms linear, height 500ms linear'},
        {
            name: 'overflowing',
            value: 'transform 500ms cubic-bezier(.28,.49,.79,1.35), width 500ms cubic-bezier(.28,.49,.79,1.35), height 500ms cubic-bezier(.28,.49,.79,1.35)'
        },
        {name: 'fast', value: 'transform 200ms ease, width 200ms linear, height 200ms linear'},
        {name: 'slow-motion', value: 'transform 1000ms linear, width 1000ms linear, height 1000ms linear'},
        {name: 'transform-only', value: 'transform 500ms ease'},
    ];
    currentTransition: string = this.transitions[0].value;

    dragStartThreshold = 0;
    disableDrag = false;
    disableResize = false;
    disableRemove = false;
    autoResize = true;
    isDragging = false;
    isResizing = false;
    resizeSubscription: Subscription;
    currentlyBeingEditedTray = null;
    traySelected = false;
    fileId=undefined;


    currentlyTraySearchable = false;


    form = new FormGroup({
        'trayname': new FormControl('', Validators.required),
    });

    isColorOpen = false;

    openFileUpload: false;

    ngOnInit() {
        this.UserObj = JSON.parse(sessionStorage.getItem('userObj'));
        this.file.user_fk = this.UserObj.clientFk; 
        this.getTrayProp(this.route.snapshot.params.id);
        this.getTrayDataById(this.route.snapshot.params.id);
        this.resizeSubscription = merge(
            fromEvent(window, 'resize'),
            fromEvent(window, 'orientationchange')
        ).pipe(
            debounceTime(50),
            filter(() => this.autoResize)
        ).subscribe(() => {
            this.grid.resize();
        });
    }

    ngOnDestroy() {
        this.resizeSubscription.unsubscribe();
    }

    onDragStarted(event: KtdDragStart) {
        this.isDragging = true;
    }

    onResizeStarted(event: KtdResizeStart) {
        this.isResizing = true;
    }

    onDragEnded(event: KtdDragEnd) {
        this.isDragging = false;
        console.log('onDragEnded', event);
    }

    onResizeEnded(event: KtdResizeEnd) {
        this.isResizing = false;
    }

    onLayoutUpdated(layout: KtdGridLayout) {
        console.log('on layout updated', layout);
        this.trayList = layout;
    }

    onCompactTypeChange(change: MatSelectChange) {
        console.log('onCompactTypeChange', change);
        this.compactType = change.value;
    }

    onTransitionChange(change: MatSelectChange) {
        console.log('onTransitionChange', change);
        this.currentTransition = change.value;
    }

    onDisableDragChange(checked: boolean) {
        this.disableDrag = checked;
    }

    onDisableResizeChange(checked: boolean) {
        this.disableResize = checked;
    }

    onDisableRemoveChange(checked: boolean) {
        this.disableRemove = checked;
    }

    onAutoResizeChange(checked: boolean) {
        this.autoResize = checked;
    }

    onColsChange(event: Event) {
        this.cols = parseInt((event.target as HTMLInputElement).value, 10);
    }

    onRowHeightChange(event: Event) {
        this.rowHeight = parseInt((event.target as HTMLInputElement).value, 10);
    }

    onDragStartThresholdChange(event: Event) {
        this.dragStartThreshold = parseInt((event.target as HTMLInputElement).value, 10);
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
                  this.file.filepath = this.file.filepath+this.currentFile.name;
                  this.currentlyBeingEditedTray.img=this.file.filepath;
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

    /** Adds a grid item to the layout */
    copyTray() {
        const maxId = this.trayList.reduce((acc, cur) => Math.max(acc, parseInt(cur.id, 10)), -1);
        const nextId = maxId + 1;
        const newLayoutItem: KtdGridLayoutItem = {
            id: nextId.toString(),
            x: 0,
            y: 0,
            w: 2,
            h: 2
        };

        // Important: Don't mutate the array, create new instance. This way notifies the Grid component that the layout has changed.
        this.trayList = [
            newLayoutItem,
            ...this.trayList
        ];

        
        this.rackService.fetchTrayById(this.currentlyBeingEditedTray.id)
            .subscribe(
                response => {
                    this.trayObject = response;
                    this.trayObject.id = null;
                    this.trayObject.name = this.form.controls.trayname.value;
                    this.rackService.createTray(this.trayObject)
                        .subscribe(
                            response => {
                                console.log(response);
                                this.alertService.success(response.message, this.options);
                                this.getTrayDataById(this.route.snapshot.params.id);
                            },
                            error => {
                                console.log(error);
                            });
                },
                error => {
                    console.log(error);
                });
    }

    /**
     * Fired when a mousedown happens on the remove grid item button.
     * Stops the event from propagating an causing the drag to start.
     * We don't want to drag when mousedown is fired on remove icon button.
     */
    stopEventPropagation(event: Event) {
        event.preventDefault();
        event.stopPropagation();
    }

    /** Removes the item from the layout */
    removeTray() {
        this.rackService.deleteTrayById(this.currentlyBeingEditedTray.id)
      .subscribe(
        response => {
          this.trayObject=response;
          this.alertService.success(response.message,this.options);
          console.log(response);
          this.getTrayDataById(this.route.snapshot.params.id);
        },
        error => {
          console.log(error);
        });
        // TODO: based on the ID execute database call and then in the success response execute the code below.
        this.trayList = ktdArrayRemoveItem(this.trayList, (item) => item.id === this.currentlyBeingEditedTray.id);
    }
    editTray(id: string) {
        this.traySelected = true;
        const index = this.trayList.findIndex((item) => item.id === id);
        if (index > -1) {
            this.currentlyBeingEditedTray = this.trayDataListFetched[index];
            this.form.setValue({trayname: this.currentlyBeingEditedTray.name});
            this.currentlyTraySearchable = this.currentlyBeingEditedTray.searchable;
            this.currentlyBeingEditedTray.cssClass = 'traySelected';
        }
    }

    updateSearchValue() {
        this.currentlyBeingEditedTray.searchable = !this.currentlyBeingEditedTray.searchable;
        this.currentlyTraySearchable = this.currentlyBeingEditedTray.searchable;
    }

    saveTray() {
        // console.log(this.form);
         this.currentlyBeingEditedTray.name = this.form.controls.trayname.value;
        console.log(this.currentlyBeingEditedTray);
        if(this.currentlyBeingEditedTray.img==undefined){
            this.file.filepath ="";
            this.currentlyBeingEditedTray.img=this.file.filepath;
        }
        
        this.rackService.updateTray(this.currentlyBeingEditedTray.id,this.currentlyBeingEditedTray)
      .subscribe(
        response => {
          this.trayObject=response;
          this.alertService.success(response.message,this.options);
          console.log(response);
          this.getTrayDataById(this.route.snapshot.params.id);

        },
        error => {
          console.log(error);
        });
    }

    changeColorComplete(event) {
        this.currentlyBeingEditedTray.color = event.color.hex;
    }

    getTrayProp(rack_fk: string): void {
        this.rackService.getTrayPropById(rack_fk)
            .subscribe(
                data => {
                    this.trayList = data;
                },
                error => {
                    console.log(error);
      });
    }

    fetchTrayList(trayList): void {
        this.rackService.getTrayPropById(trayList)
            .subscribe(
                data => {
                    this.trayList = data;
                    console.log(this.trayList);
                },
                error => {
                    console.log(error);
      });
    }

    saveTrayLayout(trayList:any): void {
        this.rackService.saveTrayLayout(trayList)
            .subscribe(
                response => {
                    this.alertService.success(response.message,this.options);
                    this.getTrayDataById(this.route.snapshot.params.id);
                },
                error => {
                    console.log(error);
      });
    }

    getTrayDataById(rack_fk: string): void {
        this.rackService.getTrayDataById(rack_fk)
            .subscribe(
                data => {
                    this.trayDataList[0] = data[0];
                    this.trayDataListFetched = this.trayDataList[0];
                },
                error => {
                    console.log(error);
      });
    }

}
