import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClient } from "@angular/common/http";
import { MirrorRoutingModule } from "./mirror-routing.module";
import { MirrorComponent } from "./mirror.component";
import { SharedModule } from "../shared/shared.module";
import { ModalModule } from "ngx-bootstrap/modal";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [MirrorComponent],
  imports: [
    FormsModule,
    CommonModule,
    ModalModule,
    SharedModule,
    MirrorRoutingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
})
export class MirrorModule {}
