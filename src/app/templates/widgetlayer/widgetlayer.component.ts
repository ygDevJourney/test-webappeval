import {
  Component,
  Input,
  OnChanges,
  OnInit,
  Output,
  EventEmitter,
} from "@angular/core";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { LocalStorageService } from "angular-web-storage";
import { DataService } from "src/app/service/data.service";
import { CustomSortPipe } from "src/app/pipes/custom-sort.pipe";
import { WidgetService } from "src/app/service/widget.service";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { ToastrService } from "ngx-toastr";
import { CommonFunction } from "src/app/service/common-function.service";
import { LayoutRequest } from "src/app/util/static-data";

@Component({
  selector: "app-widgetlayer",
  templateUrl: "./widgetlayer.component.html",
  styleUrls: ["./widgetlayer.component.scss"],
})
export class WidgetlayerComponent implements OnInit, OnChanges {
  @Input() activeLayout: any;
  @Input() category: any;
  @Output() closeStackEmiter = new EventEmitter<any>();

  widgetList = [];
  widgetLayoutDetails: any;
  widgetSettings: any;
  widgetUpdateTimeOut = null;
  changeLayoutStatus = null;

  constructor(
    private _dataService: DataService,
    private storage: LocalStorageService,
    private _customSortPipe: CustomSortPipe,
    private _widgetSetting: WidgetService,
    private toastr: ToastrService,
    private loadingSpinner: Ng4LoadingSpinnerService,
    private commonFunction: CommonFunction,
    private layoutRequest: LayoutRequest
  ) {}

  ngOnInit() {}

  ngOnChanges(change: any) {
    this._dataService
      .getWidgetSettingsLayout()
      .subscribe((widgetLayoutDetails) => {
        this.widgetSettings = widgetLayoutDetails.widgetSetting;
      });

    if (change.activeLayout != undefined) {
      this.activeLayout = change.activeLayout.currentValue;
    }

    if (
      change.category.currentValue != undefined &&
      change.category.currentValue == "stack"
    ) {
      this.widgetList = [];
      this.widgetSettings[this.activeLayout].widgets.forEach((element) => {
        if (element.status == "on") {
          if (
            this.activeLayout == 0 ||
            (this.activeLayout != 0 && element.pinned == false)
          ) {
            this.widgetList.push(element);
          }
        }
      });

      this.widgetList = this._customSortPipe.transform(
        this.widgetList,
        "desc",
        "widgetSettingId"
      );
    }
  }

  dragStart($event) {}

  drop(event: CdkDragDrop<Object[]>) {
    moveItemInArray(this.widgetList, event.previousIndex, event.currentIndex);
    for (let index = 0; index < this.widgetList.length; index++) {
      this.widgetList[index].zindex = index + 1;
    }
    this.widgetList = this._customSortPipe.transform(
      this.widgetList,
      "asc",
      "zindex"
    );

    if (this.widgetUpdateTimeOut) {
      clearTimeout(this.widgetUpdateTimeOut);
    }

    this.changeLayoutStatus = "saving...";
    this.widgetUpdateTimeOut = setTimeout(() => {
      this.widgetUpdateTimeOut = null;
      this.updateAndBroadcast();
    }, 2000);
  }

  updateAndBroadcast() {
    try {
      if (this.widgetUpdateTimeOut) {
        clearTimeout(this.widgetUpdateTimeOut);
      }
      let userMirror = this.storage.get("activeMirrorDetails");

      let payload = {
        widgets: this.commonFunction.createWidgetSettingObject(
          this.widgetList,
          this.layoutRequest.payload.deviceHeight,
          this.layoutRequest.payload.deviceWidth
        ),
        userMirror: {
          userRole: userMirror.userRole,
          mirror: {
            id: userMirror.mirror.id,
          },
          id: userMirror.id,
        },
      };

      this._widgetSetting.updateIndexOfwidget(payload).subscribe(
        (res: any) => {
          this.changeLayoutStatus = "Saved to Display";
          let result = res.object;
          setTimeout(() => {
            this.changeLayoutStatus = null;
          }, 1000);
        },
        (err: any) => {
          this.changeLayoutStatus = null;
          this.toastr.error(err.error.message);
          this.loadingSpinner.hide();
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  ClickedOut($event) {
    this.closeStackEmiter.emit($event);
  }
}
