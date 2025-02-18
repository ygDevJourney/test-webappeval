import {
  Component,
  OnInit,
  Input,
  OnChanges,
  Output,
  EventEmitter,
} from "@angular/core";
import { DataService } from "src/app/service/data.service";
import { available_transition } from "src/app/util/static-data";

@Component({
  selector: "app-custom-time-picker",
  templateUrl: "./custom-time-picker.component.html",
  styleUrls: ["./custom-time-picker.component.scss"],
})
export class CustomTimePickerComponent implements OnInit, OnChanges {
  @Input() timePickerModal: any;
  @Input() timePickerObject: any;
  @Input() activeLayout: any;
  @Output() updateDelayEventEmitter = new EventEmitter();
  applyToAllScreen: boolean = false;
  widgetSettings: any;
  availableTransition = [...available_transition];

  minutes: number = 0;
  seconds: number = 30;
  selectedTransition: string = "fadeInOut";
  isAutoPageRotation: boolean = true;

  constructor(private _dataService: DataService) {}

  ngOnInit() {}

  ngOnChanges(change: any) {
    if (
      change.timePickerObject != undefined &&
      change.timePickerObject.currentValue != undefined
    ) {
      this.minutes = Math.floor(this.timePickerObject.delay / 60);
      this.seconds = this.timePickerObject.delay - this.minutes * 60;
      this.isAutoPageRotation = this.timePickerObject.isAutoPageRotation;
      if (this.minutes == 0 && this.seconds == 0) {
        this.minutes = 0;
        this.seconds = 30;
      }
      this.selectedTransition = this.timePickerObject.transition;
      this._dataService
        .getWidgetSettingsLayout()
        .subscribe((data) => (this.widgetSettings = data.widgetSetting));
    }
  }

  dismissModal() {
    this.timePickerModal.hide();
  }

  validateTimerValue() {
    if (
      !new RegExp("^[0-9]*$").test(this.minutes.toString()) ||
      !new RegExp("^[0-9]*$").test(this.seconds.toString())
    ) {
      this.minutes = 0;
      this.seconds = 30;
      return;
    }

    // Ensure values are within the valid range
    this.minutes = Math.min(Math.max(0, this.minutes), 900);
    this.seconds = Math.min(Math.max(0, this.seconds), 59);

    // If both minutes and seconds are 0, reset to default values
    if (this.minutes === 0 && this.seconds === 0) {
      this.minutes = 0;
      this.seconds = 30;
    } else if (this.minutes === 0 && this.seconds <= 10) {
      this.minutes = 0;
      this.seconds = 10;
    }
  }

  saveDelayTimerChanges() {
    let delayInSeconds = Number(this.minutes) * 60 + Number(this.seconds);
    if (this.applyToAllScreen) {
      this.widgetSettings.forEach((page) => {
        page.delay = delayInSeconds;
        page.transition = this.selectedTransition;
        page.isAutoPageRotation = this.isAutoPageRotation;
      });
    } else {
      this.widgetSettings[this.activeLayout].transition =
        this.selectedTransition;
      this.widgetSettings[this.activeLayout].delay = delayInSeconds;
      this.widgetSettings[this.activeLayout].isAutoPageRotation =
        this.isAutoPageRotation;
    }

    this.updateDelayEventEmitter.emit();
    this.applyToAllScreen = false;
    this.timePickerModal.hide();
  }
}
