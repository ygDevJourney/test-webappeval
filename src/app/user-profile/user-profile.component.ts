import {
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { LocalStorageService } from "angular-web-storage";
import { Router } from "@angular/router";
import { Intercom } from "ng-intercom";
import { environment } from "src/environments/environment";
import { StripePaymentService } from "../service/stripe-payment.service";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { ToastrService } from "ngx-toastr";
import * as moment from "moment";
import { DataService } from "../service/data.service";
import { SupportedLanguage } from "../util/static-data";
import { ModalDirective } from "angular-bootstrap-md";
import { SubscriptionUtil } from "../util/subscriptionUtil";
import { VersionCheckService } from "../service/version-check.service";

declare var Stripe;
@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.scss"],
})
export class UserProfileComponent implements OnInit, OnChanges {
  @ViewChild("language", { static: true }) languageModal: ModalDirective;

  userName: any;
  userEmail: any;
  isLifeTimeSubscription: any;
  currentSubscription: any;
  stripe;
  isUserSubscribed: boolean = false;
  supportedlanguage: any[] = SupportedLanguage;
  profileLanguage: any;
  customTemplateList = [];
  currentSubscriptionHirarchy: number = 0;
  appVersion = environment.appVersionSuffix;

  constructor(
    private storage: LocalStorageService,
    private router: Router,
    public intercom: Intercom,
    private _paymentService: StripePaymentService,
    private loadingSpinner: Ng4LoadingSpinnerService,
    private toastr: ToastrService,
    private _dataService: DataService,
    private _subscriptionUtil: SubscriptionUtil,
    private _versionCheckService: VersionCheckService
  ) {}

  ngOnChanges(changes: any): void {
    let subscription = this.storage.get("subscriptionDetails");
    this.currentSubscription = this.storage.get("subscriptionObject");

    if (subscription != null) {
      this.isLifeTimeSubscription =
        subscription.isLifeTimeSubscriptionAvailable;
    }
    this.isUserSubscribed = this._dataService.getCurrentSubscriptionStatus();
  }

  ngOnInit() {
    this.appVersion =
      this.appVersion + "." + this._versionCheckService.getcurrentVersion();

    if (this.storage.get("userDetails") === null) {
      this.logout();
    } else {
      this.userName = this.storage.get("userDetails").name;
      this.userEmail = this.storage.get("userDetails").emailId;
      let lancode = this.storage.get("userDetails").userLocalLanguage;
      this.supportedlanguage.forEach((language) => {
        if (language.value == lancode) {
          this.profileLanguage = language;
        }
      });
    }

    let subscription = this.storage.get("subscriptionDetails");
    this.currentSubscription = this.storage.get("subscriptionObject");

    if (subscription != null) {
      this.isLifeTimeSubscription =
        subscription.isLifeTimeSubscriptionAvailable;
      this.isUserSubscribed = subscription.isSubscriptionAvailable;
    }

    this._dataService.getCustomTemplateList().subscribe((data) => {
      this.customTemplateList = data;
    });

    if (this._subscriptionUtil.getCurrentSubscriptionStatus) {
      this.currentSubscriptionHirarchy =
        this._subscriptionUtil.getCurrentPlanHirarchy();
    }
  }

  redirctStripePortal() {
    if (
      this.currentSubscription == null ||
      this.currentSubscription == undefined ||
      this.currentSubscription.productId == "FreeTrial" ||
      this.currentSubscription.productId == null ||
      this.currentSubscription.productId == undefined ||
      this.isUserSubscribed == false
    ) {
      this.router.navigate(["plans-and-payments"]);
    } else {
      this.loadingSpinner.show();
      this._paymentService.getStripePortalSession().subscribe(
        (res: any) => {
          let result = res.object;
          window.location.href = result.portalUrl;
          this.loadingSpinner.hide();
        },
        (err: any) => {
          this.toastr.error(err.error.message);
          this.loadingSpinner.hide();
        }
      );
    }
  }

  gotoMirrorList() {
    this.router.navigate(["mirrors"]);
  }

  paymentSuccess() {
    this.router.navigate(["payment-success"]);
  }

  logout() {
    this.storage.clear();
    this.intercom.shutdown();
    this.router.navigate(["login"]);
  }

  openLanguageModal() {
    this.languageModal.show();
  }

  routeManageBucket() {
    if (this.currentSubscriptionHirarchy < 2) {
      this._subscriptionUtil.upgradeSubscriptionPage();
    } else {
      this.router.navigateByUrl("user-profile/manage-s3-bucket");
    }
  }
}
