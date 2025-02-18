import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { LocalStorageService } from "angular-web-storage";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { ToastrService } from "ngx-toastr";
import { timeout } from "rxjs/operators";
import { DataService } from "src/app/service/data.service";
import { MirrorService } from "src/app/service/mirror.service";
import { WidgetService } from "src/app/service/widget.service";
import { MangoMirrorConstants } from "src/app/util/constants";

@Component({
  selector: "app-gesture-support",
  templateUrl: "./gesture-support.component.html",
  styleUrls: ["./gesture-support.component.scss"],
})
export class GestureSupportComponent implements OnInit, OnChanges {
  @ViewChild("calendarAccountDetails", { static: false })
  calendarAccountDetails: ElementRef;
  showDetails = false;

  @Input() activeMirror: any;
  @Output() emitGestureSetting = new EventEmitter<any>();
  @Input() gestureModal: any;
  @Input() userCredentials: any;
  widgetLayoutDetails: any;

  gesture = {
    touch_page_swipe: true,
    touch_page_hold: true,
    touch_todo_complete: true,
    touch_chores_complete: true,
    touch_calendar_scroll: true,
    touch_calendar_edit: false,
  };

  accountList: any[];

  constructor(
    private storage: LocalStorageService,
    private _mirrorService: MirrorService,
    private _dataService: DataService,
    private _widgetService: WidgetService,
    private loadingSpinner: Ng4LoadingSpinnerService,
    private toastr: ToastrService
  ) {}

  ngOnChanges(changes: any) {
    if (changes.activeMirror) {
      this.activeMirror = this.storage.get("activeMirrorDetails");
      if (this.activeMirror.mirror.backgroundSetting.gesture != undefined) {
        this.gesture = {
          ...this.gesture,
          ...JSON.parse(this.activeMirror.mirror.backgroundSetting.gesture),
        };
      }
    }

    if (
      this.userCredentials !== null &&
      this.userCredentials.type == "google"
    ) {
      if (
        this.userCredentials.code.includes("access_denied") ||
        this.userCredentials.code.includes(
          MangoMirrorConstants.GOOGLE_PERMISSION_ERROR
        )
      ) {
        if (
          this.userCredentials.code.includes(
            MangoMirrorConstants.GOOGLE_PERMISSION_ERROR
          )
        ) {
          this.toastr.error(
            MangoMirrorConstants.GOOGLE_PERMISSION_ERROR_MESSAGE,
            "Error",
            { timeOut: 5000 }
          );
        }
        this.storage.remove("googleAuthCode");
        this.storage.remove("auth_google_calendar");
        this.userCredentials = null;
      } else {
        this.gesture.touch_calendar_edit = true;
        let payload = {
          authorizationCode: this.userCredentials.code,
        };
        this.updateGoogleCalendarCredentials(payload);
      }
    } else if (
      this.userCredentials !== null &&
      this.userCredentials.type == "outlook"
    ) {
      if (
        this.userCredentials.code.includes("access_denied") ||
        this.userCredentials.code.includes(
          MangoMirrorConstants.OUTLOOK_PERMISSION_ERROR
        )
      ) {
        if (
          this.userCredentials.code.includes(
            MangoMirrorConstants.OUTLOOK_PERMISSION_ERROR
          )
        ) {
          this.toastr.error(
            MangoMirrorConstants.OUTLOOK_PERMISSION_ERROR_MESSAGE,
            "Error",
            { timeOut: 5000 }
          );
        }
        this.storage.remove("outlookAuthCode");
        this.storage.remove("auth_outlook_calendar");
        this.userCredentials = null;
      } else {
        this.gesture.touch_calendar_edit = true;
        let payload = {
          authorizationCode: this.userCredentials.code,
        };
        this.updateOutlookCalendarCredentials(payload);
      }
    }
  }

  ngOnInit() {
    this._dataService.getAddedCalendarAccountList().subscribe((data) => {
      this.accountList = data;
      let isCalendarHaveWriteAccess = false;
      if (this.accountList != null && this.accountList.length > 0) {
        this.accountList.forEach((element) => {
          if (element.isWriteAccess) {
            isCalendarHaveWriteAccess = true;
          }
        });
      }

      if (isCalendarHaveWriteAccess == false) {
        this.gesture.touch_calendar_edit = false;
      }
    });

    this._dataService
      .getWidgetSettingsLayout()
      .subscribe((widgetLayoutDetails) => {
        this.widgetLayoutDetails = widgetLayoutDetails;
      });
  }

