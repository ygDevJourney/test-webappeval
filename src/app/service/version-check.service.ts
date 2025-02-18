import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class VersionCheckService {
  private currentVersion: string;

  constructor(private http: HttpClient) {}

  getcurrentVersion() {
    return environment.version.toString();
  }

  initVersionCheck() {
    const currentTimeInMilliseconds = new Date().getTime();
    this.http
      .get(
        environment.appVersionURL + "?timestamp=" + currentTimeInMilliseconds
      )
      .subscribe(
        (remoteVersion: any) => {
          if (remoteVersion.version !== environment.version) {
            this.refreshApp();
          }
        },
        (error) => {
          console.error("Error checking remote version:", error);
        }
      );
  }

  refreshApp() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister();
        }
        window.location.reload();
      });
    }
  }
}
