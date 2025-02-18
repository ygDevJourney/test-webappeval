import { Component, OnInit } from "@angular/core";
import { Validator } from "src/app/util/validator";
import { AuthenticationService } from "src/app/service/authentication.service";
import * as $ from "jquery";
import { ToastrService } from "ngx-toastr";
import { LocalStorageService } from "angular-web-storage";
import { __values } from "tslib";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  emailErrorMessage = null;
  passwordErrorMessage = null;

  constructor(
    private validator: Validator,
    private toastr: ToastrService,
    private storage: LocalStorageService,
    private route: Router,
    private translator: TranslateService,
    private _authService: AuthenticationService
  ) {}

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  login() {
    if (!this.validateFields()) {
      return;
    } else if (!this.validator.isValidEmail(this.email)) {
      this.emailErrorMessage = this.translator.instant("ERROR.INVALIDEMAIL");
      return;
    } else if (!this.validator.isValidPassword(this.password)) {
      this.passwordErrorMessage = this.translator.instant(
        "ERROR.INVALIDPASSWORD"
      );
      return;
    } else {
      this._authService
        .loginAPI(this.email.toLowerCase(), this.password)
        .subscribe(
          (res: any) => {
            this.storage.set("userDetails", res.object.userDetail);
            this.storage.set("widgetGoalList", res.object.widgetGoalList);
            this.route.navigateByUrl("mirrors");
            // this.translator.use(res.object.userDetail.userLocalLanguage);
          },
          (err: any) => {
            this.toastr.error(err.error.message, "Error");
          }
        );
    }
  }

  changePasswordType() {
    if ($("#password").attr("type") === "password") {
      $("#password").attr("type", "text");
    } else if ($("#password").attr("type") === "text") {
      $("#password").attr("type", "password");
    }
  }

  validateFields() {
    if (this.validator.isEmptyField(this.email)) {
      this.emailErrorMessage = this.translator.instant("ERROR.EMPTYFIELDS");
    } else {
      this.emailErrorMessage = null;
    }
    if (this.validator.isEmptyField(this.password)) {
      this.passwordErrorMessage = this.translator.instant("ERROR.EMPTYFIELDS");
    } else {
      this.passwordErrorMessage = null;
    }
    if (this.emailErrorMessage !== null || this.passwordErrorMessage !== null) {
      return false;
    } else {
      return true;
    }
  }

  signupRedirect() {
    this.route.navigateByUrl("signup");
  }
}
