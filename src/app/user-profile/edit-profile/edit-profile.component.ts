import { Component, OnInit, ViewChild } from "@angular/core";
import { LocalStorageService } from "angular-web-storage";
import { Router } from "@angular/router";
import { Validator } from "src/app/util/validator";
import { ProfileService } from "src/app/service/profile.service";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ModalDirective } from "ngx-bootstrap/modal/public_api";

@Component({
  selector: "app-edit-profile",
  templateUrl: "./edit-profile.component.html",
  styleUrls: ["./edit-profile.component.scss"]
})
export class EditProfileComponent implements OnInit {
  userId: any;
  userName: any;
  userGender: any;
  invalidUsername = null;
  isSaveClicked = false;

  @ViewChild("confirmProfileDelete", { static: true })
  confirmProfileDeleteModal: ModalDirective;

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
    } else {
      this.userId = this.storage.get("userDetails").id;
      this.userName = this.storage.get("userDetails").name;
      this.userGender = this.storage.get("userDetails").gender;
    }
  }

  saveChanges() {
    if (this.validator.isEmptyField(this.userName)) {
      this.invalidUsername = this.translator.instant("ERROR.EMPTYFIELDS");
    } else {
      this.invalidUsername = null;
    }
    this.isSaveClicked = true;
    let payload = {
      name: this.userName,
      gender: this.userGender
    };
    this._profileService.editProfileAPI(payload).subscribe(
      (res: any) => {
        this.isSaveClicked = false;
        let userDetails = this.storage.get("userDetails");
        userDetails.name = this.userName;
        userDetails.gender = this.userGender;
        this.storage.set("userDetails", userDetails);
        this.route.navigate(["user-profile"]);
        this.toastr.success("Profile updated successfully.");
      },
      (err: any) => {
        this.isSaveClicked = false;
        this.toastr.error(err.error.message);
      }
    );
  }

  deleteProfile() {
    this._profileService.deleteProfile().subscribe(
      (res: any) => {
        this.confirmProfileDeleteModal.hide();
        this.storage.clear();
        this.route.navigate(["login"]);
      },
      (err: any) => {
        this.toastr.error(err.error.message);
      }
    );
  }

  discardChanges() {
    this.route.navigate(["user-profile"]);
  }
}
