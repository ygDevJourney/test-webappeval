import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Validator } from "src/app/util/validator";
import { TranslateService } from "@ngx-translate/core";
import { DataService } from "src/app/service/data.service";
import { MirrorService } from "src/app/service/mirror.service";
import { ToastrService } from "ngx-toastr";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { AppSettings } from "src/app/service/app.settings";
import { ThemeCategory } from "src/app/util/static-data";
import { ViewChild } from "@angular/core";
import { ModalDirective } from "ngx-bootstrap/modal";
import { LocalStorageService } from "angular-web-storage";

@Component({
  selector: "app-select-device-type",
  templateUrl: "./setup-device.component.html",
  styleUrls: ["./setup-device.component.scss"],
})
export class SetupDeviceComponent implements OnInit {
  @ViewChild("devicehelp", { static: true })
  public deviceHelpModal: ModalDirective;

  deviceType: string = "";
  subDeviceType: string = "";
  deviceMacAddress: any = { value: "", error: null };
  mirrorName: any = { value: "My Mango Display", error: null };
  setupState: string = "state1";
  themeCategoryList = [];
  deviceIdSaved: any = false;
  isActiveFlagInterval: any;
  randomNumber: any;
  themeName: any = "Simplex";
  requestType: string = "deviceSetup";

  constructor(
    private router: Router,
    private storage: LocalStorageService,
    private validator: Validator,
    private translator: TranslateService,
    private _dataService: DataService,
    private _mirrorservice: MirrorService,
    private toastr: ToastrService,
    private loadingSpinner: Ng4LoadingSpinnerService
  ) {}

  ngOnInit() {
    this.updateMirroName("New Mango Display");
    this.themeCategoryList = ThemeCategory;
  }

  updateMirroName(updatedMirrorName: string) {
    this._dataService.setMirrorName(updatedMirrorName);
  }

  gotoHomeScreen() {
    this.router.navigateByUrl("mirrors");
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
    mirrorDetails["wifissid"] = " ";
    let data = {
      timeZoneId: Intl.DateTimeFormat().resolvedOptions().timeZone,
      mirror: mirrorDetails,
      mirrorName: this.mirrorName.value,
      themeName: this.themeName,
      location: this.storage.get("location"),
    };

    this._mirrorservice.activateMirror(data).subscribe(
      (res: any) => {
        this._dataService.setActiveMirrorDetails(res.object.userMirrorModel);
        this.router.navigateByUrl("mirrors/setup/setup-success");
      },
      (err: any) => {
        this.toastr.error(err.error.message);
      }
    );
  }

  test() {
    this.deviceHelpModal.show();
  }

  changeState(state: string) {
    if (state === "state1") {
      this.setupState = state;
    } else if (state === "state2") {
      if (this.validator.isEmptyField(this.deviceType)) {
        this.toastr.error(
          this.translator.instant("ERROR.EMPTYFIELDS"),
          "Error"
        );
        return;
      }
      this.setupState = state;
    } else if (state === "state3") {
      if (
        this.validator.isEmptyField(this.mirrorName.value) ||
        this.validator.isEmptyField(this.deviceType) ||
        this.validator.isEmptyField(this.themeName)
      ) {
        if (this.validator.isEmptyField(this.mirrorName.value)) {
          this.deviceMacAddress.error =
            this.translator.instant("ERROR.EMPTYFIELDS");
          this.shakeButton("mc_name_next");
        }
        return;
      } else if (this.deviceType === "Linked Browser") {
        this.onRandomNumber();
        this.setupState = "state4";
      } else {
        this.setupState = state;
        this.mirrorName.error = null;
      }
    } else if (state === "state4") {
      if (this.validator.isEmptyField(this.deviceMacAddress.value)) {
        this.deviceMacAddress.error =
          this.translator.instant("ERROR.EMPTYFIELDS");
        this.shakeButton("mc_address_next");
        return;
      }
      this.deviceMacAddress.error = null;
      this.getDeviceDetails(this.deviceMacAddress.value.trim());
    }
  }

  shakeButton(buttonId) {
    const button = document.getElementById(buttonId);
    button.classList.add("shake");
    setTimeout(() => button.classList.remove("shake"), 500);
  }

  onRandomNumber() {
    this.randomNumber = this.getRandomNumber();
    this.deviceMacAddress.value = this.randomNumber;
    this.getDeviceDetails(this.randomNumber);
  }

  getDeviceDetails(randomNum) {
    this._mirrorservice.getDeviceDetails(randomNum.toUpperCase()).subscribe(
      (res: any) => {
        const responseObject: any = res && res.object ? res.object : null;
        if (this.deviceType != "Linked Browser") {
          if (!responseObject.isActive) {
            this.setupState = "state4";
          } else {
            this.toastr.error("This display is already registered", "Error");
          }
        } else {
          this.randomNumber = randomNum;
          if (
            responseObject &&
            !responseObject.isActive &&
            responseObject.deviceType === "Linked Browser"
          ) {
            // Nothing to call
          } else {
            this.getDeviceDetails(this.getRandomNumber());
          }
        }
      },
      (err: any) => {
        if (err && err.error) {
          if (
            this.deviceType === "Linked Browser" &&
            err.error.message ===
              "Unable to register device. Please check that the Display Device Code is entered correctly"
          ) {
            this.onAddDeviceId();
          } else {
            this.toastr.error(err.error.message, "Error");
          }
        }
      }
    );
  }

  getRandomNumber() {
    let randomNum: any = Math.floor(1000000000 + Math.random() * 9000000000);
    randomNum = AppSettings.DEVICE_ID_INITIALS + randomNum;
    this.randomNumber = randomNum;
    return randomNum;
  }

  onAddDeviceId() {
    const is12Hour = Intl.DateTimeFormat(navigator.language, {
      hour: "numeric",
    }).resolvedOptions().hour12;

    const deviceDetails: any = {
      delay: 60,
      deviceId: this.randomNumber,
      deviceMode: "portrait",
      deviceType: AppSettings.DEVICE_TYPE_BROWSER,
      isBeaconEnabled: false,
      is24HourFormat: !is12Hour,
    };

    this._mirrorservice.addDeviceId(deviceDetails).subscribe((res) => {
      this.deviceIdSaved = this.randomNumber;
      const that = this;
      this.deviceMacAddress.value = that.randomNumber;
      // this.redirect();
    });
  }

  callToDynamicURLs(major, minor, macaddress) {
    this._mirrorservice.callToTestPortal(major, minor, macaddress).subscribe();
  }
}
