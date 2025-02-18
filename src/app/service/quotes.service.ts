import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class QuotesService {
  constructor(private http: HttpClient) {}

  updateQuotesSetting(payload: any) {
    return this.http.put(environment.baseURL + "quotes", payload);
  }
}
