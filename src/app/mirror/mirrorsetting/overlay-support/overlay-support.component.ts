import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { LocalStorageService } from "angular-web-storage";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { ToastrService } from "ngx-toastr";
import { first } from "rxjs/operators";
import { DataService } from "src/app/service/data.service";
import { MirrorService } from "src/app/service/mirror.service";
import { WidgetService } from "src/app/service/widget.service";
import { MangoMirrorConstants } from "src/app/util/constants";

@Component({
  selector: "app-overlay-support",
  templateUrl: "./overlay-support.component.html",
  styleUrls: ["./overlay-support.component.scss"],
})
export class OverlaySupportComponent implements OnInit {
  @Input() activeMirror: any;
  @Output() emitGestureSetting = new EventEmitter<any>();
  @Input() overlayModal: any;

  widgetLayoutDetails: any;

  overlay = {
    santa: false,
    elf: false,
    stringLight: false,
    snow: false,
    firework: false,
    flBalloon: false,
    flHeart: false,
    bsHeart: false,
  };

  accountList: any[];

  constructor(
    private storage: LocalStorageService,
    private _mirrorService: MirrorService,
    private _dataService: DataService,
    private loadingSpinner: Ng4LoadingSpinnerService,
    private toastr: ToastrService
  ) {}

  ngOnChanges(changes: any) {
    if (changes.activeMirror) {
      this.activeMirror = this.storage.get("activeMirrorDetails");
      if (this.activeMirror.mirror.backgroundSetting.gesture != undefined) {
        console.log(this.activeMirror.mirror.backgroundSetting.overlay);
        this.overlay = {
          ...this.overlay,
          ...JSON.parse(this.activeMirror.mirror.backgroundSetting.overlay),
        };
      }
    }
  }

  ngOnInit() {
    this._dataService
      .getWidgetSettingsLayout()
      .subscribe((widgetLayoutDetails) => {
        this.widgetLayoutDetails = widgetLayoutDetails;
      });
  }

  updateOverlay() {
    let payload = {
      deviceId: this.activeMirror.mirror.deviceId,
      backgroundSetting: {
        id: this.activeMirror.mirror.backgroundSetting.id,
        overlay: JSON.stringify(this.overlay),
      },
    };

    this.loadingSpinner.show();
    this._mirrorService.updateOverlay(payload).subscribe(
      (res: any) => {
        this.activeMirror.mirror.backgroundSetting.overlay = JSON.stringify(
          this.overlay
        );
        this.loadingSpinner.hide();
        this._dataService.setActiveMirrorDetails(this.activeMirror);
        this.storage.set("activeMirrorDetails", this.activeMirror);
        this.overlayModal.hide();
      },
      (err: any) => {
        this.loadingSpinner.hide();
        this.toastr.error(err.error.message, "Error");
      }
    );
  }

  dismissModel() {
    this.overlayModal.hide();
  }
}
