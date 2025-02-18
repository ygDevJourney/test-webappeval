import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LocalStorageService } from "angular-web-storage";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { ToastrService } from "ngx-toastr";
import { DataService } from "src/app/service/data.service";
import { MirrorService } from "src/app/service/mirror.service";

@Component({
  selector: "app-template-add-confirmation",
  templateUrl: "./template-add-confirmation.component.html",
  styleUrls: ["./template-add-confirmation.component.scss"],
})
export class TemplateAddConfirmationComponent implements OnInit {
  displayName: any = { value: "", error: null };
  private activeUserMirror: any;
  requestType: string = "templateUpdate";
  isTemplateUpdated: boolean = false;
  name: string;
  themeName: string;
  deviceType: string;
  deviceMacAddress: string;
  mirrorName: string;

  constructor(
    private storage: LocalStorageService,
    private router: Router,
    private loadingSpinner: Ng4LoadingSpinnerService,
    private toastr: ToastrService,
    private _dataService: DataService,
    private _mirrorService: MirrorService
  ) {}

  ngOnInit() {
    this._dataService.getActiveMirrorDetails().subscribe((mirrorDetails) => {
      this.activeUserMirror = mirrorDetails;
      this.name = this.activeUserMirror.mirrorName;
      this.displayName.value = this.name + " Template";
      this.isTemplateUpdated = false;
    });
  }

  saveTemplate() {
    let widgetSetting = this.storage.get("widgetsSetting");
    let payload = this.activeUserMirror;
    payload.mirrorName = this.displayName.value
      .concat(" (")
      .concat(widgetSetting.length)
      .concat(" page)");
    this.loadingSpinner.show();
    this._mirrorService.createTemplate(payload).subscribe(
      (res: any) => {
        this.loadingSpinner.hide();
        this.toastr.success(res.message, "Success");
        this.isTemplateUpdated = true;
        this._dataService.setCustomTemplateList(res.object);
        this.router.navigateByUrl("user-profile/manage-template");
      },
      (err: any) => {
        this.loadingSpinner.hide();
        this.toastr.error(err.error.message, "Error");
      }
    );
  }

  backScreen() {
    this.router.navigateByUrl("mirrors/setting/templateoption");
  }
}
