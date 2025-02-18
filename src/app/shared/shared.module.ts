import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UpgradeSubscriptionComponent } from "../templates/upgrade-subscription/upgrade-subscription.component";
import { CustomFilterPipe } from "../pipes/custom-filter.pipe";
import { CustomSortPipe } from "../pipes/custom-sort.pipe";
import { CommonAlertComponent } from "../templates/common-alert/common-alert.component";
import { TemplateComponent } from "../mirror/mirror-setup/template/template.component";
import { TemplateSelectComponent } from "../templates/template-select/template-select.component";
import { ModalModule } from "ngx-bootstrap/modal";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ManageS3BucketComponent } from "../templates/manage-s3-bucket/manage-s3-bucket.component";
import { DragDropDirective } from "../directive/drag-drop.directive";

@NgModule({
  declarations: [
    UpgradeSubscriptionComponent,
    CommonAlertComponent,
    CustomFilterPipe,
    CustomSortPipe,
    TemplateComponent,
    TemplateSelectComponent,
    ManageS3BucketComponent,
    DragDropDirective,
  ],
  imports: [CommonModule, ModalModule, FormsModule, ReactiveFormsModule],
  exports: [
    UpgradeSubscriptionComponent,
    CommonAlertComponent,
    CustomFilterPipe,
    CustomSortPipe,
    TemplateComponent,
    TemplateSelectComponent,
    ManageS3BucketComponent,
    DragDropDirective,
  ],
})
export class SharedModule {}
