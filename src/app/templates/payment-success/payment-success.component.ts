import { DOCUMENT } from "@angular/common";
import { Inject } from "@angular/core";
import { Renderer2 } from "@angular/core";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

declare var Stripe;
@Component({
  selector: "app-payment-success",
  templateUrl: "./payment-success.component.html",
  styleUrls: ["./payment-success.component.scss"],
})
export class PaymentSuccessComponent implements OnInit {
  stripe: any;
  user: any;

  constructor(
    private route: Router,
    private renderer2: Renderer2,
    @Inject(DOCUMENT) private _document
  ) {}

  ngOnInit() {
    const fb = this.renderer2.createElement("script");
    fb.type = "text/javascript";
    fb.text = `fbq('track', 'Purchase', {currency: "USD", value: 100.00});`;
    this.renderer2.appendChild(this._document.body, fb);

    const googleadw = this.renderer2.createElement("script");
    googleadw.type = "text/javascript";
    googleadw.text = `
     var myStorage = window.localStorage;
     var user = myStorage.getItem('userDetails');
     user = JSON.parse(user);
    gtag('event', 'conversion', { 'send_to': 'AW-846836024/7pg-CK_a4PYBELji5pMD', 'value': 40.0, 'currency': 'USD', 'user_data': { 'email': user._value.emailId } }); `;
    this.renderer2.appendChild(this._document.body, googleadw);

    const rewardfulw = this.renderer2.createElement("script");
    rewardfulw.type = "text/javascript";
    rewardfulw.text = `var myStorage = window.localStorage;
     var user = myStorage.getItem('userDetails');
     user = JSON.parse(user);
     rewardful('convert', { 'email': user._value.emailId })`;
    this.renderer2.appendChild(this._document.body, rewardfulw);

    // const ticktok = this.renderer2.createElement("script");
    // ticktok.type = "text/javascript";
    // ticktok.text = `var myStorage = window.localStorage;
    // var user = myStorage.getItem('userDetails');
    // user = JSON.parse(user);
    // ttq.identify({email: user._value.emailId, });

    // ttq.track("ViewContent", {
    //   contents: [{content_type: "subscription",},],
    //   value: "80",
    //   currency: "USD",
    // });

    // ttq.track("CompletePayment", {});`;

    // this.renderer2.appendChild(this._document.body, ticktok);

    const rdt = this.renderer2.createElement("script");
    rdt.type = "text/javascript";
    rdt.text = `rdt('track', 'Purchase', {"currency": "USD","value": 100});`;
    this.renderer2.appendChild(this._document.body, rdt);

    const pinterest = this.renderer2.createElement("script");
    pinterest.type = "text/javascript";
    pinterest.text = `pintrk('track', 'checkout', {
                      event_id: 'eventId0001',
                      value: 100,
                      currency: 'USD'
                      })`;
    this.renderer2.appendChild(this._document.body, pinterest);
  }

  updateSubscriptionDetails() {
    this.route.navigate(["mirrors"]);
  }
}
