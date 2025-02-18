import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { LocalStorageService } from "angular-web-storage";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { ToastrService } from "ngx-toastr";
import { CustomSortPipe } from "src/app/pipes/custom-sort.pipe";
import { CommonFunction } from "src/app/service/common-function.service";
import { DataService } from "src/app/service/data.service";
import { IframilyService } from "src/app/service/iframily.service";
import {
  Pdf_autorefresh_time_option,
  available_image_transition,
  available_transition,
} from "src/app/util/static-data";

@Component({
  selector: "app-pdf-document",
  templateUrl: "./pdf-document.component.html",
  styleUrls: ["./pdf-document.component.scss"],
})
export class PdfDocumentComponent implements OnInit {
  @Input() pdfWidgetObject: any;
  @Input() pdfSettingModal: any;
  @Input() activeLayout: any;
  @Input() category: string;

  iframily_autorefresh_time_option = [...Pdf_autorefresh_time_option];
  settingDisplayflag: boolean = true;
  baseurl: string = null;
  error: string = null;
  private widgetSettings: any;
  private widgetLayoutDetails: any;
  pdfFormGroup: FormGroup;
  pageChangeDuration: any = 1;
  defaultMinutes = 1;
  defaultSeconds = 0;

  minute = 1;
  second = 0;

  //background widget setting
  availableTransition = [...available_image_transition];
  selectedTransition: string = "fade";
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
  requestType: string = "pdfRequestType";

