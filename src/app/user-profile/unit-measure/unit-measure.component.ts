import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LocalStorageService } from "angular-web-storage";
import { Validator } from "src/app/util/validator";
import { TranslateService } from "@ngx-translate/core";
import { ProfileService } from "src/app/service/profile.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-unit-measure",
  templateUrl: "./unit-measure.component.html",
  styleUrls: ["./unit-measure.component.scss"]
})
export class UnitMeasureComponent implements OnInit {
  data: any;

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
    let userData = this.storage.get("userDetails");
    this.data = {
      weightUnit: {
        unit: "Weight",
        measure: ["Kilograms", "Pounds"],
        activeUnit: userData.weightUnit
      },
      distanceUnit: {
        unit: "Length",
        measure: ["Kilometers", "Miles"],
        activeUnit: userData.distanceUnit
      },
      waterUnit: {
        unit: "Water",
        measure: ["Fluid Ounces(oz)", "Mililiters(ml)", "Cups(US)"],
        activeUnit: userData.waterUnit
      },
      bloodGlucoseUnit: {
        unit: "Blood Glucose",
        measure: ["Mgdl", "Mmol"],
        activeUnit: userData.bloodGlucoseUnit
      },
      temperatureUnit: {
        unit: "Temperature",
        measure: ["Celsius", "Fahrenheit"],
        activeUnit: userData.temperatureUnit
      }
    };
  }

  changeUnitMeasure(measure: any, newUnit: string) {
    switch (measure.unit) {
      case "Weight":
        this.data.weightUnit.activeUnit = newUnit;
        break;
      case "Length":
        this.data.distanceUnit.activeUnit = newUnit;
        break;
      case "Water":
        this.data.waterUnit.activeUnit = newUnit;
        break;
      case "Blood Glucose":
        this.data.bloodGlucoseUnit.activeUnit = newUnit;
        break;
      case "Temperature":
        this.data.temperatureUnit.activeUnit = newUnit;
        break;
      default: console.error("Unable to update measure.")
        break;
    }
  }

  saveUnitMeasureChanges() {
    let payload = {
      distanceUnit: this.data.distanceUnit.activeUnit,
      waterUnit: this.data.waterUnit.activeUnit,
      weightUnit: this.data.weightUnit.activeUnit,
      temperatureUnit: this.data.temperatureUnit.activeUnit,
      bloodGlucoseUnit: this.data.bloodGlucoseUnit.activeUnit
    };
    this._profileService.updateUnitMeasuresAPI(payload).subscribe(
      (res: any) => {
        this.toastr.success(res.message, "Success");
        let userData = this.storage.get("userDetails");
        userData.weightUnit = payload.weightUnit;
        userData.distanceUnit = payload.distanceUnit;
        userData.waterUnit = payload.waterUnit;
        userData.bloodGlucoseUnit = payload.bloodGlucoseUnit;
        userData.temperatureUnit = payload.temperatureUnit;
        this.storage.set("userDetails", userData);
        this.route.navigate(["user-profile"]);
      },
      (err: any) => {
        this.toastr.error("Something went wrong, Please try again.", "Error")
        this.ngOnInit();
      }
    );
  }

  discardChanges() {
    this.route.navigate(["user-profile"]);
  }
}
