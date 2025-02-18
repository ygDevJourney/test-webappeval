import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LocalStorageService } from 'angular-web-storage';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';
import { StripePaymentService } from 'src/app/service/stripe-payment.service';

@Component({
  selector: 'app-confirm-profile-delete',
  templateUrl: './confirm-profile-delete.component.html',
  styleUrls: ['./confirm-profile-delete.component.scss']
})
export class ConfirmProfileDeleteComponent implements OnInit {
  @Input() confirmProfileDeleteModal: any;
  @Output() confirmedProfileDelete = new EventEmitter();
  isSubscriptionAvailable = false;

  constructor(private storage: LocalStorageService,
    private _paymentService: StripePaymentService,
    private toastr: ToastrService,
    private loadingSpinner: Ng4LoadingSpinnerService ) { }

  ngOnInit() {

    this.getSubsccriptionObject();

  }

  deleteProfile(){
    this.confirmedProfileDelete.emit();
  }

  getSubsccriptionObject()
  {
    
    this.loadingSpinner.show();
    this._paymentService.getSubscriptionDetail().subscribe(
          (res: any) => {
            this.loadingSpinner.hide();
            let subscriptionObject = res.object;
            this.storage.set("subscriptionObject",subscriptionObject);
            let subscription = this.storage.get("subscriptionDetails");
            if(subscription!=null && subscription.isLifeTimeSubscriptionAvailable){
              this.isSubscriptionAvailable = false;
              return;
            } 
          
          if(subscriptionObject!=null){
            let expiryDate =new Date(subscriptionObject.expiryDate);
            let currentUtcDate = new Date();
            if((subscriptionObject.subscriptionStatus!=null && subscriptionObject.subscriptionStatus != 'canceled')
              || (currentUtcDate.getTime()<= expiryDate.getTime() && 
              (subscriptionObject.subscriptionStatus == 'active' || subscriptionObject.subscriptionStatus == 'trialing')))
              {
                this.isSubscriptionAvailable = true;
              }
            }
          },
          (err: any) => {
            this.toastr.error(err.error.message);
            this.loadingSpinner.hide();
          }
        );
  }

}
