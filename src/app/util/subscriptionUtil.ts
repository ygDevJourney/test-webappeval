import { Injectable, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LocalStorageService } from "angular-web-storage";
import * as internal from "assert";
import * as moment from "moment";
import { Intercom } from "ng-intercom";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { ToastrService } from "ngx-toastr";
import { DataService } from "../service/data.service";
import { StripePaymentService } from "../service/stripe-payment.service";
import {
  PlanHirarchy,
  SubscriptionCategory,
  SubscriptionRequiredWidget,
  WidgetsCategory,
} from "./static-data";

@Injectable({
  providedIn: "root",
})
export class SubscriptionUtil implements OnInit {
  categoryList = WidgetsCategory;
  subscriptionWidgetList = SubscriptionRequiredWidget;
  subscriptionCategory = SubscriptionCategory;
  planHirarchy = PlanHirarchy;
  currentPlanHirarchy: number = 0;
  currentSubscriptionObject;
  subscription;
  isUserSubscribed = false;

  constructor(
    private storage: LocalStorageService,
    private router: Router,
    private _paymentService: StripePaymentService,
    private loadingSpinner: Ng4LoadingSpinnerService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }

  getCurrentPaymentHirarchy(): number {
    let subscriptionData = this.storage.get("subscriptionObject");
    if (subscriptionData != null && subscriptionData != undefined) {
      for (let index = 0; index < this.planHirarchy.length; index++) {
        if (
          this.planHirarchy[index].planList.includes(subscriptionData.productId)
        ) {
          this.currentPlanHirarchy = this.planHirarchy[index].hirarchy;
          return this.currentPlanHirarchy;
        }
      }
    }
    return this.currentPlanHirarchy;
  }

  redirectToPaymentScreen() {
    this.subscription = this.storage.get("subscriptionDetails");
    if (this.subscription != null) {
      this.isUserSubscribed = this.subscription.isSubscriptionAvailable;
    }
    this.currentSubscriptionObject = this.storage.get("subscriptionObject");
    if (
      this.currentSubscriptionObject == null ||
      this.currentSubscriptionObject == undefined ||
      this.currentSubscriptionObject.productId == "FreeTrial" ||
      this.currentSubscriptionObject.productId == null ||
      this.currentSubscriptionObject.productId == undefined ||
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

  redirectToStripeCustomerPortal() {
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

  checkSubscriptionStatus(category: string) {
    let subscriptionDetail = this.storage.get("subscriptionDetails");
    if (
      subscriptionDetail.isLifeTimeSubscriptionAvailable ||
      subscriptionDetail.isSubscriptionAvailable
    ) {
      return false;
    } else {
      return true;
    }
  }

  checkSubscriptionUpgradeStatus(
    requireHirarchy: number,
    currentPlanHirarchy: number
  ) {
    let subscriptionData = this.storage.get("subscriptionObject");
    if (
      subscriptionData == null ||
      (subscriptionData != null &&
        subscriptionData.stripeSubscriptionId == undefined)
    ) {
      return false;
    }
    if (requireHirarchy <= currentPlanHirarchy) {
      return false;
    } else {
      return true;
    }
  }

  getCurrentSubscriptionStatus(): boolean {
    let subscription = this.storage.get("subscriptionObject");

    if (subscription != null && subscription != undefined) {
      let currentdate = moment.utc();
      let currentExpiryDate = moment(subscription.expiryDate);
      if (currentExpiryDate.isAfter(currentdate)) {
        return true;
      } else {
        return false;
      }
    }
  }

  getPlanDetailByHirarchy(hirarchy: number): any {
    for (let index = 0; index < this.planHirarchy.length; index++) {
      if (this.planHirarchy[index].hirarchy == hirarchy) {
        return this.planHirarchy[index];
      }
    }
    return null;
  }

  getCurrentPlanHirarchy(): number {
    let subscription = this.storage.get("subscriptionObject");
    if (subscription == undefined || subscription == undefined) {
      return 0;
    }
    if (subscription.productId.includes("plus")) {
      return 1;
    } else if (subscription.productId.includes("pro")) {
      return 2;
    } else if (subscription.productId.includes("health")) {
      return 3;
    } else if (subscription.productId.includes("business")) {
      return 4;
    }
  }

  upgradeSubscriptionPage() {
    let subscriptionData = this.storage.get("subscriptionObject");
    if (
      subscriptionData != null &&
      subscriptionData.subscriptionStatus != "canceled"
    ) {
      this.redirectToStripeCustomerPortal();
    } else {
      this.router.navigate(["plans-and-payments"]);
    }
  }
}
