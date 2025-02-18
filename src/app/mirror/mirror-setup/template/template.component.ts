import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ModalDirective } from "angular-bootstrap-md";
import { ToastrService } from "ngx-toastr";
import { DataService } from "src/app/service/data.service";
import { MirrorService } from "src/app/service/mirror.service";
import { Validator } from "src/app/util/validator";
import {
  calendarImg,
  familyImg,
  healthImg,
  popularImg,
} from "src/app/util/testStatic-data";
import { DomSanitizer } from "@angular/platform-browser";
import { LocalStorageService } from "angular-web-storage";
import { WidgetService } from "src/app/service/widget.service";
import { LayoutRequest } from "src/app/util/static-data";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";

@Component({
  selector: "app-template",
  templateUrl: "./template.component.html",
  styleUrls: ["./template.component.scss"],
})
export class TemplateComponent implements OnInit {
  @ViewChild("templatePreviewAlert", { static: true })
  templateSelectModal: ModalDirective;

  @Input() mirrorName: any;
  @Input() themeName: any;
  @Input() deviceType: string;
  @Input() deviceMacAddress: any;
  @Input() requestType: any;

  templateList = [];
  customTemplateList = [];
  selectedTemplate: any = {};
  activeMirror: any;
  categoryList = [];
  selectedCategory = "popular";
  showTemplateList = [];
  userLanguage: string = "en";

  constructor(
    private router: Router,
    private translator: TranslateService,
    private _dataService: DataService,
    private _mirrorservice: MirrorService,
    private toastr: ToastrService,
    private validator: Validator,
    private sanitizer: DomSanitizer,
    private storage: LocalStorageService,
    private _widgetService: WidgetService,
    private layoutRequest: LayoutRequest,
    private loadingSpinner: Ng4LoadingSpinnerService
  ) {}

  ngOnInit() {
    this._dataService.getTemplateList().subscribe((data) => {
      this.templateList = data;
      this.mapData(this.templateList);
      this.selectedCategory = this.templateList[0].category;
    });

    this._dataService.getCustomTemplateList().subscribe((data) => {
      this.customTemplateList = data;
      if (this.customTemplateList != null) {
        this.categoryList.push("My Templates");
      }
    });
    this.selectedCategory = this.templateList[0].category;
    let userdetail = this.storage.get("userDetails");
    this.userLanguage = userdetail.userLocalLanguage;
  }

  mapData(templateList) {
    this.categoryList = [];
    templateList.forEach((element) => {
      if (this.categoryList.length == 0) {
        this.categoryList.push(element.category);
        this.selectedCategory = element.category;
      } else {
        if (this.categoryList.indexOf(element.category) == -1) {
          this.categoryList.push(element.category);
        }
      }
    });

    this.getTemplateToShow();
  }

  getTemplateToShow() {
    this.showTemplateList = [];
    if (this.selectedCategory != "My Templates") {
      this.templateList.forEach((element) => {
        if (element.category == this.selectedCategory) {
          this.showTemplateList.push(element);
        }
      });
    } else {
      this.customTemplateList.forEach((element) => {
        this.showTemplateList.push(element);
      });
    }

    return this.showTemplateList;
  }

  photoURL(imgUrl) {
    return this.sanitizer.bypassSecurityTrustUrl(imgUrl);
  }

  updateTemplate(template) {
    this.selectedTemplate = template;
    this.templateSelectModal.show();
  }

  templateSelected($event) {
    this.redirect();
  }

  completeRegistration() {
    this.selectedTemplate = {};
    this.redirect();
  }

