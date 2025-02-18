import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { ModalDirective } from "angular-bootstrap-md";
import { LocalStorageService } from "angular-web-storage";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { ToastrService } from "ngx-toastr";
import { DataService } from "src/app/service/data.service";

@Component({
  selector: "app-template-update-option",
  templateUrl: "./template-update-option.component.html",
  styleUrls: ["./template-update-option.component.scss"],
})
export class TemplateUpdateOptionComponent implements OnInit {
  @ViewChild("mirrorQuantityAlert", { static: true })
  commonAlertModal: ModalDirective;

  requestType: string;
  deviceType: string = "";
  deviceMacAddress: any = { value: "", error: null };
  mirrorName: any = { value: "New Mango Display", error: null };
  themeName: any = "Simplex";
  isTemplateUpdateSelected: boolean = false;
  customTemplateList: [];

  constructor(
    private storage: LocalStorageService,
    private router: Router,
    private loadingSpinner: Ng4LoadingSpinnerService,
    private toastr: ToastrService,
    private _dataService: DataService
  ) {}

  ngOnInit() {
    this._dataService.getCustomTemplateList().subscribe((data) => {
      this.customTemplateList = data;
    });
  }

  backToMirrorSettingPage() {
    this.router.navigateByUrl("mirrors/setting");
  }

  goToTemplateCreatePage() {
    if (this.customTemplateList.length >= 10) {
      this.commonAlertModal.show();
      return;
    }
    this.router.navigateByUrl("mirrors/setting/template-confirm");
  }

  goToTemplateUpdatePage() {
    this.requestType = "templateUpdate";
    this.isTemplateUpdateSelected = true;
  }

  goBackToOptionPage() {
    this.isTemplateUpdateSelected = false;
  }
}
