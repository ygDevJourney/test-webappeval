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
  selector: "app-trello-iframely",
  templateUrl: "./trello-iframely.component.html",
  styleUrls: ["./trello-iframely.component.scss"],
})
export class TrelloIframelyComponent implements OnInit {
  @Input() trelloWidgetObject: any;
  @Input() trelloSettingModal: any;
  @Input() activeLayout: any;
  @Input() category: string;

  iframily_autorefresh_time_option = [...Iframily_autorefresh_time_option];
  settingDisplayflag: boolean = true;
  baseurl: string = null;
  error: string = null;
  private widgetSettings: any;
  private widgetLayoutDetails: any;
  trelloFormGroup: FormGroup;

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
    private commonFunction: CommonFunction,
    private storage: LocalStorageService,
    private _iframily: IframilyService,
    private formBuilder: FormBuilder,
    private loadingSpinner: Ng4LoadingSpinnerService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.trelloWidgetObject != undefined) {
      if (changes.trelloWidgetObject.currentValue != undefined) {
        this._dataService.getWidgetSettingsLayout().subscribe((data) => {
          this.widgetLayoutDetails = data;
          this.widgetSettings = data.widgetSetting;
          this.widgetBgSetting =
            changes.trelloWidgetObject.currentValue.widgetBackgroundSettingModel;
        });
        if (changes.trelloWidgetObject.currentValue.data != undefined) {
          this.baseurl =
            changes.trelloWidgetObject.currentValue.data.iframeDetail.baseurl;
          this.createTrelloForm(
            changes.trelloWidgetObject.currentValue.data.iframeDetail
          );
        }
      }
    }
  }

  ngOnInit() {
    this.createTrelloForm(this.iframilyData);
  }

  createTrelloForm(iframilyData) {
    if (iframilyData != undefined && iframilyData != null) {
      this.trelloFormGroup = this.formBuilder.group({
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
    let payload = this.trelloFormGroup.value;
    let widgetId = {
      id: this.trelloWidgetObject.widgetSettingId,
    };
    payload["widgetSetting"] = widgetId;

    this.loadingSpinner.show();
    this._iframily.updateIframilyWidgetSettings(payload).subscribe(
      (response: any) => {
        this.loadingSpinner.hide();
        this.widgetSettings.forEach((widgetPageData) => {
          widgetPageData.widgets.forEach((element) => {
            if (
              element.widgetSettingId ===
              this.trelloWidgetObject.widgetSettingId
            ) {
              element.data = response.object;
              this.baseurl = response.object.baseurl;
              this.trelloWidgetObject = element;
            }
          });
        });
        this.trelloSettingModal.hide();
      },
      (err: any) => {
        this.loadingSpinner.hide();
        this.trelloSettingModal.hide();
        this.toastr.error(err.error.message, "Error");
      }
    );
  }

  onbgsettingOptions(event) {
    this.newBgSetting = event;
    this.onAddBackgroundSetting();
  }

  onAddBackgroundSetting() {
    const trelloBgPayload = {
      userMirrorId: this.activeMirrorDetails.id,
      mastercategory: [this.trelloWidgetObject.widgetMasterCategory],
      widgetBackgroundSettingModel: this.newBgSetting,
    };
    this.commonFunction.updateWidgetSettings(
      this.newBgSetting,
      trelloBgPayload
    );
    this.trelloSettingModal.hide();
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
    this.trelloSettingModal.hide();
  }
}
