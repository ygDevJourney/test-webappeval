import { Injectable, OnInit } from "@angular/core";
import { LocalStorageService } from "angular-web-storage";
import { DataService } from "../service/data.service";
import { SubscriptionCategory } from "./static-data";
import {
  newWidgetSetting,
  widgetPossitionSetting,
} from "./static-widgetsetting";

@Injectable({
  providedIn: "root",
})
export class WidgetsUtil implements OnInit {
  widgetList: any;
  widgetsettingLayout: any;
  position: any;
  subscriptionCategory = SubscriptionCategory;

  constructor(
    private _dataService: DataService,
    private storage: LocalStorageService
  ) {
    this._dataService.getWidgetsList().subscribe((widgets) => {
      if (widgets != null) {
        this.widgetList = widgets;
      }
    });

    this._dataService
      .getWidgetSettingsLayout()
      .subscribe((widgetsettingLayout) => {
        if (widgetsettingLayout != null) {
          this.widgetsettingLayout = widgetsettingLayout;
        }
      });
  }

  ngOnInit(): void {}

  getWidgetBytype(type, mastercategory) {
    let widgets = this.storage.get("widgets");
    if (widgets != null && widgets != undefined) {
      this.widgetList = widgets;
      this._dataService.setWidgetsList(widgets);
    }
    for (let i = 0; i < this.widgetList.length; i++) {
      let element = this.widgetList[i];
      if (element.type.toLowerCase() === type) {
        if (
          mastercategory != null &&
          element.mastercategory === mastercategory
        ) {
          return element;
        }
        return element;
      }
    }
  }

  getWidgetSetting(category): any {
    if (category == "notes") {
      category = "stickynotes";
    }
    let deviceRatio = this.storage.get("layoutrequest");
    let currentDeviceWidth = deviceRatio.payload.deviceWidth;
    let currentDeviceHeight = deviceRatio.payload.deviceHeight;

    let widget = newWidgetSetting;

    this.position = this.getWidgetPositionByWidgetType(category);
    widget.deviceWidth = currentDeviceWidth;
    widget.deviceHeight = currentDeviceHeight;

    widget.xPos = parseInt(this.position.xPos > 1 ? this.position.xPos : 1);
    widget.yPos = parseInt(this.position.yPos > 1 ? this.position.yPos : 1);
    widget.minHeight = parseInt(this.position.minHeight);
    widget.minWidth = parseInt(this.position.minWidth);
    widget.width = parseInt(this.position.width);
    widget.height = parseInt(this.position.height);
    let widgetDetail = this.getWidgetBytype(category, null);
    widget.widget.id = widgetDetail.id;
    widget.widget.masterCategory = widgetDetail.masterCategory;
    widget.widget.type = widgetDetail.type;
    widget.widget.displayName = widgetDetail.displayName;
    widget.viewType =
      widgetDetail.graphType == null || widgetDetail.graphType == "text"
        ? "text"
        : "graph";
    return widget;
  }

  getWidgetPositionByWidgetType(type: any): any {
    let deviceRatio = this.storage.get("layoutrequest");
    let currentDeviceWidth = deviceRatio.payload.deviceWidth;
    let currentDeviceHeight = deviceRatio.payload.deviceHeight;
    let oldDeviceWidth =
      widgetPossitionSetting["portrait.default.device.width"];
    let oldDeviceHeight =
      widgetPossitionSetting["portrait.default.device.height"];
    let key = "portrait.default." + type + ".widget.width";

    let iframyWidget = [
      "video",
      "google_doc",
      "microsoft_office_doc",
      "airtable",
      "pdf",
      "asana",
      "google_map",
      "embed_website",
      "embed_html",
    ];

    let widgetXPos = 1;
    let widgetYPos = 1;

    if (iframyWidget.indexOf(type) > -1) {
      widgetXPos =
        widgetPossitionSetting["portrait.default.iframily.widget.xpos"];
      widgetYPos =
        widgetPossitionSetting["portrait.default.iframily.widget.ypos"];
      type = "iframily";
    } else {
      widgetXPos =
        widgetPossitionSetting["portrait.default." + type + ".widget.xpos"];
      widgetYPos =
        widgetPossitionSetting["portrait.default." + type + ".widget.ypos"];
    }

    let widgetWidth =
      widgetPossitionSetting["portrait.default." + type + ".widget.width"];
    let widgetHeight =
      widgetPossitionSetting["portrait.default." + type + ".widget.height"] !=
      undefined
        ? widgetPossitionSetting["portrait.default." + type + ".widget.height"]
        : widgetPossitionSetting["portrait.default.height"];
    let widgetMinWidth =
      widgetPossitionSetting["portrait.default." + type + ".widget.minwidth"];
    let widgetMinHeight =
      widgetPossitionSetting[
        "portrait.default." + type + ".widget.minheight"
      ] != undefined
        ? widgetPossitionSetting[
            "portrait.default." + type + ".widget.minheight"
          ]
        : widgetPossitionSetting["portrait.default.minHeight"];

    let position = {
      xPos: 1,
      yPos: 5,
      width: 0,
      height: 0,
      minWidth: 0,
      minHeight: 0,
    };

    position.width = (widgetWidth * currentDeviceWidth) / oldDeviceWidth;
    position.height = (widgetHeight * currentDeviceHeight) / oldDeviceHeight;
    position.minHeight =
      (widgetMinHeight * currentDeviceHeight) / oldDeviceHeight;
    position.minWidth = (widgetMinWidth * currentDeviceWidth) / oldDeviceWidth;
    position.xPos = (widgetXPos * currentDeviceHeight) / oldDeviceHeight;
    position.yPos = (widgetYPos * currentDeviceHeight) / oldDeviceHeight;
    return position;
  }

  checkifCalendarWidgetExist() {
    for (let widgetPageData of this.widgetsettingLayout.widgetSetting) {
      for (let element of widgetPageData.widgets) {
        if (element.contentId == 3 && element.status == "on") {
          return true;
          break;
        }
      }
    }
    return false;
  }

  checkCalendarSubscriptionUpgradeStatus(
    category: string,
    currentPlanHirarchy: number
  ) {
    let subscriptionData = this.storage.get("subscriptionObject");
    if (
      subscriptionData == null ||
      (subscriptionData != null &&
        subscriptionData.stripeSubscriptionId == undefined)
    ) {
      return false;
    }
    let requireHirarchy = this.getWidgetRequiredHirarchy(category);
    if (requireHirarchy <= currentPlanHirarchy) {
      if (requireHirarchy == currentPlanHirarchy) {
        if (this.checkifCalendarWidgetExist()) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  getWidgetRequiredHirarchy(category: string) {
    let requiredHirarchy = 0;
    for (let index = 0; index < this.subscriptionCategory.length; index++) {
      if (
        this.subscriptionCategory[index].widgetType
          .toLowerCase()
          .includes(category.toLowerCase())
      ) {
        requiredHirarchy = this.subscriptionCategory[index].hirarchy;
        return requiredHirarchy;
      }
    }
    return requiredHirarchy;
  }

  getExistingWidgetCount(category) {
    let count = 0;
    for (let widgetPageData of this.widgetsettingLayout.widgetSetting) {
      for (let element of widgetPageData.widgets) {
        if (
          element.contentType.toLowerCase() == category &&
          element.status == "on"
        ) {
          count++;
        }
      }
    }
    return count;
  }
}
