import { Component, OnInit } from "@angular/core";
import { Validator } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { LocalStorageService } from "angular-web-storage";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { ToastrService } from "ngx-toastr";
import { DataService } from "src/app/service/data.service";
import { MirrorService } from "src/app/service/mirror.service";
import { WidgetService } from "src/app/service/widget.service";
import { LayoutRequest } from "src/app/util/static-data";

@Component({
  selector: "app-manage-templates",
  templateUrl: "./manage-templates.component.html",
  styleUrls: ["./manage-templates.component.scss"],
})
export class ManageTemplatesComponent implements OnInit {
  customTemplateList = [];
  selectedTemplates = [];
  selectedUserMirrorId = [];

  constructor(
    private route: Router,
    private _dataService: DataService,
    private _mirrorService: MirrorService,
    private toastr: ToastrService,
    private loadingSpinner: Ng4LoadingSpinnerService
  ) {}

  ngOnInit() {
    this._dataService.getCustomTemplateList().subscribe((data) => {
      this.customTemplateList = data;
      this.selectedTemplates = this.customTemplateList;
      this.selectedTemplates.forEach((element) => {
        element["isSelected"] = false;
      });
    });
  }

  discardChanges() {
    this.route.navigate(["user-profile"]);
  }

  resetTemplates() {
    this.selectedUserMirrorId = this.selectedTemplates
      .filter((item) => item.isSelected)
      .map((item) => item.userMirrorId);

    if (this.selectedUserMirrorId.length < 1) {
      this.toastr.error("Please select a template to delete.", "Error");
      return;
    }

    this.loadingSpinner.show();
    this._mirrorService.removeTemplates(this.selectedUserMirrorId).subscribe(
      (res: any) => {
        this.loadingSpinner.hide();
        this._dataService.setCustomTemplateList(res.object);
        this.toastr.success(res.message, "Success");
      },
      (err: any) => {
        this.toastr.error(err.error.message, "Error");
        this.loadingSpinner.hide();
      }
    );
  }
}
