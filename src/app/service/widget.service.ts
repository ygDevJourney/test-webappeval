import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class WidgetService {
  constructor(private http: HttpClient) {}

  getwidgetLayoutSettings(layoutRequestData: any) {
    return this.http.post(
      environment.baseURL + "widgets/widgetSetting",
      layoutRequestData
    );
  }

  updateWidgetSettings(layoutRequestData: any) {
    return this.http.put(
      environment.baseURL + "widgets/activateMirror",
      layoutRequestData
    );
  }

  updateLayoutSettings(widgetsData: any) {
    return this.http.put(
      environment.baseURL + "widgets/mirrorLayoutSetting",
      widgetsData
    );
  }

  addNewGoogleAccount(isWriteAccess: boolean) {
    return this.http.get(
      environment.baseURL +
        "calendar/google/login/".concat(isWriteAccess.toString())
    );
  }

  updateGoogleCredentials(payload: any) {
    return this.http.post(
      environment.baseURL + "calendar/google/updateCredentials",
      payload
    );
  }

  getCalendarList(payload: any) {
    if (payload.calendarType == "icloud") {
      return this.http.get(
        environment.baseURL + "calendar/calendarList/icloud"
      );
    } else if (
      payload.calendarType.includes("ical") ||
      payload.calendarType.includes("ics") ||
      payload.calendarType.includes("mealplan")
    ) {
      return this.http.get(
        environment.baseURL + "calendar/calendarList/ical/" + payload.id
      );
    } else {
      return this.http.post(
        environment.baseURL + "calendar/calendarList",
        payload
      );
    }
  }

  addGooglePhotosAccount(type) {
    if (type == null || type == undefined || type == "background") {
      return this.http.get(
        environment.baseURL + "background/google/login/background"
      );
    } else {
      return this.http.get(
        environment.baseURL + "background/google/login/" + type
      );
    }
  }

  updateGooglePhotosCredentials(payload: any) {
    return this.http.post(
      environment.baseURL + "background/updateGoogleCredentials",
      payload
    );
  }

  deleteCalendarAccount(calendarId: any, calendarType: string) {
    return this.http.delete(
      environment.baseURL + "calendar/" + calendarId + "/" + calendarType
    );
  }

  addWidgetBgSetting(data) {
    return this.http.post(
      environment.baseURL + "widgets/backgroundSetting",
      data
    );
  }

  updateWidgetBgSetting(data) {
    return this.http.put(
      environment.baseURL + "widgets/backgroundSetting",
      data
    );
  }

  updateCalendarWidgetFormat(data) {
    return this.http.post(
      environment.baseURL + "calendar/calendarFormat",
      data
    );
  }

  updatePhotoCalendarSetting(data) {
    return this.http.post(environment.baseURL + "calendar/photoCalendar", data);
  }

  updateOutlookCredentials(payload: any) {
    return this.http.post(
      environment.baseURL + "calendar/outlook/updateCredentials",
      payload
    );
  }

  addNewOutlookAccount(isWriteAccess: boolean) {
    return this.http.get(
      environment.baseURL +
        "calendar/outlook/login/".concat(isWriteAccess.toString())
    );
  }

  checkHealthDataAvailability() {
    return this.http.get(environment.baseURL + "widgets/appleHealthCheck");
  }

  addNewWidget(payload: any) {
    return this.http.post(
      environment.baseURL + "widgets/addWidgetSetting",
      payload
    );
  }

  deleteExistingWidget(payload: any) {
    return this.http.put(
      environment.baseURL + "widgets/deleteWidgetSetting",
      payload
    );
  }

  removeGoogleBackgroundAccount(backgroundImageId: number, type: string) {
    return this.http.delete(
      environment.baseURL + "background/" + backgroundImageId + "/" + type
    );
  }

  updateIndexOfwidget(payload: any) {
    return this.http.put(
      environment.baseURL + "widgets/updateWidgetIndex",
      payload
    );
  }

  updateLayoutSequence(payload: any) {
    return this.http.put(
      environment.baseURL + "widgets/updateLayoutSequence",
      payload
    );
  }

  getBackgroundCategotyData() {
    return {
      calendarFlag: false, // everytime false
      userMirrorModel: {
        newsCountPerIteration: 5,
        mirror: {
          id: 520,
        },
        userRole: "general",
        backgroundImageStatus: true,
        backgroundImage: {
          imageBrightness: 50,
          imageDelayTime: 60,
          isGoogleImage: false,
          isFadeInOut: true,
          isAppleImage: false,
          isCropToFill: true,
          isMultipleImages: true, //everytime true
          isUnsplashImage: false,
          isDefaultUnsplashImage: true,
        },
      },
    };
  }
}
