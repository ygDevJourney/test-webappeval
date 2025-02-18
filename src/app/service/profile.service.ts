import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ProfileService {
  constructor(private http: HttpClient) {}

  editProfileAPI(payload: any) {
    return this.http.put(environment.baseURL + "users/editProfile", payload);
  }

  changePasswordAPI(payload: any) {
    return this.http.put(environment.baseURL + "users/changePassword", payload);
  }

  deleteProfile() {
    return this.http.delete(environment.baseURL + "users");
  }

  updateUnitMeasuresAPI(payload: any) {
    return this.http.put(environment.baseURL + "users/updateUnit", payload);
  }

  updateLanguage(language: string) {
    return this.http.put(environment.baseURL + "users/locale/" + language, {});
  }
}
