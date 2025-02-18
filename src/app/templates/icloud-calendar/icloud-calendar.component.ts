import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { LocalStorageService } from "angular-web-storage";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { ToastrService } from "ngx-toastr";
import { CalendarService } from "src/app/service/calendar.service";

@Component({
  selector: "app-icloud-calendar",
  templateUrl: "./icloud-calendar.component.html",
  styleUrls: ["./icloud-calendar.component.scss"],
})
export class IcloudCalendarComponent implements OnInit, OnChanges {
  @Input() widgetSettingId: number;
  @Input() icloudAlertModal: any;
  @Output() icloudCalendarEventEmiter = new EventEmitter<any>();

  icloudCalendarFormGroup: FormGroup;
  selectedAlbum = {
    userName: "",
    password: "",
  };
  isUserCredentialOptionEnabled: boolean = true;
  icloudDefaultMethod = "iCloud Account Authentication";
  widgetLayoutDetails: any;
  imageUrlLink: string = null;
  userMirrorObject: any;
  icalAccountSuccess: boolean = true;
  icloudAuthMethods = [
    "iCloud Account Authentication",
    "iCloud Calendar Public URL",
  ];

  constructor(
    private formBuilder: FormBuilder,
    private storage: LocalStorageService,
    private toastr: ToastrService,
    private loadingSpinner: Ng4LoadingSpinnerService,
    private _calendarService: CalendarService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    // this.createIcloudFormGroup(this.icloudDetails);
    this.createIcloudFormGroup();
    this.userMirrorObject = this.storage.get("activeMirrorDetails");
  }

  createIcloudFormGroup() {
    this.icloudCalendarFormGroup = this.formBuilder.group({
      userName: ["", Validators.requiredTrue],
      password: ["", Validators.requiredTrue],
      icalUrl: ["", Validators.requiredTrue],
    });
  }

  updateIcloudAuthMethod(icloudMethod) {
    console.log(icloudMethod);
    if (icloudMethod == "iCloud Account Authentication") {
      this.resetForm();
      this.isUserCredentialOptionEnabled = true;
      this.icalAccountSuccess = true;
    } else if (icloudMethod == "iCloud Calendar Public URL") {
      this.resetForm();
      this.isUserCredentialOptionEnabled = false;
      this.icalAccountSuccess = true;
    }
  }

  ngOnInit() {
    this.isUserCredentialOptionEnabled = true;
  }

  saveIcloudCredentials() {
    let icloudCredential = this.icloudCalendarFormGroup.value;
    if (this.isUserCredentialOptionEnabled) {
      icloudCredential.accountType = "icalAccount";
    } else {
      icloudCredential.accountType = "icalUrl";
    }

    let payload = {
      userMirrorModel: {
        mirror: {
          id: this.userMirrorObject.mirror.id,
        },
        userRole: this.userMirrorObject.userRole,
      },
      widgetSettingId: this.widgetSettingId,
      icloudCalendarAccountModel: icloudCredential,
    };

    this.loadingSpinner.show();
    this._calendarService.updateIcloudCredentials(payload).subscribe(
      (res: any) => {
        this.resetForm();
        this.loadingSpinner.hide();
        this.icalAccountSuccess = true;
        let data = {
          id: res.object.iCalCalendarAccountModel.id,
          calendarType: res.object.iCalCalendarAccountModel.accountType,
          icalUrl: res.object.iCalCalendarAccountModel.icalUrl,
          sourceAccount: res.object.iCalCalendarAccountModel.userName,
          calendarList: res.object.selectedCalendar,
        };
        this.icloudCalendarEventEmiter.emit({
          icloudCredentials: data,
        });
        this.icloudAlertModal.hide();
      },
      (err: any) => {
        this.resetForm();
        this.icalAccountSuccess = false;
        if (
          err.error.message ===
          "This Account is already Added, Please add another account."
        ) {
          this.toastr.error(err.error.message, "Error");
        } else {
          this.toastr.error(err.error.message, "Error");
        }
        this.loadingSpinner.hide();
      }
    );
  }

  dismissModel() {
    this.isUserCredentialOptionEnabled = true;
    this.icalAccountSuccess = true;
    this.resetForm();
    this.icloudAlertModal.hide();
  }

  updateCalendarOption() {
    this.isUserCredentialOptionEnabled = false;
    this.icalAccountSuccess = true;
    this.resetForm();
  }

  resetForm() {
    this.icloudCalendarFormGroup.reset();
  }
}
