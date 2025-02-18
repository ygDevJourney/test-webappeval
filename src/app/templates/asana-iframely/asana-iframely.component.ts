import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LocalStorageService } from "angular-web-storage";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { ToastrService } from "ngx-toastr";
import { CommonFunction } from "src/app/service/common-function.service";
import { DataService } from "src/app/service/data.service";
import { IframilyService } from "src/app/service/iframily.service";
import { WidgetService } from "src/app/service/widget.service";
import {
  Iframily_autorefresh_time_option,
  LayoutRequest,
} from "src/app/util/static-data";

@Component({
  selector: "app-asana-iframely",
  templateUrl: "./asana-iframely.component.html",
  styleUrls: ["./asana-iframely.component.scss"],
})
export class AsanaIframelyComponent implements OnInit {
  @Input() asanaWidgetObject: any;
  @Input() asanaSettingModal: any;
  @Input() activeLayout: any;
  @Input() category: string;

  iframily_autorefresh_time_option = [...Iframily_autorefresh_time_option];
  s;
  settingDisplayflag: boolean = true;
  baseurl: string = null;
  error: string = null;
  private widgetSettings: any;
  private widgetLayoutDetails: any;
  asanaFormGroup: FormGroup;

  //background widget setting
  widgetType: any;
  widgetBgSetting: any;
  newBgSetting: any;
  activeMirrorDetails: any;

  iframilyData = {
    baseurl: null,
    autoRefreshTime: 60,
    isAutoScroll: false,
  };

  constructor(
    private toastr: ToastrService,
    private _dataService: DataService,
    private _widgetService: WidgetService,
    private commonFunction: CommonFunction,
    private layoutRequest: LayoutRequest,
    private storage: LocalStorageService,
    private _iframily: IframilyService,
    private formBuilder: FormBuilder,
    private loadingSpinner: Ng4LoadingSpinnerService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.asanaWidgetObject != undefined) {
      if (changes.asanaWidgetObject.currentValue != undefined) {
        this._dataService.getWidgetSettingsLayout().subscribe((data) => {
          this.widgetLayoutDetails = data;
          this.widgetSettings = data.widgetSetting;
          this.widgetBgSetting =
            changes.asanaWidgetObject.currentValue.widgetBackgroundSettingModel;
        });
        if (changes.asanaWidgetObject.currentValue.data != undefined) {
          this.baseurl =
            changes.asanaWidgetObject.currentValue.data.iframeDetail.baseurl;
          this.createAsanaForm(
            changes.asanaWidgetObject.currentValue.data.iframeDetail
          );
        }
      }
    }
  }

  ngOnInit() {
    this.createAsanaForm(this.iframilyData);
  }

  createAsanaForm(iframilyData) {
    if (iframilyData != undefined && iframilyData != null) {
      this.asanaFormGroup = this.formBuilder.group({
        baseurl: [
          iframilyData ? iframilyData.baseurl : null,
          Validators.requiredTrue,
        ],
        autoRefreshTime: [
          iframilyData ? iframilyData.autoRefreshTime : 60,
          Validators.requiredTrue,
        ],

        isAutoScroll: [
          iframilyData ? iframilyData.isAutoScroll : false,
          Validators.requiredTrue,
        ],
      });
    }
  }

  saveIframilySettings() {
    let payload = this.asanaFormGroup.value;
    let widgetId = {
      id: this.asanaWidgetObject.widgetSettingId,
    };
    payload["widgetSetting"] = widgetId;

    this.loadingSpinner.show();
    this._iframily.updateIframilyWidgetSettings(payload).subscribe(
      (response: any) => {
        this.loadingSpinner.hide();
        this.widgetSettings.forEach((widgetPageData) => {
          widgetPageData.widgets.forEach((element) => {
            if (
              element.widgetSettingId === this.asanaWidgetObject.widgetSettingId
            ) {
              element.data = response.object;
              this.baseurl = response.object.baseurl;
              this.asanaWidgetObject = element;
            }
          });
        });
        this.asanaSettingModal.hide();
      },
      (err: any) => {
        this.loadingSpinner.hide();
        this.toastr.error(err.error.message, "Error");
      }
    );
  }

  onbgsettingOptions(event) {
    this.newBgSetting = event;
    this.onAddBackgroundSetting();
  }

  onAddBackgroundSetting() {
    const calenderBgPayload = {
      userMirrorId: this.activeMirrorDetails.id,
      mastercategory: [this.asanaWidgetObject.widgetMasterCategory],
      widgetBackgroundSettingModel: this.newBgSetting,
    };
    this.commonFunction.updateWidgetSettings(
      this.newBgSetting,
      calenderBgPayload
    );
    this.asanaSettingModal.hide();
  }

  setBackgroundWidgetDetail() {
    this.widgetType = this.category;
    let widgetData = this.storage.get("selectedwidget");
    if (widgetData != null) {
      this.widgetBgSetting = widgetData.widgetBackgroundSettingModel;
    }
    this.activeMirrorDetails = this.storage.get("activeMirrorDetails");
  }

  dismissModel() {
    this.asanaSettingModal.hide();
  }
}
