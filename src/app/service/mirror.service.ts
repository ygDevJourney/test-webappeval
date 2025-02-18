import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class MirrorService {
  constructor(private http: HttpClient) {}

  getMirrorList() {
    return this.http.get(environment.baseURL + "userMirrors");
  }

  getMirrorDetails(macaddress: string) {
    return this.http.get(
      environment.baseURL + "mirrors/deviceId/" + macaddress
    );
  }

  activateMirror(data: any) {
    return this.http.put(environment.baseURL + "mirrors/activateMirror", data);
  }

  resetMirror(macAddress: any) {
    return this.http.get(environment.baseURL + "mirrors/reset/" + macAddress);
  }

  renameMirror(mirrorDetail: any) {
    return this.http.put(environment.baseURL + "userMirrors", mirrorDetail);
  }

  getDeviceDetails(deviceId) {
    return this.http.get(environment.baseURL + "mirrors/deviceId/" + deviceId);
  }

  addDeviceId(data) {
    return this.http.post(environment.baseURL + "mirrors/saveMirror", data);
  }

  callToTestPortal(major, minor, macAddress) {
    return this.http.get(
      environment.portalBaseURL +
        "?major=" +
        major +
        "&minor=" +
        minor +
        "&macaddress=" +
        macAddress
    );
  }

  addBackgrundSetting(data) {
    return this.http.post(
      environment.baseURL + "mirrors/backgroundSetting",
      data
    );
  }

  updateBackgrundSetting(data) {
    return this.http.put(
      environment.baseURL + "mirrors/backgroundSetting",
      data
    );
  }

  updateOrientation(payload) {
    return this.http.put(
      environment.baseURL + "mirrors/mirrorOrientation",
      payload
    );
  }

  updateTimeZoneId(timezoneId: string, userMirrorId: string) {
    const params = new HttpParams()
      .set("timeZone", timezoneId)
      .set("id", userMirrorId);
    return this.http.put(
      environment.baseURL + "userMirrors/timeZone",
      {},
      { params }
    );
  }

  updateTimeFormat(requestData: any) {
    return this.http.put(
      environment.baseURL + "mirrors/timeFormat",
      requestData
    );
  }

  updateDeviceCode(requestData: any) {
    return this.http.put(
      environment.baseURL + "mirrors/deviceCode",
      requestData
    );
  }

  createTemplate(requestData: any) {
    return this.http.post(
      environment.baseURL + "templates/createTemplate",
      requestData
    );
  }

  removeTemplates(requestData: any) {
    return this.http.put(
      environment.baseURL + "templates/removeTemplates",
      requestData
    );
  }

  applyTemplates(requestData: any) {
    return this.http.put(
      environment.baseURL + "templates/applyTemplate",
      requestData
    );
  }

  updateGesture(requestData: any) {
    return this.http.put(environment.baseURL + "mirrors/gesture", requestData);
  }

  updateOverlay(requestData: any) {
    return this.http.put(environment.baseURL + "mirrors/overlay", requestData);
  }
}
