import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { LocalStorageService } from "angular-web-storage";
import { Router } from "@angular/router";
import { ApiCallLogService } from "../service/api-call-log.service";

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  response: any;

  constructor(
    private storage: LocalStorageService,
    private route: Router,
    private callLog: ApiCallLogService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const headers = new HttpHeaders({
      accept: "application/json",
      "accept-language": "en-US, en; q = 0.8",
      source: "webApp",
      "content-type": "application/json",
      "Access-Control-Allow-Origin": "*",
    });
    request = request.clone({ headers });
    if (
      !request.url.includes("/logIn") &&
      !request.url.includes("/signUp") &&
      this.storage.get("userDetails") !== null
    ) {
      let token = this.storage.get("userDetails").authToken;
      request = request.clone({
        headers: request.headers.set("authtoken", token),
      });
    }

    if (
      !request.url.includes("users/apilog") &&
      request.url.includes("api.mangomirror.com")
    ) {
      this.callLog.addLog(request);
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error.error.message === "Invalid User Token.") {
          this.storage.clear();
          this.route.navigate(["login"]);
        } else {
          if (error.error.error.message === "Mirror not registered") {
            error.error.error.message =
              "Unable to register device. Please check that the Display Device Code is entered correctly";
          } else {
            this.callLog.addLog(
              request,
              error.status.toString(),
              error.error.error.message
            );

            this.callLog.sendLogsToBackend().subscribe(
              (res: any) => {
                console.log("log sent");
              },
              (err: any) => {
                console.log(err);
              }
            );
          }
          return throwError(error.error);
        }
        /** Error actions */
      })
    );
  }
}
