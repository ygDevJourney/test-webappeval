import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LocalStorageService } from "angular-web-storage";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { ToastrService } from "ngx-toastr";
import { DataService } from "src/app/service/data.service";
import { MirrorService } from "src/app/service/mirror.service";
import { WidgetService } from "src/app/service/widget.service";
import {
  LayoutRequest,
  mirror_orientation_list,
} from "src/app/util/static-data";
import { Validator } from "src/app/util/validator";

@Component({
  selector: "app-mirror-orientation-setting",
  templateUrl: "./mirror-orientation-setting.component.html",
  styleUrls: ["./mirror-orientation-setting.component.scss"],
})
export class MirrorOrientationSettingComponent implements OnInit {
  @Input() orientationModal: any;

  orientationList: any = mirror_orientation_list;
  selected_orientation: number = 0;
  selected_mirror: any;
  selectedLmdSetting: boolean;
  mirror: any;

  constructor(
    private _mirrorService: MirrorService,
    private storage: LocalStorageService,
    private _dataService: DataService,
    private toastr: ToastrService,
    private loadingSpinner: Ng4LoadingSpinnerService,
    private route: Router,
    private validator: Validator,
    private _widgetService: WidgetService,
    private layoutRequest: LayoutRequest
  ) {}

  ngOnInit() {
    this.selected_mirror = this.storage.get("activeMirrorDetails").mirror;
    this.selected_orientation = this.selected_mirror.mirrorOrientation;
    this.selectedLmdSetting = this.selected_mirror.isLmd;
  }

  updateLayoutMatch(lmd) {
    this.selectedLmdSetting = lmd;
  }

  updateLMD() {
    if (this.selected_orientation > 0) {
      this.selectedLmdSetting = true;
    } else {
      this.selectedLmdSetting = false;
    }
  }
  updateOrientation() {
    let payload = {
      deviceId: this.selected_mirror.deviceId,
      mirrorOrientation: this.selected_orientation,
      isLmd: this.selectedLmdSetting,
    };

    let existingOrientation = this.selected_mirror.mirrorOrientation;
    if (
      (this.selected_orientation > 0 && existingOrientation == 0) ||
      (this.selected_orientation == 0 && existingOrientation > 0)
    ) {
      payload["deviceWidth"] = this.selected_mirror.deviceHeight;
      payload["deviceHeight"] = this.selected_mirror.deviceWidth;
    }

    this.loadingSpinner.show();
    this._mirrorService.updateOrientation(payload).subscribe(
      (res: any) => {
        let activeMirrorDetail = this.storage.get("activeMirrorDetails");
        let existingLmd = activeMirrorDetail.mirror.isLmd;
        existingOrientation = activeMirrorDetail.mirror.mirrorOrientation;
        activeMirrorDetail.mirror = res.object;
        this.storage.set("activeMirrorDetails", activeMirrorDetail);
        this._dataService.setActiveMirrorDetails(activeMirrorDetail);
        this.loadingSpinner.hide();
        this.toastr.success("Display orientation set successfully");
        this.orientationModal.hide();
        let isPhone = this.validator.isMobile();
        if (
          ((this.selected_orientation > 0 && existingOrientation == 0) ||
            (this.selected_orientation == 0 && existingOrientation > 0) ||
            activeMirrorDetail.mirror.isLmd != existingLmd) &&
          this.selected_mirror.deviceType != "Linked Browser" &&
          !isPhone
        ) {
          this.storage.set("orientationupdate", this.selected_mirror.deviceId);
          this.route.navigate(["mirrors"]);
        }
      },
      (err: any) => {
        this.loadingSpinner.hide();
        this.toastr.error(err.error.message, "Error");
      }
    );
  }
}
