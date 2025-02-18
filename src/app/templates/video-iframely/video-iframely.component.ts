import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LocalStorageService } from "angular-web-storage";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { ToastrService } from "ngx-toastr";
import { CommonFunction } from "src/app/service/common-function.service";
import { DataService } from "src/app/service/data.service";
import { IframilyService } from "src/app/service/iframily.service";
import { Iframily_autorefresh_time_option } from "src/app/util/static-data";

@Component({
  selector: "app-video-iframely",
  templateUrl: "./video-iframely.component.html",
  styleUrls: ["./video-iframely.component.scss"],
})
export class VideoIframelyComponent implements OnInit, OnChanges {
  @Input() videoWidgetObject: any;
  @Input() videoSettingModal: any;
  @Input() activeLayout: any;
  @Input() category: string;

  settingDisplayflag: boolean = true;
  baseurl: string = null;
  error: string = null;
  private widgetSettings: any;
  activeMirrorDetails: any;
  iframily_autorefresh_time_option = [...Iframily_autorefresh_time_option];
  vidoFormGroup: FormGroup;
  autoRefreshTime = 60;

  //background widget setting
  widgetType: any;
  widgetBgSetting: any;
  newBgSetting: any;
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
  isS3Enabled = false;
  requestType: string = "videoRequestType";

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
    if (changes.videoWidgetObject != undefined) {
      if (changes.videoWidgetObject.currentValue != undefined) {
        this._dataService.getWidgetSettingsLayout().subscribe((data) => {
          this.widgetSettings = data.widgetSetting;
          this.widgetBgSetting =
            changes.videoWidgetObject.currentValue.widgetBackgroundSettingModel;
        });
        if (changes.videoWidgetObject.currentValue.data != undefined) {
          this.baseurl =
            changes.videoWidgetObject.currentValue.data.iframeDetail.baseurl;
          this.createVideoForm(
            changes.videoWidgetObject.currentValue.data.iframeDetail
          );
        }
      }
    }
  }

  ngOnInit() {
    this.createVideoForm(this.iframilyData);
  }

  createVideoForm(iframilyData) {
    if (
      iframilyData == undefined ||
      iframilyData.isS3Enabled == undefined ||
      iframilyData.isS3Enabled == false
    ) {
      this.selectedS3Files = [];
    }

    if (iframilyData != undefined && iframilyData != null) {
      this.vidoFormGroup = this.formBuilder.group({
        baseurl: [
          iframilyData ? iframilyData.baseurl : null,
          Validators.requiredTrue,
        ],
        autoRefreshTime: [
          iframilyData ? iframilyData.autoRefreshTime : 60,
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

        isAutoScroll: [
          iframilyData ? iframilyData.isAutoScroll : false,
          Validators.requiredTrue,
        ],
      });

      if (this.vidoFormGroup.controls.isS3Enabled.value) {
        if (
          iframilyData.s3Data != undefined &&
          iframilyData.s3Data.length > 3
        ) {
          this.selectedS3Files = JSON.parse(iframilyData.s3Data);
        } else {
          this.selectedS3Files = [];
        }
        this.isS3Enabled = true;
      }

      if (this.vidoFormGroup.controls.isS3Enabled.value == false) {
        this.vidoFormGroup.controls.isCustomUrlEnabled.setValue(true);
      }
    }
  }

  saveIframilySettings() {
    let payload = this.vidoFormGroup.value;
    let widgetId = {
      id: this.videoWidgetObject.widgetSettingId,
    };
    payload["widgetSetting"] = widgetId;

    if (payload.isS3Enabled == true && this.selectedS3Files.length <= 0) {
      this.error = "Please select a file";
      return;
    }

    // if (
    //   payload.isCustomUrlEnabled == true &&
    //   (payload.baseurl == null || payload.baseurl.trim().length <= 5)
    // ) {
    //   this.error = "Please enter a valid URL";
    //   return;
    // }

    if (payload.isS3Enabled == true && this.selectedS3Files.length > 0) {
      payload["isS3Enabled"] = true;
      payload["s3Data"] = JSON.stringify(this.selectedS3Files);
    } else {
      payload["isS3Enabled"] = false;
      this.selectedS3Files = [];
      payload["s3Data"] = JSON.stringify(this.selectedS3Files);
    }

    if (payload.baseurl.trim() == "") {
      payload.isCustomUrlEnabled == false;
    }

    this.loadingSpinner.show();
    this._iframily.updateIframilyWidgetSettings(payload).subscribe(
      (response: any) => {
        this.loadingSpinner.hide();
        this.widgetSettings.forEach((widgetPageData) => {
          widgetPageData.widgets.forEach((element) => {
            if (
              element.widgetSettingId === this.videoWidgetObject.widgetSettingId
            ) {
              element.data = response.object;
              this.baseurl = response.object.baseurl;
              this.videoWidgetObject = element;
            }
          });
        });
        this.videoSettingModal.hide();
      },
      (err: any) => {
        this.loadingSpinner.hide();
        this.videoSettingModal.hide();
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
      mastercategory: [this.videoWidgetObject.widgetMasterCategory],
      widgetBackgroundSettingModel: this.newBgSetting,
    };
    this.commonFunction.updateWidgetSettings(
      this.newBgSetting,
      calenderBgPayload
    );
    this.videoSettingModal.hide();
  }

  removeQueryParams(url: string): string {
    const parsedUrl = new URL(url); // Create a URL object
    parsedUrl.search = ""; // Remove the query parameters
    return parsedUrl.toString();
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
    } else if (event.target.value.includes("https://youtu.")) {
      imageUrl = this.removeQueryParams(event.target.value);
    }
    this.vidoFormGroup.controls["baseurl"].setValue(imageUrl.trim());
    this.baseurl = imageUrl;
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
    this.videoSettingModal.hide();
  }

  reverseSelection() {
    this.isMyFileSelected = false;
  }

  updateFlag() {
    this.error = null;
    const isSelected = this.vidoFormGroup.controls.isS3Enabled.value;
    const isCustomUrlEnabled =
      this.vidoFormGroup.controls.isCustomUrlEnabled.value;
    if (isCustomUrlEnabled == false && isSelected == true) {
      this.vidoFormGroup.controls["isS3Enabled"].setValue(!isSelected);
      this.vidoFormGroup.controls["isCustomUrlEnabled"].setValue(isSelected);
    }
  }

  updateVideoS3Details($event) {
    this.isMyFileSelected = false;
    this.requestType == undefined;
    this.selectedS3Files = $event.selectedS3Files;
  }

  openMyMediaFile(action) {
    this.error = null;
    if (action == "edit") {
      this.isMyFileSelected = true;
    } else {
      const isSelected = this.vidoFormGroup.controls.isS3Enabled.value;
      if (isSelected == false) {
        this.isMyFileSelected = true;
        this.vidoFormGroup.controls["isS3Enabled"].setValue(!isSelected);
        this.vidoFormGroup.controls["isCustomUrlEnabled"].setValue(isSelected);
      } else {
        this.isMyFileSelected = false;
        this.vidoFormGroup.controls["isCustomUrlEnabled"].setValue(true);
      }
    }
  }
}
