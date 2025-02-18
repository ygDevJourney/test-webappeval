import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { DataService } from "src/app/service/data.service";
import { WidgetService } from "src/app/service/widget.service";
import { ToastrService } from "ngx-toastr";
import { LayoutRequest } from "src/app/util/static-data";
import { LocalStorageService } from "angular-web-storage";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-setup-success-screen",
  templateUrl: "./setup-success.component.html",
  styleUrls: ["./setup-success.component.scss"],
})
export class SetupSuccessComponent implements OnInit {
  mirrorName: string = "";
  activeMirror: any;
  deviceType: any;
  constructor(
    private _dataService: DataService,
    private toastr: ToastrService,
    private route: Router,
    private storage: LocalStorageService,
    private _widgetService: WidgetService,
    private layoutRequest: LayoutRequest
  ) {}

  ngOnInit() {
    this._dataService
      .getMirrorName()
      .subscribe((mirrorName) => (this.mirrorName = mirrorName));
    this._dataService.getActiveMirrorDetails().subscribe((mirrorDetail) => {
      this.activeMirror = mirrorDetail;
      this.deviceType = mirrorDetail.mirror.deviceType;
    });
  }

  redirect() {
    if (this.activeMirror !== null) {
      let layoutRequestData = this.layoutRequest.payload;
      layoutRequestData.userMirror.mirror.id = this.activeMirror.mirror.id;
      this.layoutRequest.payload = layoutRequestData;
      this._widgetService.getwidgetLayoutSettings(layoutRequestData).subscribe(
        (res: any) => {
          this.storage.set("layoutrequest", this.layoutRequest);
          this.storage.set("activeWidgetDetails", res.object);
          this.storage.set("widgetsSetting", res.object.widgetSetting);
          this._dataService.setWidgetSettingsLayout(res.object);
          this.storage.set("unsplashList", res.object.unsplngashCollections);
          this.storage.set("activeMirrorDetails", this.activeMirror);
          this.route.navigate(["widgets/layout"]);
        },
        (err: any) => {
          this.toastr.error(err.error.message, "Error");
        }
      );
    }
  }

  getDynamicPortalURL() {
    if (this.activeMirror) {
      return (
        environment.portalBaseURL +
        "?major=" +
        this.activeMirror.mirror.major +
        "&minor=" +
        this.activeMirror.mirror.minor +
        "&macaddress=" +
        this.activeMirror.mirror.deviceId
      );
    }
  }
}
