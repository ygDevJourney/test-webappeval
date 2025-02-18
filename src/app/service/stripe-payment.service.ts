import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StripePaymentService {

  constructor(private http: HttpClient) { }

  activateSubscriptionAPI(payload: any) {
    return this.http.post(environment.baseURL+"payment", payload);
  }

  updateSubscriptionAPI(payload: any) {
    return this.http.post(environment.baseURL+"payment", payload);
  }

  getSubscriptionDetail() {
    return this.http.get(environment.baseURL+"payment");
  }
  
  updateSubscriptionPlan(payload: any) {
    return this.http.put(environment.baseURL+"payment/updateSubscriptionPlan",payload);
  }

  cancelSubscriptionPlan() {
    return this.http.delete(environment.baseURL+"payment");
  }

  getStripePortalSession() {
    return this.http.get(environment.baseURL+"payment/stripePortalSession");
  }

  initiateFreeTrial() {
    return this.http.put(environment.baseURL+"payment/initialSubscription",{});
  }

  getCheckoutSession(payload: any) {
    return this.http.post(environment.baseURL+"payment/stripeCheckoutSession",payload);
  }

  updateSubscriptionData() {
    return this.http.put(environment.baseURL+"payment/updateSubscription",{});
  }

}
