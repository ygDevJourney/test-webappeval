import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class CountDownService {
  constructor(private http: HttpClient) {}

  updateCountDownSetting(payload: any) {
    return this.http.put(environment.baseURL + "countdown", payload);
  }
}
