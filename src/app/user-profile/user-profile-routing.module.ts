import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { UserProfileComponent } from "./user-profile.component";
import { AboutComponent } from "./about/about.component";
import { PrivacyPolicyComponent } from "./privacy-policy/privacy-policy.component";
import { TermsAndConditionsComponent } from "./terms-and-conditions/terms-and-conditions.component";
import { PlansAndPaymentsComponent } from "./plans-and-payments/plans-and-payments.component";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { EditProfileComponent } from "./edit-profile/edit-profile.component";
import { UnitMeasureComponent } from "./unit-measure/unit-measure.component";
import { PaymentSuccessComponent } from "../templates/payment-success/payment-success.component";
import { PaymentErrorComponent } from "../templates/payment-error/payment-error.component";
import { UpdateLanguageComponent } from "./update-language/update-language.component";
import { ManageTemplatesComponent } from "../templates/manage-templates/manage-templates.component";
import { ManageS3BucketComponent } from "../templates/manage-s3-bucket/manage-s3-bucket.component";

const routes: Routes = [
  { path: "", component: UserProfileComponent },
  { path: "edit-profile", component: EditProfileComponent },
  { path: "change-password", component: ChangePasswordComponent },
  { path: "about-us", component: AboutComponent },
  { path: "privacy-policy", component: PrivacyPolicyComponent },
  { path: "terms-and-conditions", component: TermsAndConditionsComponent },
  { path: "plans-and-payments", component: PlansAndPaymentsComponent },
  { path: "unit-of-measure", component: UnitMeasureComponent },
  { path: "payment-success", component: PaymentSuccessComponent },
  { path: "payment-error", component: PaymentErrorComponent },
  { path: "updateLanguage", component: UpdateLanguageComponent },
  { path: "manage-template", component: ManageTemplatesComponent },
  { path: "manage-s3-bucket", component: ManageS3BucketComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserProfileRoutingModule {}
