import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  OnDestroy,
} from "@angular/core";
import {
  SubscriptionRequiredWidget,
  SubscriptionCategory,
  PlanHirarchy,
  WidgetsCategory,
} from "../../util/static-data";
import { LocalStorageService } from "angular-web-storage";
import { StripePaymentService } from "src/app/service/stripe-payment.service";
import { ToastrService } from "ngx-toastr";
import { WidgetsUtil } from "src/app/util/widgetsUtil";
import { SubscriptionUtil } from "src/app/util/subscriptionUtil";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";

@Component({
  selector: "app-widget-category",
  templateUrl: "./widget-category.component.html",
  styleUrls: ["./widget-category.component.scss"],
})
export class WidgetCategoryComponent implements OnInit, OnChanges {
  @Input() widgetsCategoryModal: any;
  @Input() category: String;
  @Output() openWidgetCategorySetting = new EventEmitter<string>();

  categoryList = [...WidgetsCategory];
  subscriptionWidgetList = [...SubscriptionRequiredWidget];
  subscriptionCategory = [...SubscriptionCategory];
  planHirarchy = [...PlanHirarchy];
  currentPlanHirarchy: number = 0;
  isSubscriptionAvailable = false;
  currentPlan: string = "plan name";

  constructor(
    private storage: LocalStorageService,
    private _paymentService: StripePaymentService,
    private toastr: ToastrService,
    private loadingSpinner: Ng4LoadingSpinnerService,
    private _widgetUtil: WidgetsUtil,
    private _subscriptionUtil: SubscriptionUtil
  ) {}

  ngOnChanges(changes: any) {
    let subscriptionData = this.storage.get("subscriptionObject");
    if (subscriptionData != null && subscriptionData != undefined) {
      for (let index = 0; index < this.planHirarchy.length; index++) {
        if (
          this.planHirarchy[index].planList.includes(subscriptionData.productId)
        ) {
          this.currentPlanHirarchy = this.planHirarchy[index].hirarchy;
          break;
        }
      }
    }

    if (
      changes.category != undefined &&
      changes.category.currentValue == "categorySelection"
    ) {
      this.checkCategoryAndUpdateStatus();
    }
  }

  ngOnInit() {}

  checkCategoryAndUpdateStatus = function () {
    let subscriptionDetail = this.storage.get("subscriptionDetails");
    if (
      subscriptionDetail.isLifeTimeSubscriptionAvailable ||
      subscriptionDetail.isSubscriptionAvailable
    ) {
      this.isSubscriptionAvailable =
        this._subscriptionUtil.getCurrentSubscriptionStatus();
    } else {
      this.isSubscriptionAvailable = false;
    }

    if (this.currentPlanHirarchy == 0) {
      this.currentPlan = "Free";
    } else if (this.currentPlanHirarchy == 1) {
      this.currentPlan = "Plus";
    } else if (this.currentPlanHirarchy == 2) {
      this.currentPlan = "Pro";
    } else if (this.currentPlanHirarchy == 4) {
      this.currentPlan = "Business";
    }

    this.categoryList.forEach((category) => {
      if (this.isSubscriptionAvailable == true) {
        if (category.widgetType.toLowerCase() == "calendar") {
          let count = this._widgetUtil.getExistingWidgetCount(
            category.widgetType.toLowerCase()
          );
          if (count >= 1 && this.currentPlanHirarchy <= 1) {
            // category.message = "upgrade_pro";
            category.message = "pro";
          } else {
            category.message = "";
          }
        } else {
          let requireHirarchy = this._widgetUtil.getWidgetRequiredHirarchy(
            category.widgetType
          );
          if (this.checkSubscriptionUpgradeStatus(category.widgetType)) {
            if (requireHirarchy > this.currentPlanHirarchy) {
              if (requireHirarchy == 2) {
                category.message = "pro";
              } else if (requireHirarchy == 4) {
                category.message = "business";
              }
            }
          } else {
            category.message = "";
          }
        }
      }
    });
  };

  selectCategory(category: string) {
    if (!this._subscriptionUtil.checkSubscriptionStatus(category)) {
      if (!this.checkSubscriptionUpgradeStatus(category)) {
        this.openWidgetCategorySetting.emit(category);
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
    } else {
      this.openWidgetCategorySetting.emit(category);
    }
  }

  checkCalendarSubscriptionUpgradeStatus(category: string) {
    return this._widgetUtil.checkCalendarSubscriptionUpgradeStatus(
      category,
      this.currentPlanHirarchy
    );
  }

  checkSubscriptionUpgradeStatus(category: string) {
    let requireHirarchy = this._widgetUtil.getWidgetRequiredHirarchy(category);
    return this._subscriptionUtil.checkSubscriptionUpgradeStatus(
      requireHirarchy,
      this.currentPlanHirarchy
    );
  }

  closeModal() {
    this.widgetsCategoryModal.hide();
  }
}
