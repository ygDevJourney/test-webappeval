import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class CalendarService {
  constructor(private http: HttpClient) {}

  updateCalendarColor(
    payload: any,
    accountId: number,
    widgetSettingId: string
  ) {
    return this.http.put(
      environment.baseURL +
        "calendar/ical/updateCalendarColor/" +
        accountId +
        "/" +
        widgetSettingId,
      payload
    );
  }

  updateCalendarList(payload: any) {
    return this.http.put(
      environment.baseURL + "calendar/updateCalendar",
      payload
    );
  }

  updateIcloudCredentials(payload: any) {
    return this.http.post(
      environment.baseURL + "calendar/icloudcredentials",
      payload
    );
  }
}
