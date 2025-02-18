import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MirrorsettingRoutingModule } from "./mirrorsetting-routing.module";
import { MirrorsettingComponent } from "./mirrorsetting.component";
import { DisplayScheduleComponent } from "./display-schedule/display-schedule.component";
import { RenameMirrorComponent } from "./rename-mirror/rename-mirror.component";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { FormsModule } from "@angular/forms";
import { ModalModule } from "ngx-bootstrap/modal";
import { ConfirmFactoryResetComponent } from "../../templates/confirm-factory-reset/confirm-factory-reset.component";
import { MirrorbgSettingComponent } from "./mirrorbg-setting/mirrorbg-setting.component";
import { SharedModule } from "src/app/shared/shared.module";
import { MirrorOrientationSettingComponent } from "./mirror-orientation-setting/mirror-orientation-setting.component";
import { TimezoneComponent } from "src/app/mirror/mirrorsetting/timezone/timezone.component";
import { UpdateDeviceCodeComponent } from "./update-device-code/update-device-code.component";
import { TemplateUpdateOptionComponent } from "src/app/templates/template-update-option/template-update-option.component";
import { TemplateAddConfirmationComponent } from "src/app/templates/template-add-confirmation/template-add-confirmation.component";
import { GestureSupportComponent } from './gesture-support/gesture-support.component';
import { OverlaySupportComponent } from './overlay-support/overlay-support.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    MirrorsettingComponent,
    DisplayScheduleComponent,
    RenameMirrorComponent,
    ConfirmFactoryResetComponent,
    MirrorbgSettingComponent,
    MirrorOrientationSettingComponent,
    TimezoneComponent,
    UpdateDeviceCodeComponent,
    TemplateUpdateOptionComponent,
    TemplateAddConfirmationComponent,
    GestureSupportComponent,
    OverlaySupportComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    MirrorsettingRoutingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    ModalModule,
  ],
})
export class MirrorsettingModule {}
