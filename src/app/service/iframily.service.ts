import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class IframilyService {
  httpOptions: any;
  constructor(private http: HttpClient) {}

  updateIframilyWidgetSettings(iframilyWidgetRequestData: any) {
    return this.http.put(
      environment.baseURL + "iframily/",
      iframilyWidgetRequestData
    );
  }
  saveIframilyWidgetSettings(iframilyWidgetRequestData: any) {
    return this.http.post(
      environment.baseURL + "iframily/",
      iframilyWidgetRequestData
    );
  }

  getIframilyDetails(id: number) {
    return this.http.get(environment.baseURL + "iframily/" + id);
  }

  removeIframilyDetailsById(id: number) {
    return this.http.delete(environment.baseURL + "iframily/" + id);
  }
}
