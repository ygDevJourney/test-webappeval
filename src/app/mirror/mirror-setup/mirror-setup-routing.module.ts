import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SetupWelcomeComponent } from "./setup-welcome/setup-welcome.component";
import { SetupDeviceComponent } from "./setup-device/setup-device.component";
import { SetupSuccessComponent } from "./setup-success/setup-success.component";
import { TemplateComponent } from "./template/template.component";

const routes: Routes = [
  // { path: '', component: SetupWelcomeComponent },
  { path: "", component: SetupDeviceComponent },
  { path: "template", component: TemplateComponent },
  { path: "setup-success", component: SetupSuccessComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MirrorSetupRoutingModule {}
