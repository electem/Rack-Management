import { ActivatedRoute } from '@angular/router';
import { Component, NgZone, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { fromEvent, merge, Subscription } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import {
    KtdDragEnd, KtdDragStart, KtdGridComponent, KtdGridLayout, KtdGridLayoutItem, KtdResizeEnd, KtdResizeStart, ktdTrackById
} from '@katoid/angular-grid-layout';
import { ktdArrayRemoveItem } from './tray.utils';
import { FormGroup, FormControl, Validators, FormBuilder }
    from '@angular/forms';
import { RackService } from '../../services/rack.service';
import { AlertService } from '../_alert/alert.service';


@Component({
    selector: 'ktd-playground',
    templateUrl: './tray.component.html',
    styleUrls: ['./tray.component.scss']
})
export class TrayComponent implements OnInit, OnDestroy {

    trayObject:any;
    trayId:any;

    constructor( private route: ActivatedRoute, private ngZone: NgZone,private rackService:RackService,
        private alertService:AlertService) {
        // this.ngZone.onUnstable.subscribe(() => console.log('UnStable'));
    }
    @ViewChild(KtdGridComponent, {static: true}) grid: KtdGridComponent;
    trackById = ktdTrackById;

    cols = 12;
    rowHeight = 50;
    compactType: 'vertical' | 'horizontal' | null ;
    trayList: KtdGridLayout = [];

    trayDataList = [];


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


    currentlyTraySearchable = false;


    form = new FormGroup({
        'quantity': new FormControl('', Validators.required),
        'trayname': new FormControl('', Validators.required),
    });

    isColorOpen = false;

    openFileUpload: false;

    ngOnInit() {
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
                    this.trayObject.name=this.form.controls.trayname.value;
                    this.rackService.createTray(this.trayObject)
                        .subscribe(
                            response => {
                                console.log(response);
                                this.alertService.success(response.message);
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
          this.alertService.success(response.message);
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
            this.currentlyBeingEditedTray = this.trayDataList[index];
            this.form.setValue({trayname: this.currentlyBeingEditedTray.name, quantity: this.currentlyBeingEditedTray.quantity});
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
        this.currentlyBeingEditedTray.quantity = this.form.controls.quantity.value;
        console.log(this.currentlyBeingEditedTray);
        this.rackService.updateTray(this.currentlyBeingEditedTray.id,this.currentlyBeingEditedTray)
      .subscribe(
        response => {
          this.trayObject=response;
          this.alertService.success(response.message);
          console.log(response);
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

    fetchTrayList(trayList:any): void {
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
                data => {
                    this.trayList = data;
                    console.log(this.trayList);
                },
                error => {
                    console.log(error);
      });
    }

    getTrayDataById(rack_fk: string): void {
        this.rackService.getTrayDataById(rack_fk)
            .subscribe(
                data => {
                    this.trayDataList = data;
                },
                error => {
                    console.log(error);
      });
    }

}
