import { Component, OnInit } from "@angular/core";
import { Validator } from "src/app/util/validator";
import { AuthenticationService } from "src/app/service/authentication.service";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import * as $ from "jquery";
import { LocalStorageService } from "angular-web-storage";
import { Router } from "@angular/router";
import { SupportedLanguage } from "src/app/util/static-data";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent implements OnInit {
  supportedlanguages = SupportedLanguage;
  signupData: any = {
    displayName: { value: null, error: null },
    email: { value: null, error: null },
    gender: { value: "Don't Show", error: null },
    userLocalLanguage: { value: null, error: null },
    password: { value: null, error: null },
    confirmPassword: { value: null, error: null },
  };

  constructor(
    private validator: Validator,
    private translator: TranslateService,
    private toastr: ToastrService,
    private storage: LocalStorageService,
    private route: Router,
    private _authService: AuthenticationService
  ) {}

  ngOnInit() {
    window.scrollTo(0, 0);
    navigator.languages;
    for (let index = 0; index < this.supportedlanguages.length; index++) {
      if (navigator.language.includes(this.supportedlanguages[index].value)) {
        if (navigator.language.indexOf("-") > -1) {
          this.signupData.userLocalLanguage.value = navigator.language.substr(
            0,
            navigator.language.indexOf("-")
          );
        } else {
          this.signupData.userLocalLanguage.value = navigator.language;
        }
        break;
      }
    }
    if (this.signupData.userLocalLanguage.value == null) {
      this.signupData.userLocalLanguage.value = "en";
    }
  }

  signup() {
    if (!this.checkEmptyFields()) {
      return;
    }
    if (!this.validator.isValidDisplayName(this.signupData.displayName.value)) {
      this.signupData.displayName.error =
        this.translator.instant("ERROR.INVALIDENAME");
      return;
    }
    if (!this.validator.isValidEmail(this.signupData.email.value)) {
      this.signupData.email.error =
        this.translator.instant("ERROR.INVALIDEMAIL");
      return;
    }
    if (!this.validator.isValidPassword(this.signupData.password.value)) {
      this.signupData.password.error = this.translator.instant(
        "ERROR.INVALIDPASSWORD"
      );
      return;
    }
    if (
      this.signupData.password.value !== this.signupData.confirmPassword.value
    ) {
      this.signupData.confirmPassword.error = this.translator.instant(
        "ERROR.INVALIDCONFIRMPASSWORD"
      );
      return;
    }

    let data = {
      confirmPassword: this.signupData.confirmPassword.value,
      password: this.signupData.password.value,
      emailId: this.signupData.email.value.toLowerCase(),
      name: this.signupData.displayName.value,
      gender: this.signupData.gender.value,
      userLocalLanguage: this.signupData.userLocalLanguage.value,
      weightUnit: "Pounds",
      waterUnit: "Fluid Ounces(oz)",
      temperatureUnit: "Fahrenheit",
      goalSuccessIcon: "\\u2b50\\ufe0f",
      distanceUnit: "Miles",
      bloodGlucoseUnit: "Mmol",
      source: "webApp",
    };
    this._authService.signupAPI(data).subscribe(
      (res: any) => {
        this.storage.set("userDetails", res.object);
        // this.translator.use(res.object.userLocalLanguage);
        this.route.navigateByUrl("mirrors");
      },
      (err: any) => {
        this.toastr.error(err.error.message);
      }
    );
  }

  checkEmptyFields() {
    for (let object in this.signupData) {
      if (
        this.validator.isEmptyField(this.signupData[object].value) &&
        object !== "gender"
      ) {
        this.signupData[object].error =
          this.translator.instant("ERROR.EMPTYFIELDS");
      } else {
        this.signupData[object].error = null;
      }
    }
    for (let object in this.signupData) {
      if (this.signupData[object].error !== null) {
        return false;
      }
    }
    return true;
  }

  changePasswordType(field: string) {
    if ($("#" + field).attr("type") === "password") {
      $("#" + field).attr("type", "text");
    } else if ($("#" + field).attr("type") === "text") {
      $("#" + field).attr("type", "password");
    }
  }

  validateKeys(event: any) {
    var keyCode = event.which ? event.which : event.keyCode;
    if (
      (keyCode < 65 || keyCode > 90) &&
      (keyCode < 97 || keyCode > 123) &&
      keyCode != 32
    ) {
      return false;
    }
    return true;
  }

  signInRedirect() {
    this.route.navigateByUrl("login");
  }
}
