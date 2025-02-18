import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from "@angular/core";
import { Router } from "@angular/router";
import { LocalStorageService } from "angular-web-storage";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { ToastrService } from "ngx-toastr";
import { DataService } from "src/app/service/data.service";
import { MirrorService } from "src/app/service/mirror.service";
import * as moment_t from "moment-timezone";

@Component({
  selector: "app-timezone",
  templateUrl: "./timezone.component.html",
  styleUrls: ["./timezone.component.scss"],
})
export class TimezoneComponent implements OnInit, OnChanges {
  @Input() activeMirror: any;
  @Input() timeZoneModal: any;
  @Output() emitTimezoneSetting: EventEmitter<any> = new EventEmitter<any>();

  currentTimezone: any;
  current_time = "01-01-1970 12:12";
  // availableTimeZoneList = timezones;
  availableTimeZoneList = moment_t.tz.names();
  constructor(
    private storage: LocalStorageService,
    private _dataService: DataService,
    private router: Router,
    private _mirror: MirrorService,
    private toastr: ToastrService,
    private loadingSpinner: Ng4LoadingSpinnerService
  ) {}

  ngOnInit() {}

  ngOnChanges(changes: any) {
    if (changes.activeMirror) {
      this.mapCurrentlySelectedTimezone(this.activeMirror.timeZoneId);
    }
  }

  mapCurrentlySelectedTimezone(timeZoneId) {
    this.currentTimezone = timeZoneId;
    let date = new Date();
    let dateFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timeZoneId,
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    let timeFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timeZoneId,
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    this.current_time =
      dateFormatter.format(date) + ", " + timeFormatter.format(date);

    // this.current_time = moment_t()
    //   .tz(this.activeMirror.timeZoneId)
    //   .format("MMMM D, YYYY, h:mm A");
  }

  updateTimeZone() {
    this.loadingSpinner.show();
    this._mirror
      .updateTimeZoneId(this.currentTimezone, this.activeMirror.id)
      .subscribe(
        (res: any) => {
          this.loadingSpinner.hide();
          this.activeMirror.timeZoneId = this.currentTimezone;
          this._dataService.setActiveMirrorDetails(this.activeMirror);
          this.backToMirrorSettingPage();
          this.timeZoneModal.hide();
        },
        (err: any) => {
          this.loadingSpinner.hide();
          this.toastr.error(err.error.message, "Error");
          this.timeZoneModal.hide();
        }
      );
  }

  selectTimezone() {
    // this.current_time = moment_t()
    //   .tz(this.currentTimezone)
    //   .format("MMMM D, YYYY, h:mm A");
    this.mapCurrentlySelectedTimezone(this.currentTimezone);
  }

  backToMirrorSettingPage() {
    this.router.navigateByUrl("mirrors/setting");
  }
}
