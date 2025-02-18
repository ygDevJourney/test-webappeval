import {
  AfterViewInit,
  Component,
  OnChanges,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { DataService } from "src/app/service/data.service";
import { MirrorService } from "src/app/service/mirror.service";
import { WidgetService } from "src/app/service/widget.service";
import { ModalDirective } from "ngx-bootstrap/modal/public_api";
import {
  LayoutRequest,
  mirror_orientation_list,
} from "src/app/util/static-data";
import { environment } from "src/environments/environment";
import { LocalStorageService } from "angular-web-storage";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { SubscriptionUtil } from "src/app/util/subscriptionUtil";

@Component({
  selector: "app-mirrorsetting",
  templateUrl: "./mirrorsetting.component.html",
  styleUrls: ["./mirrorsetting.component.scss"],
})
export class MirrorsettingComponent implements OnInit, AfterViewInit {
  @ViewChild("confirmFactoryReset", { static: true })
  confirmFactoryResetModal: ModalDirective;
  @ViewChild("orientation", { static: true })
  orientationModal: ModalDirective;
  @ViewChild("preview", { static: true })
  commonAlertModal: ModalDirective;
  @ViewChild("timezone", { static: true })
  timeZoneModal: ModalDirective;
  @ViewChild("gesture", { static: true })
  gestureModal: ModalDirective;
  @ViewChild("overlay", { static: true })
  overlayModal: ModalDirective;

  orientationList: any = mirror_orientation_list;
  activeMirror: any;
  macAddress: string;
  mirrorName: string;
  currentOrientation: string;
  displayScheduleStatus: string;
  linkedBrowserUrl: string;
  bgSettingOptions: any;
  selectedThemeId: any;
  deviceType: any;
  timeZoneId: string;
  is24Hourformat: boolean;
  subscriptionData: any;
  subscriptionDetail: any;
  currentSubscriptionHirarchy: number = 0;
  gesture: any;
  userCredentials = null;

  constructor(
    private loadingSpinner: Ng4LoadingSpinnerService,
    private router: Router,
    private toastr: ToastrService,
    private _dataService: DataService,
    private _mirrorService: MirrorService,
    private _widgetService: WidgetService,
    private layoutRequest: LayoutRequest,
    private storage: LocalStorageService,
    private _subscriptionUtil: SubscriptionUtil
  ) {}

  ngAfterViewInit(): void {
    if (this.storage.get("googleAuthCode") !== null) {
      this.userCredentials = {
        code: this.storage.get("googleAuthCode"),
        type: "google",
      };
      this.gestureModal.show();
    } else if (this.storage.get("outlookAuthCode") !== null) {
      this.userCredentials = {
        code: this.storage.get("outlookAuthCode"),
        type: "outlook",
      };
      this.gestureModal.show();
    }
  }

  ngOnInit() {
    this.getActiveMirrorDetails();
    this.selectedThemeId = this.storage.get("activeMirrorDetails");
    this.subscriptionData = this.storage.get("subscriptionObject");
    this.subscriptionDetail = this.storage.get("subscriptionDetails");
    if (this._subscriptionUtil.getCurrentSubscriptionStatus) {
      this.currentSubscriptionHirarchy =
        this._subscriptionUtil.getCurrentPlanHirarchy();
    }
  }

  getActiveMirrorDetails() {
    this._dataService.getActiveMirrorDetails().subscribe((mirrorDetails) => {
      this.activeMirror = mirrorDetails;
      this.macAddress = this.activeMirror.mirror.deviceId;
      this.mirrorName = this.activeMirror.mirrorName;
      this.deviceType = this.activeMirror.mirror.deviceType;
      this.timeZoneId = this.activeMirror.timeZoneId;
      this.is24Hourformat = this.activeMirror.mirror.is24HourFormat;
      // this.deviceType = this.storage.get("device-type");
      this.currentOrientation = this.getCurrentOrientation(
        this.activeMirror.mirror.mirrorOrientation
      );
      if (this.activeMirror.mirror) {
        this.linkedBrowserUrl =
          environment.portalBaseURL +
          "?major=" +
          this.activeMirror.mirror.major +
          "&minor=" +
          this.activeMirror.mirror.minor +
          "&macaddress=" +
          this.activeMirror.mirror.deviceId +
          "&preview=true";
      }

      this.displayScheduleStatus = "Coming soon..";
    });
  }

  backToLayoutScreen() {
    if (this.activeMirror !== null) {
      let layoutRequestData = this.layoutRequest.payload;
      layoutRequestData.userMirror.mirror.id = this.activeMirror.mirror.id;
      this._widgetService.getwidgetLayoutSettings(layoutRequestData).subscribe(
        (res: any) => {
          this._dataService.setWidgetSettingsLayout(res.object);
          this.router.navigate(["widgets/layout"]);
        },
        (err: any) => {
          this.toastr.error(err.error.message, "Error");
        }
      );
    }
  }

  openResetConfirmationModal() {
    this.confirmFactoryResetModal.show();
  }

  openPreviewConfirmationModal() {
    this.commonAlertModal.show();
  }

  openOrientationModal() {
    this.orientationModal.show();
  }

  getBgSettings(event) {
    this.bgSettingOptions = event;
    this.updateBackgroundSetting();
  }

  updateBackgroundSetting() {
    if (
      this.selectedThemeId &&
      this.selectedThemeId.mirror &&
      this.selectedThemeId.mirror.backgroundSetting
    ) {
      this.bgSettingOptions.backgroundSetting["id"] =
        this.selectedThemeId.mirror.backgroundSetting.id;
      this._mirrorService
        .updateBackgrundSetting(this.bgSettingOptions)
        .subscribe((res) => {
          this.selectedThemeId.mirror.backgroundSetting =
            this.bgSettingOptions.backgroundSetting;
          this.storage.set("activeMirrorDetails", this.selectedThemeId);
          this.activeMirror = this.selectedThemeId;
        });
    } else {
      let bgSettingOptionPayload: any = this.bgSettingOptions;
      delete bgSettingOptionPayload["backgroundSetting"]["id"];
      this._mirrorService
        .addBackgrundSetting(bgSettingOptionPayload)
        .subscribe((res: any) => {
          this.selectedThemeId.mirror.backgroundSetting = res.object;
          this.storage.set("activeMirrorDetails", this.selectedThemeId);
          this.activeMirror = this.selectedThemeId;
        });
    }
  }

  getCurrentOrientation(orientationValue) {
    for (var i = 0; i < this.orientationList.length; i++) {
      if (this.orientationList[i].value == orientationValue) {
        return this.orientationList[i].name;
      }
    }
  }

  getThemeName(name) {
    if (name === "Cyborg") {
      return "Smart Mirror";
    } else if (name === "Simplex") {
      return "Simple";
    } else if (name === "Lux") {
      return "Modern";
    } else if (name === "Sketchy") {
      return "Sketchy";
    } else if (name === "Slate") {
      return "Dark mode";
    } else {
      return "Smart Mirror";
    }
  }

  updatePreview() {
    try {
      window.open(this.linkedBrowserUrl, "_blank").focus();
    } catch (error) {
      console.log(error);
    }
  }

  updateTimeFormat(is24HourFormat) {
    this.loadingSpinner.show();
    let layoutRequestData = {
      id: this.activeMirror.mirror.id,
      is24HourFormat: is24HourFormat,
    };
    this._mirrorService.updateTimeFormat(layoutRequestData).subscribe(
      (res: any) => {
        this.loadingSpinner.hide();
        this.activeMirror.mirror.is24HourFormat = is24HourFormat;
        this._dataService.setActiveMirrorDetails(this.activeMirror);
        this.storage.set("activeMirrorDetails", this.activeMirror);
      },
      (err: any) => {
        this.loadingSpinner.hide();
        this.toastr.error(err.error.message, "Error");
      }
    );
  }

  getTimezoneSetting($event) {}

  upgradeSubscriptionPage() {
    if (
      this.subscriptionData != null &&
      this.subscriptionDetail.isSubscriptionAvailable
    ) {
      this._subscriptionUtil.redirectToStripeCustomerPortal();
    } else {
      this.router.navigate(["plans-and-payments"]);
    }
  }

  gotoTemplateOptionPage() {
    if (this.currentSubscriptionHirarchy < 2) {
      this.upgradeSubscriptionPage();
    } else {
      this.router.navigateByUrl("mirrors/setting/templateoption");
    }
  }

  gotoGestureControlPage() {
    if (this.currentSubscriptionHirarchy < 2) {
      this.upgradeSubscriptionPage();
    } else {
      this.gestureModal.show();
    }
  }

  gotoOverlayControlPage() {
    if (this.currentSubscriptionHirarchy < 2) {
      this.upgradeSubscriptionPage();
    } else {
      this.overlayModal.show();
    }
  }
}
