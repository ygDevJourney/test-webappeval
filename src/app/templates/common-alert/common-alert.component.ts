import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { LocalStorageService } from "angular-web-storage";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { ToastrService } from "ngx-toastr";
import { StripePaymentService } from "src/app/service/stripe-payment.service";

@Component({
  selector: "app-common-alert",
  templateUrl: "./common-alert.component.html",
  styleUrls: ["./common-alert.component.scss"],
})
export class CommonAlertComponent implements OnInit {
  @Input() commonAlertModal: any;
  @Input() type: any;
  @Input() header: any;
  @Input() data: any;
  @Output() updatePreviewEventEmiter = new EventEmitter<any>();

  mirrorQuantity = 0;
  currentSubscription: object;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private loadingSpinner: Ng4LoadingSpinnerService,
    private storage: LocalStorageService,
    private _paymentService: StripePaymentService
  ) {}

  ngOnInit() {
    let subscriptionDetails = this.storage.get("subscriptionObject");
    if (
      subscriptionDetails != null &&
      subscriptionDetails.stripeSubscriptionId != undefined
    ) {
      this.mirrorQuantity = subscriptionDetails.quantity;
    } else {
      this.mirrorQuantity = 2;
    }
  }

  redirectToPayment() {
    let subscriptionDetails = this.storage.get("subscriptionObject");

    if (
      subscriptionDetails == null ||
      subscriptionDetails == undefined ||
      (subscriptionDetails != null &&
        subscriptionDetails.stripeSubscriptionId == undefined)
    ) {
      this.router.navigate(["plans-and-payments"]);
    } else {
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

  updatePreviewConfirmation() {
    this.updatePreviewEventEmiter.emit({ response: true });
    this.commonAlertModal.hide();
  }

  redirectToManageTemplate() {
    this.router.navigateByUrl("user-profile/manage-template");
  }
}
