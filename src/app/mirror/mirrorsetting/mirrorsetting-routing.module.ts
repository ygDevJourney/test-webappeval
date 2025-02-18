import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MirrorsettingComponent } from "./mirrorsetting.component";
import { DisplayScheduleComponent } from "./display-schedule/display-schedule.component";
import { RenameMirrorComponent } from "./rename-mirror/rename-mirror.component";
import { MirrorOrientationSettingComponent } from "./mirror-orientation-setting/mirror-orientation-setting.component";
import { UpdateDeviceCodeComponent } from "./update-device-code/update-device-code.component";
import { TemplateUpdateOptionComponent } from "src/app/templates/template-update-option/template-update-option.component";
import { TemplateAddConfirmationComponent } from "src/app/templates/template-add-confirmation/template-add-confirmation.component";
import { GestureSupportComponent } from "./gesture-support/gesture-support.component";

const routes: Routes = [
  { path: "", component: MirrorsettingComponent },
  { path: "schedule-timer", component: DisplayScheduleComponent },
  { path: "rename-mirror", component: RenameMirrorComponent },
  { path: "update-device-code", component: UpdateDeviceCodeComponent },
  { path: "mirror-orientation", component: MirrorOrientationSettingComponent },
  { path: "templateoption", component: TemplateUpdateOptionComponent },
  { path: "template-confirm", component: TemplateAddConfirmationComponent },
  { path: "gesture-support", component: GestureSupportComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MirrorsettingRoutingModule {}
