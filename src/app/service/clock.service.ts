import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ClockService {
  constructor(private http: HttpClient) {}

  updateClockSetting(payload: any) {
    return this.http.put(environment.baseURL + "clock", payload);
  }
}
