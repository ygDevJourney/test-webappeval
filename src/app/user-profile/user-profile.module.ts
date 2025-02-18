import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ModalModule } from "ngx-bootstrap/modal";
import { MDBBootstrapModule } from "angular-bootstrap-md";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import { UserProfileRoutingModule } from "./user-profile-routing.module";
import { UserProfileComponent } from "./user-profile.component";
import { PlansAndPaymentsComponent } from "./plans-and-payments/plans-and-payments.component";
import { AboutComponent } from "./about/about.component";
import { PrivacyPolicyComponent } from "./privacy-policy/privacy-policy.component";
import { TermsAndConditionsComponent } from "./terms-and-conditions/terms-and-conditions.component";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { EditProfileComponent } from "./edit-profile/edit-profile.component";
import { ConfirmProfileDeleteComponent } from "../templates/confirm-profile-delete/confirm-profile-delete.component";
import { UnitMeasureComponent } from "./unit-measure/unit-measure.component";
import { ConfirmDeleteSubscriptionComponent } from "../templates/confirm-delete-subscription/confirm-delete-subscription.component";
import { SharedModule } from "../shared/shared.module";
import { PaymentSuccessComponent } from "../templates/payment-success/payment-success.component";
import { PaymentErrorComponent } from "../templates/payment-error/payment-error.component";
import { UpdateLanguageComponent } from "./update-language/update-language.component";
import { ManageTemplatesComponent } from "../templates/manage-templates/manage-templates.component";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    UserProfileComponent,
    PlansAndPaymentsComponent,
    AboutComponent,
    PrivacyPolicyComponent,
    TermsAndConditionsComponent,
    ChangePasswordComponent,
    EditProfileComponent,
    ConfirmProfileDeleteComponent,
    UnitMeasureComponent,
    ConfirmDeleteSubscriptionComponent,
    PaymentSuccessComponent,
    PaymentErrorComponent,
    UpdateLanguageComponent,
    ManageTemplatesComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule,
    UserProfileRoutingModule,
    ModalModule.forRoot(),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
})
export class UserProfileModule {}
