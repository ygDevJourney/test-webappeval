import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Validator } from "src/app/util/validator";
import { AuthenticationService } from "src/app/service/authentication.service";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"]
})
export class ForgotPasswordComponent implements OnInit {
  email = {
    value: null,
    error: null
  };

  constructor(
    private route: Router,
    private validator: Validator,
    private toastr: ToastrService,
    private translator: TranslateService,
    private _authService: AuthenticationService
  ) {}

  ngOnInit() {}

  resetPassword() {
    if (this.validator.isEmptyField(this.email.value)) {
      this.email.error = this.translator.instant('ERROR.EMPTYFIELDS');
      return;
    } else if (!this.validator.isValidEmail(this.email.value)) {
      this.email.error = this.translator.instant("ERROR.INVALIDEMAIL");
      return;
    } else {
      this.email.error = null;
      this._authService.forgotPasswordAPI(this.email.value.toLowerCase()).subscribe(
        (res: any) => {
          this.toastr.success(res.message, "Success");
          this.route.navigate(["login"]);
        },
        (err: any) => {
          this.toastr.error(err.error.message, "Error");
        }
      );
    }
  } 
}