  redirect() {
    if (this.validator.isEmptyField(this.deviceMacAddress.value)) {
      this.deviceMacAddress.error =
        this.translator.instant("ERROR.EMPTYFIELDS");
      return;
    } else {
      this.mirrorName.error = null;
    }

    this._mirrorservice.getMirrorDetails(this.deviceMacAddress.value).subscribe(
      (res: any) => {
        var mirrorDetails = res.object;
        if (mirrorDetails.isActive === false) {
          this.activate_mirror(mirrorDetails);
        } else {
          this.toastr.error(
            this.translator.instant("ERROR.ALREADY_REGISTER_MIRROR")
          );
          this.router.navigateByUrl("mirrors");
        }
      },
      (err: any) => {
        this.toastr.error(err.error.message, "Error");
      }
    );
  }

  activate_mirror(mirrorDetails: any) {
    if (
      mirrorDetails.deviceType === "Android tablet" ||
      mirrorDetails.deviceType === "Linked Browser"
    ) {
      mirrorDetails.multiUser = false;
      if (mirrorDetails.deviceType != this.deviceType) {
        this.toastr.error("Please make sure device type is correctly selected");
        return;
      }
    }
    this.storage.set("device-type", mirrorDetails.deviceType);
    mirrorDetails["wifissid"] = " ";
    let data = {
      timeZoneId: Intl.DateTimeFormat().resolvedOptions().timeZone,
      mirror: mirrorDetails,
      mirrorName: this.mirrorName.value,
      themeName: this.themeName,
      template: {
        id: this.selectedTemplate.id,
        userMirrorId: this.selectedTemplate.userMirrorId,
      },
      location: this.storage.get("location"),
    };
    if (Object.keys(this.selectedTemplate).length === 0) {
      delete data.template;
    }

    this.loadingSpinner.show();
    this._mirrorservice.activateMirror(data).subscribe(
      (res: any) => {
        this._dataService.setActiveMirrorDetails(res.object.userMirrorModel);
        this.activeMirror = res.object.userMirrorModel;
        this.redirectTolayout();
      },
      (err: any) => {
        this.loadingSpinner.hide();
        this.toastr.error(err.error.message);
      }
    );
  }

  redirectTolayout() {
    if (this.activeMirror !== null) {
      let layoutRequestData = this.layoutRequest.payload;
      layoutRequestData.userMirror.mirror.id = this.activeMirror.mirror.id;
      this.layoutRequest.payload = layoutRequestData;
      this._widgetService.getwidgetLayoutSettings(layoutRequestData).subscribe(
        (res: any) => {
          this.loadingSpinner.hide();
          this.storage.set("layoutrequest", this.layoutRequest);
          this.storage.set("activeWidgetDetails", res.object);
          this.storage.set("widgetsSetting", res.object.widgetSetting);
          this._dataService.setWidgetSettingsLayout(res.object);
          this.storage.set("unsplashList", res.object.unsplngashCollections);
          this.storage.set("activeMirrorDetails", this.activeMirror);
          this.router.navigate(["widgets/layout"]);
        },
        (err: any) => {
          this.loadingSpinner.hide();
          this.toastr.error(err.error.message, "Error");
        }
      );
    }
  }

  updateExistingTemplate($event) {
    let usermirror = this.storage.get("activeMirrorDetails");
    let payload = {
      timeZoneId: Intl.DateTimeFormat().resolvedOptions().timeZone,
      userMirrorId: usermirror.id,
      template: {
        id: this.selectedTemplate.id,
        userMirrorId: this.selectedTemplate.userMirrorId,
      },
    };
    if (Object.keys(this.selectedTemplate).length === 0) {
      delete payload.template;
    }

    this.loadingSpinner.show();
    this._mirrorservice.applyTemplates(payload).subscribe(
      (res: any) => {
        this.loadingSpinner.hide();
        this.toastr.success(res.message, "Success");
        this._dataService.setActiveMirrorDetails(res.object.userMirrorModel);
        this.activeMirror = res.object.userMirrorModel;
        this.redirectTolayout();
      },
      (err: any) => {
        this.loadingSpinner.hide();
        this.toastr.error(err.error.message);
      }
    );
  }

  backToPreviousScreen() {
    this.router.navigateByUrl("/mirrors/setting/templateoption");
  }
}