  constructor(
    private toastr: ToastrService,
    private _dataService: DataService,
    private commonFunction: CommonFunction,
    private storage: LocalStorageService,
    private _iframily: IframilyService,
    private formBuilder: FormBuilder,
    private loadingSpinner: Ng4LoadingSpinnerService,
    private _customSortPipe: CustomSortPipe
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.pdfWidgetObject != undefined) {
      if (changes.pdfWidgetObject.currentValue != undefined) {
        this._dataService.getWidgetSettingsLayout().subscribe((data) => {
          this.widgetLayoutDetails = data;
          this.widgetSettings = data.widgetSetting;
          this.widgetBgSetting =
            changes.pdfWidgetObject.currentValue.widgetBackgroundSettingModel;
        });
        if (changes.pdfWidgetObject.currentValue.data != undefined) {
          this.baseurl =
            changes.pdfWidgetObject.currentValue.data.iframeDetail.baseurl;
          this.createPdfForm(
            changes.pdfWidgetObject.currentValue.data.iframeDetail
          );
        }
      }
    }
  }

  ngOnInit() {
    this.createPdfForm(this.iframilyData);
  }

  get minutes() {
    return this.pdfFormGroup.get("minutes").value;
  }

  get seconds() {
    return this.pdfFormGroup.get("seconds").value;
  }

  createPdfForm(iframilyData) {
    if (
      iframilyData == undefined ||
      iframilyData.isS3Enabled == undefined ||
      iframilyData.isS3Enabled == false
    ) {
      this.selectedS3Files = [];
    }

    if (iframilyData != undefined && iframilyData.transition != null) {
      this.selectedTransition = iframilyData.transition;
    }

    if (iframilyData != undefined && iframilyData != null) {
      if (iframilyData != undefined && iframilyData.imageDelayTime != null) {
        this.minute = Math.floor(iframilyData.imageDelayTime / 60);
        this.second = iframilyData.imageDelayTime - this.minute * 60;
      }

      this.pdfFormGroup = this.formBuilder.group({
        baseurl: [
          iframilyData ? iframilyData.baseurl : null,
          Validators.required,
        ],
        autoRefreshTime: [
          iframilyData ? iframilyData.autoRefreshTime : 60,
          Validators.required,
        ],
        isS3Enabled: [
          iframilyData ? iframilyData.isS3Enabled : false,
          Validators.required,
        ],
        isCustomUrlEnabled: [
          iframilyData ? iframilyData.isCustomUrlEnabled : false,
          Validators.required,
        ],

        isAutoScroll: [
          iframilyData ? iframilyData.isAutoScroll : false,
          Validators.required,
        ],
        isCropToFill: [
          iframilyData ? iframilyData.isCropToFill : true,
          Validators.required,
        ],
        transition: [
          iframilyData ? iframilyData.transition : "fade",
          Validators.required,
        ],
        imageBrightness: [
          iframilyData ? iframilyData.imageBrightness : 1,
          Validators.required,
        ],
        imageDelayTime: [
          iframilyData ? iframilyData.imageDelayTime : 1,
          Validators.required,
        ],
        minutes: [
          this.minute,
          [
            Validators.required,
            Validators.min(0),
            Validators.max(900),
            Validators.pattern("^[0-9]*$"),
          ],
        ],
        seconds: [
          this.second,
          [
            Validators.required,
            Validators.min(0),
            Validators.max(59),
            Validators.pattern("^[0-9]*$"),
          ],
        ],
      });

      if (this.pdfFormGroup.controls.isS3Enabled.value) {
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

  validateTimerValue() {
    if (
      !new RegExp("^[0-9]*$").test(this.minutes) ||
      !new RegExp("^[0-9]*$").test(this.seconds)
    ) {
      if (!new RegExp("^[0-9]*$").test(this.minutes)) {
        this.pdfFormGroup.controls.minutes.setValue(0);
      }

      if (!new RegExp("^[0-9]*$").test(this.seconds)) {
        this.pdfFormGroup.controls.seconds.setValue(0);
      }
    }

    if (this.minutes <= 0 && this.seconds <= 0) {
      this.pdfFormGroup.controls.minutes.setValue(0);
      this.pdfFormGroup.controls.seconds.setValue(30);
    } else {
      if (this.minutes > 900) {
        this.pdfFormGroup.controls.minutes.setValue(900);
      }

      if (this.seconds > 59) {
        this.pdfFormGroup.controls.seconds.setValue(59);
      }

      if (this.seconds <= 0) {
        this.pdfFormGroup.controls.seconds.setValue(0);
      }

      if (this.minutes <= 0) {
        this.pdfFormGroup.controls.minutes.setValue(0);
      }
    }
  }

  setPhotoDuration(count: any) {
    this.pageChangeDuration = count;
  }

  saveIframilySettings() {
    this.pdfFormGroup.get("imageDelayTime").setValue(this.pageChangeDuration);

    let payload = this.pdfFormGroup.value;

    let widgetId = {
      id: this.pdfWidgetObject.widgetSettingId,
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

    if (payload.isCustomUrlEnabled == false) {
      payload["isCustomUrlEnabled"] = false;
    }

    if (payload.isFadeInOut == null && payload.fadeInOut) {
      payload["isFadeInOut"] = false;
    }

    payload["imageDelayTime"] =
      Number(this.minutes) * 60 + Number(this.seconds);
    delete payload.minutes;
    delete payload.seconds;

    if (
      payload.imageBrightness == null &&
      payload.imageBrightness == undefined
    ) {
      payload["imageBrightness"] = 1;
    }

    this.loadingSpinner.show();
    this._iframily.updateIframilyWidgetSettings(payload).subscribe(
      (response: any) => {
        this.loadingSpinner.hide();
        this.widgetSettings.forEach((widgetPageData) => {
          widgetPageData.widgets.forEach((element) => {
            if (
              element.widgetSettingId === this.pdfWidgetObject.widgetSettingId
            ) {
              element.data = response.object;
              this.baseurl = response.object.baseurl;
              this.selectedS3Files = response.object.s3Data;
              this.pdfWidgetObject = element;
              this.createPdfForm(response.object);
            }
          });
        });
        this.pdfSettingModal.hide();
      },
      (err: any) => {
        this.loadingSpinner.hide();
        this.pdfSettingModal.hide();
        this.toastr.error(err.error.message, "Error");
      }
    );
  }

  onbgsettingOptions(event) {
    this.newBgSetting = event;
    this.onAddBackgroundSetting();
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
    this.pdfFormGroup.controls["baseurl"].setValue(imageUrl.trim());
    this.baseurl = imageUrl;
  }

  onAddBackgroundSetting() {
    const pdfBgPayload = {
      userMirrorId: this.activeMirrorDetails.id,
      mastercategory: [this.pdfWidgetObject.widgetMasterCategory],
      widgetBackgroundSettingModel: this.newBgSetting,
    };
    this.commonFunction.updateWidgetSettings(this.newBgSetting, pdfBgPayload);
    this.pdfSettingModal.hide();
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
    this.pdfSettingModal.hide();
  }
  openMyMediaFile(action) {
    this.error = null;
    if (action == "edit") {
      this.isMyFileSelected = true;
    } else {
      const isSelected = this.pdfFormGroup.controls.isS3Enabled.value;
      if (isSelected == false) {
        this.isMyFileSelected = true;
        this.pdfFormGroup.controls["isS3Enabled"].setValue(!isSelected);
        this.pdfFormGroup.controls["isCustomUrlEnabled"].setValue(isSelected);
      } else {
        this.isMyFileSelected = false;
      }
    }
  }

  reverseSelection() {
    this.isMyFileSelected = false;
  }

  updateFlag() {
    this.error = null;
    const isSelected = this.pdfFormGroup.controls.isS3Enabled.value;
    const isCustomUrlEnabled =
      this.pdfFormGroup.controls.isCustomUrlEnabled.value;
    if (isCustomUrlEnabled == false && isSelected == true) {
      this.pdfFormGroup.controls["isS3Enabled"].setValue(!isSelected);
      this.pdfFormGroup.controls["isCustomUrlEnabled"].setValue(isSelected);
    }
  }

  updatePDFS3Details($event) {
    this.isMyFileSelected = false;
    this.requestType == undefined;
    this.selectedS3Files = $event.selectedS3Files;
  }
}
