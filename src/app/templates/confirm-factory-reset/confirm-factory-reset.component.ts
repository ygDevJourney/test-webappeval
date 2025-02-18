import { Component, OnInit, Input, OnChanges } from "@angular/core";
import { MirrorService } from "src/app/service/mirror.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { LocalStorageService } from "angular-web-storage";

@Component({
  selector: "app-confirm-factory-reset",
  templateUrl: "./confirm-factory-reset.component.html",
  styleUrls: ["./confirm-factory-reset.component.scss"]
})
export class ConfirmFactoryResetComponent implements OnInit, OnChanges {
  @Input() confirmFactoryResetModal: any;
  @Input() macAddress: any;
  @Input() mirrorName: any;

  constructor(
    private _mirrorService: MirrorService,
    private toastr: ToastrService,
    private router: Router,
    private storage: LocalStorageService,
  ) {}

  ngOnInit() { }

  ngOnChanges(change: any) { }

  resetMirror() {
    if (this.macAddress != null) {
      this._mirrorService.resetMirror(this.macAddress).subscribe(
        (res: any) => {
          this.storage.remove("widgetsSetting");
          this.storage.remove("activeMirrorDetails");
          this.storage.remove("activeWidgetDetails");
          this.router.navigateByUrl("mirrors");
        },
        (err: any) => {
          this.toastr.error(err.error.message);
        }
      );
    }
  }
}
