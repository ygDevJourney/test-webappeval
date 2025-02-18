import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LocalStorageService } from "angular-web-storage";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { ToastrService } from "ngx-toastr";
import { CalendarService } from "src/app/service/calendar.service";

@Component({
  selector: "app-ics-calendar",
  templateUrl: "./ics-calendar.component.html",
  styleUrls: ["./ics-calendar.component.scss"],
})
export class IcsCalendarComponent implements OnInit, OnChanges {
  @Input() widgetSettingId: number;
  @Input() icsCalendarAlertModal: any;
  @Input() category: any;
  @Output() icsCalendarEventEmiter = new EventEmitter<any>();
  @Output() icsMealPlanEventEmiter = new EventEmitter<any>();

  icsCalendarFormGroup: FormGroup;
  userMirrorObject: any;
  icalAccountSuccess: boolean = true;
  errormessage: String = "";
  placeholdermessage: string = "iCal calendar URL";

  constructor(
    private formBuilder: FormBuilder,
    private storage: LocalStorageService,
    private toastr: ToastrService,
    private loadingSpinner: Ng4LoadingSpinnerService,
    private _calendarService: CalendarService
  ) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes.category != undefined &&
      changes.category.currentValue == "mealplan"
    ) {
      this.placeholdermessage = "Spoonacular personal iCal URL";
    } else if (
      changes.category != undefined &&
      changes.category.currentValue == "calendar"
    ) {
      this.placeholdermessage = "iCal calendar URL";
    }
    this.createIcloudFormGroup();
    this.userMirrorObject = this.storage.get("activeMirrorDetails");
  }

  createIcloudFormGroup() {
    this.icsCalendarFormGroup = this.formBuilder.group({
      icalUrl: ["", Validators.requiredTrue],
    });
  }

  dismissModal() {
    this.icsCalendarAlertModal.hide();
  }

  saveIcsCredentials() {
    let icloudCredential = this.icsCalendarFormGroup.value;
    if (this.category === "mealplan") {
      icloudCredential.accountType = "mealplan";
      if (!icloudCredential.icalUrl.includes("https://spoonacular.com/")) {
        this.errormessage =
          "Unable to connect to the MealPlan URL. Please review the URL provided and try again.";
        this.icalAccountSuccess = false;
        return;
      }
      icloudCredential.icalUrl = decodeURIComponent(icloudCredential.icalUrl);
    } else if (this.category === "calendar") {
      icloudCredential.accountType = "ics";
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

        if (this.category === "mealplan") {
          this.icsMealPlanEventEmiter.emit({
            icloudCredentials: data,
          });
        } else {
          this.icsCalendarEventEmiter.emit({
            icloudCredentials: data,
          });
        }

        this.icsCalendarAlertModal.hide();
      },
      (err: any) => {
        this.icalAccountSuccess = false;
        if (err.error.message == "") {
          this.errormessage = err.error.message;
        } else {
          this.errormessage = err.error.message;
        }
        this.loadingSpinner.hide();
      }
    );
  }

  resetForm() {
    this.icsCalendarFormGroup.reset();
  }
}
