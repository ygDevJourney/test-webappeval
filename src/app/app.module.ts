import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";
import {
  HttpClientModule,
  HTTP_INTERCEPTORS,
  HttpClient,
} from "@angular/common/http";
import { AngularWebStorageModule } from "angular-web-storage";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { DeviceDetectorModule } from "ngx-device-detector";
import { ModalModule } from "ngx-bootstrap/modal";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";
import { AuthenticationModule } from "./authentication/authentication.module";
import { WidgetModule } from "./widget/widget.module";
import { UserProfileModule } from "./user-profile/user-profile.module";
import { HttpRequestInterceptor } from "./interceptors/http.interceptor";
import { MDBBootstrapModule } from "angular-bootstrap-md";
import { AngularDraggableModule } from "angular2-draggable";
import { LayoutRequest } from "./util/static-data";
import { AngularEditorModule } from "@kolkov/angular-editor";
import { MangoMirrorConstants } from "./util/constants";
import { Ng4LoadingSpinnerModule } from "ng4-loading-spinner";
import { AgmCoreModule } from "@agm/core";
import { IntercomModule } from "ng-intercom";
import { DatePipe } from "@angular/common";
import { DragulaModule } from "ng2-dragula";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    AngularEditorModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production,
    }),

    AuthenticationModule,
    WidgetModule,
    UserProfileModule,
    DragulaModule.forRoot(),
    MDBBootstrapModule.forRoot(),
    AngularWebStorageModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    DeviceDetectorModule.forRoot(),
    // WebBluetoothModule.forRoot({
    //   enableTracing: true, // or false, this will enable logs in the browser's console
    // }),
    AngularDraggableModule,
    ModalModule.forRoot(),
    Ng4LoadingSpinnerModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyBqEqFJHt-3IzCFOYKj1DUfL_y0p7iFrkI",
      libraries: ["places"],
    }),
    IntercomModule.forRoot({
      appId: "r0j2hyik", // from your Intercom config
      updateOnRouterChange: true, // will automatically run `update` on router event changes. Default: `false`
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      multi: true,
    },
    DatePipe,
    LayoutRequest,
    MangoMirrorConstants,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
