import { Component, OnInit, AfterContentInit } from "@angular/core";
import { MirrorService } from "../service/mirror.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { LocalStorageService } from "angular-web-storage";
import { DataService } from "../service/data.service";
import { WidgetService } from "../service/widget.service";
import { LayoutRequest } from "../util/static-data";
import { Intercom } from "ng-intercom";
import * as moment from "moment";
import { ModalDirective } from "ngx-bootstrap/modal";
import { ViewChild } from "@angular/core";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { WidgetsUtil } from "../util/widgetsUtil";
import { Validator } from "../util/validator";
import { VersionCheckService } from "../service/version-check.service";

@Component({
  selector: "app-mirror",
  templateUrl: "./mirror.component.html",
  styleUrls: ["./mirror.component.scss"],
})
export class MirrorComponent implements OnInit {
  @ViewChild("mirrorQuantityAlert", { static: true })
  commonAlertModal: ModalDirective;

  view = false;
  mirrorList: any;
  userDetail: any;
  isLifeTimeSubscriptionAvailable: boolean = false;
  isSubscriptionAvailable: boolean = false;

  constructor(
    private toastr: ToastrService,
    private route: Router,
    private storage: LocalStorageService,
    private _mirrorService: MirrorService,
    private _dataService: DataService,
    private _widgetService: WidgetService,
    private layoutRequest: LayoutRequest,
    public intercom: Intercom,
    private loadingSpinner: Ng4LoadingSpinnerService,
    private validator: Validator,
    private versionCheckService: VersionCheckService
  ) {}

  ngOnInit() {
    this.versionCheckService.initVersionCheck();
    let offsetWidth = document.getElementById("mirror-container").offsetWidth;
    this.layoutRequest.payload.deviceHeight = window.innerHeight - 160;
    this.layoutRequest.payload.deviceWidth = offsetWidth - 44;
    this.storage.set("layoutrequest", this.layoutRequest);

    let orientationUpdate = this.storage.get("orientationupdate");
    if (orientationUpdate != undefined) {
      let active_mirror = this.storage.get("activeMirrorDetails");
      if (active_mirror.mirror.deviceId == orientationUpdate) {
        this.loadingSpinner.show();
        this.storage.remove("orientationupdate");
        this.loadLayoutScreen(active_mirror, null);
        this.loadingSpinner.hide();
        return;
      }
    }

    this.userDetail = this.storage.get("userDetails");
    if (this.userDetail === undefined || this.userDetail === null) {
      this.route.navigateByUrl("login");
      return;
    }

    this.storage.remove("googleAlbumList");
    this.storage.remove("backgroundImageDetails");
    this.storage.remove("backgroundImageDetails");
    this.storage.remove("unsplashSelectedList");

    this.getMirrorList();
  }

