import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LocalStorageService } from "angular-web-storage";
import { Validator } from "src/app/util/validator";
import { TranslateService } from "@ngx-translate/core";
import { ProfileService } from "src/app/service/profile.service";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.scss"]
})
export class ChangePasswordComponent implements OnInit {
  changePassData = {
    oldPassword: { value: null, error: null },
    newPassword: { value: null, error: null },
    confirmNewPassword: { value: null, error: null }
  };

  constructor(
    private storage: LocalStorageService,
    private route: Router,
    private validator: Validator,
    private _profileService: ProfileService,
    private translator: TranslateService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    if (this.storage.get("userDetails") === null) {
      this.storage.clear();
      this.route.navigate(["login"]);
    }
  }

  discardChanges() {
    this.route.navigate(["user-profile"]);
  }

  saveChanges() {
    if (!this.checkEmptyFields()) {
      return;
    }
    if (
      !this.validator.isValidPassword(this.changePassData.newPassword.value)
    ) {
      this.changePassData.newPassword.error = this.translator.instant(
        "ERROR.INVALIDPASSWORD"
      );
      return;
    }
    if (
      this.changePassData.newPassword.value !==
      this.changePassData.confirmNewPassword.value
    ) {
      this.changePassData.confirmNewPassword.error = this.translator.instant(
        "ERROR.INVALIDCONFIRMPASSWORD"
      );
      return;
    }
    let payload = {
      oldPassword: this.changePassData.oldPassword.value,
      newPassword: this.changePassData.newPassword.value,
      confirmPassword: this.changePassData.confirmNewPassword.value
    };
    this._profileService.changePasswordAPI(payload).subscribe(
      (res: any) => {
        this.toastr.success(res.message);
        this.route.navigate(["user-profile"]);
      },
      (err: any) => {
        this.toastr.error(err.error.message);
      }
    );
  }

  checkEmptyFields() {
    for (let object in this.changePassData) {
      if (this.validator.isEmptyField(this.changePassData[object].value)) {
        this.changePassData[object].error = this.translator.instant(
          "ERROR.EMPTYFIELDS"
        );
      } else {
        this.changePassData[object].error = null;
      }
    }
    for (let object in this.changePassData) {
      if (this.changePassData[object].error !== null) {
        return false;
      }
    }
    return true;
  }
}
