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
  selector: "app-microsoft-doc-iframely",
  templateUrl: "./microsoft-doc-iframely.component.html",
  styleUrls: ["./microsoft-doc-iframely.component.scss"],
})
export class MicrosoftDocIframelyComponent implements OnInit {
  @Input() microsoftOfficeWidgetObject: any;
  @Input() microsoftOfficeDocSettingModal: any;
  @Input() activeLayout: any;
  @Input() category: string;

  iframily_autorefresh_time_option = [...Iframily_autorefresh_time_option];
  settingDisplayflag: boolean = true;
  baseurl: string = null;
  error: string = null;
  private widgetSettings: any;
  micDocFormGroup: FormGroup;

  //background widget setting
  widgetType: any;
  widgetBgSetting: any;
  newBgSetting: any;
  activeMirrorDetails: any;

  iframilyData = {
    baseurl: null,
    autoRefreshTime: 60,
    isAutoScroll: false,
    isS3Enabled: false,
    isCustomUrlEnabled: false,
    s3Data: [],
  };
  isMyFileSelected: boolean = false;
  selectedS3Files: any[] = [];
  currentSubscriptionHirarchy: number = 0;
  requestType: string = "microsoftRequestType";

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
    if (changes.microsoftOfficeWidgetObject != undefined) {
      if (changes.microsoftOfficeWidgetObject.currentValue != undefined) {
        this._dataService.getWidgetSettingsLayout().subscribe((data) => {
          this.widgetSettings = data.widgetSetting;
          this.widgetBgSetting =
            changes.microsoftOfficeWidgetObject.currentValue.widgetBackgroundSettingModel;
        });
        if (
          changes.microsoftOfficeWidgetObject.currentValue.data != undefined
        ) {
          this.baseurl =
            changes.microsoftOfficeWidgetObject.currentValue.data.iframeDetail.baseurl;
          this.createMicDocForm(
            changes.microsoftOfficeWidgetObject.currentValue.data.iframeDetail
          );
        }
      }
    }
  }

  ngOnInit() {
    this.createMicDocForm(this.iframilyData);
  }

  validateURL(event) {
    let imageUrl: string = event.target.value;
    if (event.target.value.includes("dropbox")) {
      imageUrl = imageUrl.replace("dl=0", "raw=1");
    } else if (event.target.value.includes("drive.google")) {
      imageUrl = imageUrl.replace(
        "https://drive.google.com/file/d/",
        "https://drive.google.com/uc?id="
      );
      let code = imageUrl.substring(imageUrl.indexOf("=") + 1);
      code = code.substring(0, code.indexOf("/"));
      imageUrl = "https://drive.google.com/uc?id=" + code;
    }
    this.micDocFormGroup.controls["baseurl"].setValue(imageUrl.trim());
    this.baseurl = imageUrl;
  }

  createMicDocForm(iframilyData) {
    if (iframilyData != undefined && iframilyData != null) {
      this.micDocFormGroup = this.formBuilder.group({
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
        isS3Enabled: [
          iframilyData ? iframilyData.isS3Enabled : false,
          Validators.requiredTrue,
        ],
        isCustomUrlEnabled: [
          iframilyData ? iframilyData.isCustomUrlEnabled : false,
          Validators.requiredTrue,
        ],
      });

      if (this.micDocFormGroup.controls.isS3Enabled.value) {
        if (
          iframilyData.s3Data != undefined &&
          iframilyData.s3Data.length > 3
        ) {
          this.selectedS3Files = JSON.parse(iframilyData.s3Data);
        } else {
          this.selectedS3Files = [];
        }
      }
    }
  }

  updateIframilySettings() {
    let payload = this.micDocFormGroup.value;
    let widgetId = {
      id: this.microsoftOfficeWidgetObject.widgetSettingId,
    };
    payload["widgetSetting"] = widgetId;

    if (payload.isS3Enabled == true && this.selectedS3Files.length <= 0) {
      this.error = "Please select a file";
      return;
    }

    if (
      payload.isCustomUrlEnabled == true &&
      (payload.baseurl == null || payload.baseurl.trim().length <= 5)
    ) {
      this.error = "Please enter a valid URL";
      return;
    }

    if (payload.isS3Enabled == true && this.selectedS3Files.length > 0) {
      payload["isS3Enabled"] = true;
      payload["s3Data"] = JSON.stringify(this.selectedS3Files);
    } else {
      payload["isS3Enabled"] = false;
      this.selectedS3Files = [];
      payload["s3Data"] = JSON.stringify(this.selectedS3Files);
    }

    this.loadingSpinner.show();
    this._iframily.updateIframilyWidgetSettings(payload).subscribe(
      (response: any) => {
        this.loadingSpinner.hide();
        this.widgetSettings.forEach((widgetPageData) => {
          widgetPageData.widgets.forEach((element) => {
            if (
              element.widgetSettingId ===
              this.microsoftOfficeWidgetObject.widgetSettingId
            ) {
              element.data = response.object;
              this.baseurl = response.object.baseurl;
              this.microsoftOfficeWidgetObject = element;
            }
          });
        });
        this.microsoftOfficeDocSettingModal.hide();
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
      mastercategory: [this.microsoftOfficeWidgetObject.widgetMasterCategory],
      widgetBackgroundSettingModel: this.newBgSetting,
    };
    this.commonFunction.updateWidgetSettings(
      this.newBgSetting,
      calenderBgPayload
    );
    this.microsoftOfficeDocSettingModal.hide();
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
    this.microsoftOfficeDocSettingModal.hide();
  }

  reverseSelection() {
    this.isMyFileSelected = false;
  }

  updateFlag() {
    this.error = null;
    const isSelected = this.micDocFormGroup.controls.isS3Enabled.value;
    const isCustomUrlEnabled =
      this.micDocFormGroup.controls.isCustomUrlEnabled.value;
    if (isCustomUrlEnabled == false && isSelected == true) {
      this.micDocFormGroup.controls["isS3Enabled"].setValue(!isSelected);
      this.micDocFormGroup.controls["isCustomUrlEnabled"].setValue(isSelected);
    }
  }

  updateMicrosoftS3Details($event) {
    this.isMyFileSelected = false;
    this.requestType == undefined;
    this.selectedS3Files = $event.selectedS3Files;
  }

  openMyMediaFile(action) {
    this.error = null;
    if (action == "edit") {
      this.isMyFileSelected = true;
    } else {
      const isSelected = this.micDocFormGroup.controls.isS3Enabled.value;
      if (isSelected == false) {
        this.isMyFileSelected = true;
        this.micDocFormGroup.controls["isS3Enabled"].setValue(!isSelected);
        this.micDocFormGroup.controls["isCustomUrlEnabled"].setValue(
          isSelected
        );
      } else {
        this.isMyFileSelected = false;
      }
    }
  }
}