  async generateHMAC(
    secretKey: string,
    userIdentifier: string
  ): Promise<string> {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secretKey);
    const data = encoder.encode(userIdentifier);

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: { name: "SHA-256" } },
      false,
      ["sign"]
    );

    const signature = await crypto.subtle.sign("HMAC", cryptoKey, data);

    return Array.from(new Uint8Array(signature))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }

  async initializeIntercome(): Promise<void> {
    this.userDetail = this.storage.get("userDetails");
    let hmac = await this.generateHMAC(
      "lJD7zdj770DvA4I2vP8mJXWGSceTwV7SlZfhZboW",
      this.userDetail.id
    );
    let subscription = this.storage.get("subscriptionDetails");
    if (subscription !== null && subscription !== undefined) {
      this.isSubscriptionAvailable = subscription.isSubscriptionAvailable;
      this.isLifeTimeSubscriptionAvailable =
        subscription.isLifeTimeSubscriptionAvailable;
    }
    let subscriptionObject = this.storage.get("subscriptionObject");

    this.intercom.boot({
      app_id: "r0j2hyik",
      email: this.userDetail.emailId,
      name: this.userDetail.name,
      user_id: this.userDetail.id,
      user_hash: hmac,
      Lifetimesubscriber: this.isLifeTimeSubscriptionAvailable,
      Premiumsubscriber: this.isSubscriptionAvailable,
      userType: "webapp",
      subscription_productid:
        subscriptionObject != undefined ? subscriptionObject.productId : null,
      sub_purchase_at:
        subscriptionObject != undefined
          ? moment(subscriptionObject.purchaseDate).format("MMMM D, YYYY")
          : null,
      sub_expiry_at:
        subscriptionObject != undefined
          ? moment(subscriptionObject.expiryDate).format("MMMM D, YYYY")
          : null,
      user_language: this.userDetail.userLocalLanguage,
      DataDog_SessionsURL:
        "https://app.datadoghq.com/rum/explorer?query=usr.id=*" +
        this.userDetail.id +
        "*&tab=error&live=true",
    });
  }

  getMirrorList() {
    this.storage.remove("googleAuthCode");
    let offsetWidth = document.getElementById("mirror-container").offsetWidth;
    this._mirrorService.getMirrorList().subscribe(
      (res: any) => {
        this._dataService.setWidgetsList(res.object.widgetList);
        this.storage.set("widgets", res.object.widgetList);
        this.mirrorList = res.object.MirrorList;
        let subscription = {
          isLifeTimeSubscriptionAvailable: this.isLifeTimeSubscriptionAvailable,
          isSubscriptionAvailable: this.isSubscriptionAvailable,
        };

        if (
          res.object.isLifeTimeSubscriptionAvailable != undefined ||
          res.object.isLifeTimeSubscriptionAvailable != null
        ) {
          subscription.isLifeTimeSubscriptionAvailable =
            res.object.isLifeTimeSubscriptionAvailable;
        }
        if (
          res.object.isSubscriptionAvailable != undefined ||
          res.object.isSubscriptionAvailable != null
        ) {
          subscription.isSubscriptionAvailable =
            res.object.isSubscriptionAvailable;
        }
        this._dataService.setTemplateList(res.object.templateList);
        this._dataService.setCustomTemplateList(
          res.object.userCustomTemplateList
        );
        this.storage.set("subscriptionDetails", subscription);
        this.storage.set("subscriptionObject", res.object.subscriptionDetail);
        this.initializeIntercome();
      },
      (err: any) => {
        this.toastr.error(err.error.message, "Error");
      }
    );
  }

  loadLayoutScreen(mirror: any, index: any) {
    let offsetWidth = document.getElementById("mirror-container").offsetWidth;
    let calculateHeight = window.innerHeight - 170;
    this.layoutRequest.payload.deviceHeight = calculateHeight;
    this._dataService.setActiveMirrorDetails(mirror);
    this.storage.set("activeMirrorDetails", mirror);
    let layoutRequestData = this.layoutRequest.payload;
    layoutRequestData.userMirror.mirror.id = mirror.mirror.id;

    this.loadingSpinner.show();
    if (index == undefined) {
      this.storage.set("device-type", mirror.mirror.deviceType);
    } else {
      this.storage.set("device-type", this.mirrorList[index].mirror.deviceType);
    }

    let isPhone = this.validator.isMobile();

    if (
      !isPhone &&
      mirror.mirror.isLmd == true &&
      mirror.mirror.deviceType != "Linked Browser" &&
      mirror.mirror.deviceWidth > 1
    ) {
      if (layoutRequestData.deviceHeight < layoutRequestData.deviceWidth) {
        let width =
          (layoutRequestData.deviceHeight * mirror.mirror.deviceWidth) /
          mirror.mirror.deviceHeight;
        layoutRequestData.deviceWidth = width;
        this.layoutRequest.payload.deviceWidth = width;
      } else {
        let height =
          (layoutRequestData.deviceWidth * mirror.mirror.deviceHeight) /
          mirror.mirror.deviceWidth;
        layoutRequestData.deviceHeight = height;
        this.layoutRequest.payload.deviceHeight = calculateHeight;
      }
      this.storage.set("lmdValues", {
        height: layoutRequestData.deviceHeight,
        width: layoutRequestData.deviceWidth,
      });
    } else {
      this.storage.remove("lmdValues");
    }

    this.storage.set("layoutrequest", this.layoutRequest);
    this._widgetService.getwidgetLayoutSettings(layoutRequestData).subscribe(
      (res: any) => {
        this.loadingSpinner.hide();
        this.intercom.shutdown();
        this._dataService.setWidgetSettingsLayout(res.object);
        this.storage.set("activeWidgetDetails", res.object);
        this.storage.set("widgetsSetting", res.object.widgetSetting);
        this.route.navigate(["widgets/layout"]);
      },
      (err: any) => {
        this.loadingSpinner.hide();
        this.toastr.error(err.error.message, "Error");
      }
    );
  }

  onSetupRoute() {
    // routerLink="setup"

    this.intercom.shutdown();
    let subscriptionStatus = this.storage.get("subscriptionDetails");
    let subscriptionDetails = this.storage.get("subscriptionObject");

    if (subscriptionStatus.isLifeTimeSubscriptionAvailable == true) {
      this.route.navigateByUrl("mirrors/setup");
    } else {
      if (subscriptionStatus.isSubscriptionAvailable == true) {
        if (
          this.mirrorList == null ||
          this.mirrorList == undefined ||
          subscriptionDetails.quantity > this.mirrorList.length
        ) {
          this.route.navigateByUrl("mirrors/setup");
          // this.route.navigateByUrl("mirrors/setup/template");
        } else {
          this.commonAlertModal.show();
        }
      } else {
        if (
          this.mirrorList == null ||
          this.mirrorList == undefined ||
          2 > this.mirrorList.length
        ) {
          this.route.navigateByUrl("mirrors/setup");
        } else {
          this.commonAlertModal.show();
        }
      }
    }
  }

  openUserProfile() {
    this.intercom.shutdown();
    this.route.navigate(["user-profile"]);
  }

  ngOnDestroy() {
    this.intercom.shutdown();
  }
}
function Injectable(arg0: { providedIn: typeof WidgetsUtil }) {
  throw new Error("Function not implemented.");
}
