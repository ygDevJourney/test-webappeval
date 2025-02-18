import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ModalModule } from "ngx-bootstrap/modal";
import { MirrorSetupRoutingModule } from "./mirror-setup-routing.module";
import { SetupSuccessComponent } from "./setup-success/setup-success.component";
import { SetupDeviceComponent } from "./setup-device/setup-device.component";
import { SetupWelcomeComponent } from "./setup-welcome/setup-welcome.component";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { SharedModule } from "src/app/shared/shared.module";
import { DeviceHelpComponent } from "./device-help/device-help.component";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    SetupSuccessComponent,
    SetupDeviceComponent,
    SetupWelcomeComponent,
    DeviceHelpComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ModalModule.forRoot(),
    SharedModule,
    MirrorSetupRoutingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
})
export class MirrorSetupModule {}
