import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { DataService } from "src/app/service/data.service";
import { MirrorService } from "src/app/service/mirror.service";
import { Validator } from "src/app/util/validator";

@Component({
  selector: "app-update-device-code",
  templateUrl: "./update-device-code.component.html",
  styleUrls: ["./update-device-code.component.scss"],
})
export class UpdateDeviceCodeComponent implements OnInit {
  displayDeviceCode: any = { value: "", error: null };
  updatedDeviceCode: any = { value: "", error: null };
  mirrorName: any = { value: "", error: null };
  private activeUserMirror: any;

  constructor(
    private router: Router,
    private validator: Validator,
    private translator: TranslateService,
    private _dataService: DataService,
    private _mirrorService: MirrorService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this._dataService.getActiveMirrorDetails().subscribe((mirrorDetails) => {
      this.activeUserMirror = mirrorDetails;
      this.displayDeviceCode.value = this.activeUserMirror.mirror.deviceId;
      this.mirrorName.value = this.activeUserMirror.mirrorName;
    });
  }

  updateDisplayDeviceCode() {
    if (this.validator.isEmptyField(this.updatedDeviceCode.value)) {
      this.updatedDeviceCode.error =
        this.translator.instant("ERROR.EMPTYFIELDS");
      return;
    } else {
      let displayRequestData = {
        id: 1030,
        deviceId: "testid",
      };

      displayRequestData.id = this.activeUserMirror.mirror.id;
      displayRequestData.deviceId = this.updatedDeviceCode.value.toUpperCase();

      if (
        displayRequestData.deviceId == this.activeUserMirror.mirror.deviceId
      ) {
        this.toastr.error(
          "Same device id is used for update. Existing and new device ID could not be same",
          "Error",
          {
            timeOut: 5000,
          }
        );
        return;
      }

      this._mirrorService.updateDeviceCode(displayRequestData).subscribe(
        (res: any) => {
          this.displayDeviceCode.error = null;
          this.activeUserMirror.mirror.deviceId = this.updatedDeviceCode.value;
          this._dataService.setDisplayCode(this.updatedDeviceCode.value);
          this._dataService.setActiveMirrorDetails(this.activeUserMirror);
          this.toastr.success(
            "Display Device Code has been successfully updated! Relaunch the app to view changes.",
            "Success"
          );
          this.backToMirrorSettingPage();
        },
        (err: any) => {
          this.toastr.error(err.error.message, "Error", {
            timeOut: 6000,
          });
        }
      );
    }
  }

  backToMirrorSettingPage() {
    this.router.navigateByUrl("mirrors/setting");
  }
}