  updateGesture() {
    let isCalendarHaveWriteAccess = false;
    if (this.accountList != null && this.accountList.length > 0) {
      this.accountList.forEach((element) => {
        if (element.isWriteAccess) {
          isCalendarHaveWriteAccess = true;
        }
      });
    }

    if (
      this.gesture.touch_calendar_edit == true ||
      this.accountList.length == 0
    ) {
      if (isCalendarHaveWriteAccess == false) {
        this.gesture.touch_calendar_edit = false;
      }
    }

    let payload = {
      deviceId: this.activeMirror.mirror.deviceId,
      backgroundSetting: {
        id: this.activeMirror.mirror.backgroundSetting.id,
        gesture: JSON.stringify(this.gesture),
      },
    };

    this.loadingSpinner.show();
    this._mirrorService.updateGesture(payload).subscribe(
      (res: any) => {
        this.activeMirror.mirror.backgroundSetting.gesture = JSON.stringify(
          this.gesture
        );
        this.loadingSpinner.hide();
        this._dataService.setActiveMirrorDetails(this.activeMirror);
        this.storage.set("activeMirrorDetails", this.activeMirror);
        this.gestureModal.hide();
      },
      (err: any) => {
        this.loadingSpinner.hide();
        this.toastr.error(err.error.message, "Error");
      }
    );
  }

  dismissModel() {
    this.gestureModal.hide();
  }

  updateGrantAccess(account) {
    let data = { type: "gesture", account: account.sourceAccount };
    if (account.calendarType == "google") {
      this.storage.set("auth_google_calendar", data);
      this._widgetService.addNewGoogleAccount(true).subscribe(
        (res: any) => {
          window.location = res.url;
        },
        (err: any) => {
          console.log(err);
        }
      );
    } else if (account.calendarType == "outlook") {
      this.storage.set("auth_outlook_calendar", data);
      this._widgetService.addNewOutlookAccount(true).subscribe(
        (res: any) => {
          window.location = res.url;
        },
        (err: any) => {
          console.log(err);
        }
      );
    }
  }

  updateGoogleCalendarCredentials(payload) {
    let authData = this.storage.get("auth_google_calendar");
    this.loadingSpinner.show();
    payload.isWriteAccess = true;
    payload.requestSourceAccount = authData.account;
    this.storage.remove("auth_google_calendar");
    this._widgetService.updateGoogleCredentials(payload).subscribe(
      (res: any) => {
        this.storage.remove("googleAuthCode");
        this.accountList.forEach((element) => {
          if (element.id == res.object.userCalendarAccountModel.id) {
            element.isWriteAccess = true;
          }
        });
        // this._dataService.setAddedCalendarAccountList(this.accountList);
        // this.widgetLayoutDetails.addedCalendarAccounts = this.accountList;

        // update account access details to calendar widget data

        this.widgetLayoutDetails["addedCalendarAccounts"] = this.accountList;
        this.storage.set("activeWidgetDetails", this.widgetLayoutDetails);
        this._dataService.setWidgetSettingsLayout(this.widgetLayoutDetails);
        this.userCredentials = null;
        this.loadingSpinner.hide();
      },
      (err: any) => {
        this.userCredentials = null;
        this.storage.remove("googleAuthCode");
        this.toastr.error(err.error.message, "Error");
        this.loadingSpinner.hide();
      }
    );
  }

  updateOutlookCalendarCredentials(payload) {
    let authData = this.storage.get("auth_outlook_calendar");
    this.loadingSpinner.show();
    payload.isWriteAccess = true;
    payload.requestSourceAccount = authData.account;
    this.storage.remove("auth_outlook_calendar");
    this._widgetService.updateOutlookCredentials(payload).subscribe(
      (res: any) => {
        this.storage.remove("outlookAuthCode");
        this.accountList.forEach((element) => {
          if (element.id == res.object.userCalendarAccountModel.id) {
            element.isWriteAccess = true;
          }
        });

        // update account access details to calendar widget data

        this.widgetLayoutDetails["addedCalendarAccounts"] = this.accountList;
        this.storage.set("activeWidgetDetails", this.widgetLayoutDetails);
        this._dataService.setWidgetSettingsLayout(this.widgetLayoutDetails);
        this.userCredentials = null;
        this.loadingSpinner.hide();
      },
      (err: any) => {
        this.userCredentials = null;
        this.storage.remove("outlookAuthCode");
        this.toastr.error(err.error.message, "Error");
        this.loadingSpinner.hide();
      }
    );
  }

  onCheckboxChange(checked: boolean) {
    if (checked) {
      this.scrollToElement();
    }
  }

  scrollToElement() {
    setTimeout(() => {
      if (this.calendarAccountDetails) {
        this.calendarAccountDetails.nativeElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 0);
    // Scroll the element into view
  }
}
