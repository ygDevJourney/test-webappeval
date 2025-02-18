import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from "@angular/core";
import { StripePaymentService } from 'src/app/service/stripe-payment.service';
import { LocalStorageService } from 'angular-web-storage';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { OnChanges } from '@angular/core';

declare var Stripe;
@Component({
  selector: "app-upgrade-subscription",
  templateUrl: "./upgrade-subscription.component.html",
  styleUrls: ["./upgrade-subscription.component.scss"]
})
export class UpgradeSubscriptionComponent implements OnInit, OnChanges {
  @Input() upgradeSubscriptionModal: any;
  @Input() newSelectedPlan: any;
  @Input() parentScreen: any;
  @Input() operation: any;
  @Output() stripePopup = new EventEmitter<any>();
  @Output() profileStripePopup = new EventEmitter<any>();

  isNewSubscription = true;
  selected_plan:any;
  isFreeTrial = false;
  activeSubscriptionDetails: any;
  lastTrialDate: any;
  activeSubscription: any
  subscriptionStatus: any;
  currentActivePlan = "";
  activePlan:any;
  stripe:any;
  card;
  cardErrors;
  loading = false;
  isUpdate :boolean;

  constructor(private storage: LocalStorageService, 
    private _paymentService: StripePaymentService,
    private toastr: ToastrService,
    private loadingSpinner: Ng4LoadingSpinnerService) {
      this.selected_plan = "monthly_plan";
    }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (this.operation !== undefined && this.operation !== null) {
    this.validateSubscription();  
    }
  }

  validateSubscription()
  {
    this.activeSubscriptionDetails = this.storage.get("subscriptionObject");
    if(this.activeSubscriptionDetails!=null)
    {
      this.subscriptionStatus = this.activeSubscriptionDetails.subscriptionStatus;
      let trialDate =new Date(this.activeSubscriptionDetails.trialEndDate);
      let expiryDate =new Date(this.activeSubscriptionDetails.expiryDate);
      let currentUtcDate = new Date();
      this.operation="update";
      this.isUpdate = true;
      if(currentUtcDate.getTime()< trialDate.getTime() && this.subscriptionStatus==="trialing")
        {
          this.isFreeTrial = true;
        }else if(this.subscriptionStatus==="canceled"){
          this.operation="create";
          this.isUpdate = false;
          this.isFreeTrial = false;
        }else{
          this.isFreeTrial = false;
        }
    }else{
      this.operation="create";
      this.isUpdate = false;
      this.isFreeTrial = true;
    }
  }

  ngOnInit() {

    this.validateSubscription();
    
    // Create a Stripe client.
    this.stripe = Stripe(environment.stripeKey);
    const elements = this.stripe.elements();

    var styleCard =  {
      'style': {
        'base': {
          'fontFamily': 'Arial, sans-serif',
          'fontSize': '8px',
          'color': '#C1C7CD',
        },
        'Invalid': {  'color': 'red', },
      }
    };
  
    this.card = elements.create('card', {
      hidePostalCode: true,
      style: styleCard
    });
    this.card.mount('#card');
  
    this.card.addEventListener('change', ({ error }) => {
        this.cardErrors = error && error.message;
    });
    this.card.clear();
    if (this.storage.get("subscriptionObject") !== null) {      
      this.isNewSubscription = false
      this.activeSubscriptionDetails = this.storage.get("subscriptionObject");
      this.currentActivePlan = this.activeSubscriptionDetails.productId;      
    }
  }

  createToken(e) {
    e.preventDefault();
    const that = this;
    //that.loadingSpinner.show();
    this.stripe.createToken(this.card).then(function(result) {
      if (result.error!=undefined) {
        // Inform the user if there was an error
        that.loadingSpinner.hide();
        this.card.clear();
        this.cardErrors = result.error.message;        
      } else {
        // Send the token to your server

        let data = {
          stripeTokenId:result.token.id,
          productId: that.selected_plan
        }
        if(that.parentScreen === 'profile')
        {
          that.profileStripePopup.emit({ data: data,operation: that.operation});
        }else
        {
          that.stripePopup.emit({ data: data,operation: that.operation});
        }
        that.card.clear();
        // that.loadingSpinner.hide();
        // that.card.clear();
        // that.dismissModal();
      }
    });
    
  };

  updateSelectedPlan(plan)
  {
    this.selected_plan = plan;
  }


  updatePaymentData(payload)
  {
    this.loadingSpinner.show();
    this._paymentService.activateSubscriptionAPI(payload).subscribe(
      (res: any) => {
        let result = res.object;
        this.loadingSpinner.hide();
        this.toastr.success("Subscription Updated Successfully.");
      },
      (err: any) => {
        this.toastr.error(err.error.message);
        this.loadingSpinner.hide();
      }
    );
  }
  
  dismissModal() {
    this.upgradeSubscriptionModal.hide();
  }
  
}
