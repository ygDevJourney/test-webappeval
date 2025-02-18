import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(private http: HttpClient) {}

  updateTimeZoneId(timezoneId: string) {
    return this.http.put(
      environment.baseURL + "users/timeZone",
      {},
      { params: { timeZone: timezoneId } }
    );
  }
}
