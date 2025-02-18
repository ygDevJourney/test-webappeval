import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class WeatherService {
  constructor(private http: HttpClient) {}

  updateWeatherSetting(payload: any) {
    return this.http.put(environment.baseURL + "weather", payload);
  }
}
