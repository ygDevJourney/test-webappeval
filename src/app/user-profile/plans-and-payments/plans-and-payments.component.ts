import { Component, OnInit, AfterViewInit } from "@angular/core";
import { LocalStorageService } from "angular-web-storage";
import { Router } from "@angular/router";
import { StripePaymentService } from "src/app/service/stripe-payment.service";
import { ToastrService } from "ngx-toastr";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { environment } from "src/environments/environment";
import * as moment from "moment";
import { now } from "moment";
import { planList } from "src/app/util/static-data";

declare var Stripe;
@Component({
  selector: "app-plans-and-payments",
  templateUrl: "./plans-and-payments.component.html",
  styleUrls: ["./plans-and-payments.component.scss"],
})
export class PlansAndPaymentsComponent implements OnInit, AfterViewInit {
  selected_plan: any;
  currentSubscription: any;
  stripe: any;
  card;
  cardErrors;
  trialEndDate: any = moment().add(7, "days");
  planList = planList;
  visiblePlanList: object;
  isSelectedCategory: boolean = false;
  plancategory: string = "monthly";
  isPaymentInitiated: boolean = false;

  constructor(
    private storage: LocalStorageService,
    private route: Router,
    private _paymentService: StripePaymentService,
    private toastr: ToastrService,
    private loadingSpinner: Ng4LoadingSpinnerService
  ) {
    this.selected_plan = "monthly_plan";
  }

  ngAfterViewInit(): void {
    this.currentSubscription = this.storage.get("subscriptionObject");
    // Create a Stripe client.
    this.stripe = Stripe(environment.stripeKey);
  }

  gotoMirrorList() {
    this.route.navigate(["mirrors"]);
  }

  ngOnInit() {
    this.currentSubscription = this.storage.get("subscriptionObject");
    this.visiblePlanList = this.planList.filter(
      (s) => s.type === this.plancategory
    );
  }

  updateSelectedPlan(plan) {
    this.selected_plan = plan;
  }

  updateSubscription(event: any) {
    let payload = { stripeTokenId: event.stripeTokenId };
    payload["productId"] = event.productId;

    this.loadingSpinner.show();
    this._paymentService.activateSubscriptionAPI(payload).subscribe(
      (res: any) => {
        let result = res.object;
        this.storage.set("subscriptionObject", result);
        this.loadingSpinner.hide();
        this.toastr.success("Subscription Updated Successfully.");
        this.route.navigate(["mirrors"]);
      },
      (err: any) => {
        this.toastr.error(err.error.message);
        this.loadingSpinner.hide();
      }
    );
  }

  activateFreeTrial() {
    this.loadingSpinner.show();
    this._paymentService.initiateFreeTrial().subscribe(
      (res: any) => {
        let result = res.object;
        this.storage.set("subscriptionObject", result);
        this.loadingSpinner.hide();
        this.toastr.success("Subscription Updated Successfully.");
        this.route.navigate(["mirrors"]);
      },
      (err: any) => {
        this.toastr.error(err.error.message);
        this.loadingSpinner.hide();
      }
    );
  }

  saveProfileChanges() {
    this.route.navigate(["mirrors"]);
  }

  loadStripeUrl() {
    window.open("https://stripe.com");
  }

  //new stripe flow

  // Create a Checkout Session with the selected plan ID
  // createCheckoutSession () {

  //   let payload = {
  //     priceId: this.selected_plan
  //   };
  //   this._paymentService.getCheckoutSession(payload).subscribe(
  //     (res: any) => {
  //       if(res.object.sessionId!=undefined && res.object.sessionId!=null)
  //       {
  //         this.stripe.redirectToCheckout({sessionId: res.object.sessionId}).then(this.handleResult);
  //       }
  //     },
  //     (err: any) => {
  //       this.toastr.error(err.error.message, "Error");
  //       this.loadingSpinner.hide();
  //     }
  //   )};

  // Handle any errors returned from Checkout
  handleResult(result) {
    if (result.error) {
      alert(result.error.message);
    }
  }

  handleFetchResult(result) {
    if (!result.ok) {
      return result
        .json()
        .then(function (json) {
          if (json.error && json.error.message) {
            throw new Error(
              result.url + " " + result.status + " " + json.error.message
            );
          }
        })
        .catch(function (err) {
          throw err;
        });
    }
    return result.json();
  }

  changeplan() {
    if (this.plancategory == "monthly") {
      this.isSelectedCategory = true;
      this.plancategory = "yearly";
    } else {
      this.plancategory = "monthly";
      this.isSelectedCategory = false;
    }
    this.visiblePlanList = this.planList.filter(
      (s) => s.type === this.plancategory
    );
  }

  // Create a Checkout Session with the selected plan ID
  createCheckoutSession(plan) {
    let payload = {
      priceId: plan.planCode,
    };
    this._paymentService.getCheckoutSession(payload).subscribe(
      (res: any) => {
        this.isPaymentInitiated = false;
        if (res.object.sessionId != undefined && res.object.sessionId != null) {
          this.stripe
            .redirectToCheckout({ sessionId: res.object.sessionId })
            .then(this.handleResult);
        } else if (
          res.object.portalUrl != undefined &&
          res.object.portalUrl != null
        ) {
          //redirect to stripe customer portal
          let result = res.object;
          window.location.href = result.portalUrl;
        }
      },
      (err: any) => {
        this.isPaymentInitiated = false;
        this.toastr.error(err.error.message, "Error");
        this.loadingSpinner.hide();
      }
    );
  }
}
