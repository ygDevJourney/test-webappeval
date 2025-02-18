import {
  Component,
  OnInit,
  Input,
  OnChanges,
  Output,
  EventEmitter,
} from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { DataService } from "src/app/service/data.service";
import { WidgetService } from "src/app/service/widget.service";
import { CommonFunction } from "src/app/service/common-function.service";
import {
  LayoutRequest,
  WidgetBackgroundSetting,
} from "src/app/util/static-data";
import { LocalStorageService } from "angular-web-storage";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { QuotesService } from "src/app/service/quotes.service";
// import { WidgetBackgroundSetting } from "src/app/util/static-widgetsetting";

@Component({
  selector: "app-quote-setting",
  templateUrl: "./quotes.component.html",
  styleUrls: ["./quotes.component.scss"],
})
export class QuotesComponent implements OnInit, OnChanges {
  @Input() quoteSettingModal: any;
  @Input() category: string;
  @Input() activeLayout: any;
  @Input() quotesWidgetObject: any;

  quotesCategoryList: Array<any>;
  // quotesLengthList: Array<any>;
  selectedQuotesCategoryList = [5];
  lastSelectedQuotesCategoryList = [];
  selectedQuotesLength = 2;
  lastSelectedQuotesLength = 2;
  activeMirrorDetail: any;
  private widgetSettings = [];
  quotesWidget: any;
  settingDisplayflag: any;
  activeMirrorDetails: any;

  //background widget setting
  widgetType: any;
  widgetBgSetting: any;
  newBgSetting: any;
  widgetLayoutDetails: any;

  constructor(
    private toastr: ToastrService,
    private _dataService: DataService,
    private _quotesService: QuotesService,
    private commonFunction: CommonFunction,
    private storage: LocalStorageService,
    private loadingSpinner: Ng4LoadingSpinnerService
  ) {}

  ngOnInit() {}

  ngOnChanges(changes: any) {
    if (
      changes.quotesWidgetObject != null &&
      changes.quotesWidgetObject.currentValue != undefined
    ) {
      this._dataService
        .getActiveMirrorDetails()
        .subscribe((data) => (this.activeMirrorDetail = data));
      this._dataService.getWidgetSettingsLayout().subscribe((data) => {
        this.widgetLayoutDetails = data;
        this.widgetSettings = data.widgetSetting;
        this.quotesCategoryList = data.quotesDetails.quotesCategory;
        // this.quotesLengthList = data.quotesDetails.quotesLength;
      });

      this.setBackgroundWidgetDetail();
      this.activeMirrorDetails = this.storage.get("activeMirrorDetails");
      this.quotesWidget = this.quotesWidgetObject;
      this.selectedQuotesCategoryList =
        this.quotesWidget.data.selectedQuoteCategories;
      this.lastSelectedQuotesCategoryList = [
        ...this.quotesWidget.data.selectedQuoteCategories,
      ];
      // this.selectedQuotesLength = this.quotesWidget.data.selectedQuoteLength;
      // this.lastSelectedQuotesLength =
      //   this.quotesWidget.data.selectedQuoteLength;
    }
  }

  setBackgroundWidgetDetail() {
    this.widgetType = this.category;
    let widgetData = this.storage.get("selectedwidget");
    if (widgetData != null) {
      this.widgetBgSetting = widgetData.widgetBackgroundSettingModel;
    }
    this.activeMirrorDetails = this.storage.get("activeMirrorDetails");
  }

  updateQuotesLength(updatedLength) {
    this.selectedQuotesLength = updatedLength.id;
  }

  updateCategory(quoteId) {
    if (this.selectedQuotesCategoryList != undefined) {
      let ifExist = this.checkCategoryExist(quoteId);
      if (ifExist) {
        this.selectedQuotesCategoryList.splice(
          this.selectedQuotesCategoryList.indexOf(quoteId),
          1
        );
      } else {
        this.selectedQuotesCategoryList.push(quoteId);
      }
    }
  }

  checkCategoryExist(quoteId): boolean {
    let isExist: boolean = false;
    if (this.selectedQuotesCategoryList.length > 0) {
      this.selectedQuotesCategoryList.forEach((category) => {
        if (category === quoteId) {
          isExist = true;
        }
      });
    }
    return isExist;
  }

  getSelectedQuotesCategories() {
    let selectedQuotesCategories = [];

    if (this.selectedQuotesCategoryList.length == 0) {
      this.updateCategory("inspiration");
    }

    this.selectedQuotesCategoryList.forEach((categoryId) => {
      selectedQuotesCategories.push({ categoryType: categoryId });
    });

    return selectedQuotesCategories;
  }

  isChangeFound() {
    this.selectedQuotesCategoryList.sort((a, b) => b - a);
    let lastSelectedQuotesCategory = this.storage.get(
      "lastSelectedQuotesCategoryList"
    );
    if (lastSelectedQuotesCategory === null) {
      this.lastSelectedQuotesCategoryList = [5];
    } else {
      lastSelectedQuotesCategory.sort((a, b) => b - a);
    }

    if (
      JSON.stringify(this.selectedQuotesCategoryList) !=
        JSON.stringify(lastSelectedQuotesCategory) ||
      this.selectedQuotesLength != this.lastSelectedQuotesLength
    ) {
      return true;
    } else return false;
  }

  onbgsettingQuotesOptions(event) {
    this.newBgSetting = event;
    this.onAddBackgroundSetting();
  }

  saveQuotesSetting() {
    let payload = {
      quotesCategories: this.getSelectedQuotesCategories(),
      widgetSetting: {
        id: this.quotesWidgetObject.widgetSettingId,
      },
    };

    this.loadingSpinner.show();
    this._quotesService.updateQuotesSetting(payload).subscribe(
      (res: any) => {
        this.loadingSpinner.hide();
        this.toastr.success(res.message, "Success");
        this.widgetSettings.forEach((widgetPageData) => {
          widgetPageData.widgets.forEach((element) => {
            if (
              element.widgetSettingId ===
              this.quotesWidgetObject.widgetSettingId
            ) {
              element.data = res.object;
            }
          });
        });
        this.widgetLayoutDetails.widgetSetting = this.widgetSettings;
        this._dataService.setWidgetSettingsLayout(this.widgetLayoutDetails);
        this.quoteSettingModal.hide();
      },
      (err: any) => {
        this.loadingSpinner.hide();
        this.toastr.error(err.error.message, "Error");
      }
    );
  }

  onAddBackgroundSetting() {
    const quotesBgPayload = {
      userMirrorId: this.activeMirrorDetails.id,
      mastercategory: [this.quotesWidget.widgetMasterCategory],
      widgetBackgroundSettingModel: this.newBgSetting,
    };
    this.commonFunction.updateWidgetSettings(
      this.newBgSetting,
      quotesBgPayload
    );
    this.quoteSettingModal.hide();
  }

  dismissModel() {
    this.quotesWidget = this.quotesWidgetObject;
    this.selectedQuotesCategoryList = this.lastSelectedQuotesCategoryList;
    this.selectedQuotesLength = this.lastSelectedQuotesLength;
    this.quoteSettingModal.hide();
  }
}
